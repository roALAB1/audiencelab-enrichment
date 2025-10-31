
import React, { useState, useCallback, useContext, useMemo } from 'react';
import Card, { CardHeader, CardTitle } from '../../components/ui/Card';
import { UploadCloud, FileIcon, CheckCircle, XCircle, AlertTriangle } from '../../components/ui/icons';
import { ALL_FIELDS, FIELD_PACKAGES } from '../../constants';
import { Field, FieldCategory, ValidationResult } from '../../types';
import { CreditSystemContext } from '../../App';
import { enrichContactsJobBased, EnrichmentJob } from '../../services/audienceLabAPI';
import ProgressTracker, { ProgressData } from '../../components/ProgressTracker';
import ResultsTable from '../../components/ResultsTable';
import ColumnMappingStep from './ColumnMappingStep';
import { parseCSV, ParsedCSV } from '../../utils/csvParser';
import type { ColumnMapping, MatchOperator } from '../../types/columnMapping';

type EnrichmentStatus = 'idle' | 'submitting' | 'polling' | 'downloading' | 'complete' | 'error';

const EnrichmentTab = () => {
    // File and CSV data
    const [file, setFile] = useState<File | null>(null);
    const [parsedCSV, setParsedCSV] = useState<ParsedCSV | null>(null);
    
    // Column mapping for multi-field input
    const [columnMappings, setColumnMappings] = useState<ColumnMapping[]>([]);
    const [matchOperator, setMatchOperator] = useState<MatchOperator>('OR');
    
    // Validation and enrichment
    const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
    const [selectedFields, setSelectedFields] = useState<string[]>(FIELD_PACKAGES.find(p => p.id === 'basic')?.fields as string[] || []);
    const [activePackage, setActivePackage] = useState<string>('basic');
    const [status, setStatus] = useState<EnrichmentStatus>('idle');
    const [progress, setProgress] = useState<ProgressData | null>(null);
    const [jobStatus, setJobStatus] = useState<string>('');  // Job status message
    const [currentJob, setCurrentJob] = useState<EnrichmentJob | null>(null);
    const [results, setResults] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    
    // Job-based API doesn't need concurrency/batch settings
    // Keeping for UI compatibility but not used
    const [concurrency, setConcurrency] = useState(5);
    const [batchSize, setBatchSize] = useState(1000);
    
    const creditSystem = useContext(CreditSystemContext);

    const handleFileChange = (files: FileList | null) => {
        if (files && files[0]) {
            setFile(files[0]);
            processFile(files[0]);
            // Reset previous state
            setResults([]);
            setStatus('idle');
            setError(null);
            setColumnMappings([]);
            setParsedCSV(null);
        }
    };
    
    const processFile = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            try {
                const parsed = parseCSV(text);
                setParsedCSV(parsed);
                // Validate the parsed data
                validateParsedCSV(parsed);
            } catch (error) {
                setError(`Failed to parse CSV: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        };
        reader.readAsText(file);
    };

    const validateEmail = (email: string) => {
        const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        const trimmed = email.toLowerCase().trim();
        return { valid: regex.test(trimmed), email: trimmed, error: regex.test(trimmed) ? null : 'Invalid format' };
    };

    const validateEmailBatch = (emails: string[]) => {
        const results: ValidationResult = { valid: [], invalid: [], duplicates: [], total: emails.length };
        const seen = new Set<string>();
        emails.forEach(email => {
            const validation = validateEmail(email);
            if (!validation.valid) {
                results.invalid.push({ email, reason: validation.error || 'Unknown error' });
            } else if (seen.has(validation.email)) {
                results.duplicates.push(validation.email);
            } else {
                results.valid.push(validation.email);
                seen.add(validation.email);
            }
        });
        setValidationResult(results);
    };

    const validateParsedCSV = (parsed: ParsedCSV) => {
        // Initial validation - just count rows
        // Detailed validation happens after column mapping
        const results: ValidationResult = {
            valid: [],
            invalid: [],
            duplicates: [],
            total: parsed.data.length
        };
        setValidationResult(results);
    };

    // Validate records based on column mappings
    const validateMappedRecords = useCallback(() => {
        if (!parsedCSV || columnMappings.length === 0) return;

        const enabledMappings = columnMappings.filter(m => m.enabled && m.audienceLabField);
        if (enabledMappings.length === 0) {
            setValidationResult({
                valid: [],
                invalid: [],
                duplicates: [],
                total: parsedCSV.data.length
            });
            return;
        }

        const results: ValidationResult = { valid: [], invalid: [], duplicates: [], total: parsedCSV.data.length };
        const seen = new Set<string>();

        parsedCSV.data.forEach((row, index) => {
            // Build a unique key from all enabled mapped fields
            const keyParts: string[] = [];
            let hasAnyValue = false;

            for (const mapping of enabledMappings) {
                const value = row[mapping.csvColumn];
                if (value && value.trim()) {
                    keyParts.push(value.trim().toLowerCase());
                    hasAnyValue = true;
                }
            }

            const uniqueKey = keyParts.join('|');

            if (!hasAnyValue) {
                results.invalid.push({ email: `Row ${index + 1}`, reason: 'No mapped values found' });
            } else if (seen.has(uniqueKey)) {
                results.duplicates.push(uniqueKey);
            } else {
                results.valid.push(uniqueKey);
                seen.add(uniqueKey);
            }
        });

        setValidationResult(results);
    }, [parsedCSV, columnMappings]);
    
    const handleFieldToggle = (fieldId: string) => {
        setActivePackage('custom');
        setSelectedFields(prev => prev.includes(fieldId) ? prev.filter(id => id !== fieldId) : [...prev, fieldId]);
    };

    const handlePackageSelect = (pkgId: string) => {
        setActivePackage(pkgId);
        const pkg = FIELD_PACKAGES.find(p => p.id === pkgId);
        if (pkg) {
            if (pkg.fields === 'all') {
                setSelectedFields(ALL_FIELDS.map(f => f.id));
            } else {
                setSelectedFields(pkg.fields);
            }
        }
    };

    // Trigger validation when column mappings change
    React.useEffect(() => {
        if (columnMappings.length > 0) {
            validateMappedRecords();
        }
    }, [columnMappings, validateMappedRecords]);

    const groupedFields = useMemo(() => {
        return ALL_FIELDS.reduce((acc, field) => {
            if (!acc[field.category]) {
                acc[field.category] = [];
            }
            acc[field.category].push(field);
            return acc;
        }, {} as Record<FieldCategory, Field[]>);
    }, []);

    const costEstimate = useMemo(() => {
        if (!creditSystem || !validationResult) return null;
        return creditSystem.estimateCredits(validationResult.valid.length, selectedFields);
    }, [creditSystem, validationResult, selectedFields]);

    const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); };
    const handleDrop = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); handleFileChange(e.dataTransfer.files); };

    // Start enrichment with job-based API
    const handleStartEnrichment = async () => {
        if (!validationResult || !costEstimate || !creditSystem || !parsedCSV) {
            console.error('❌ Missing required data');
            return;
        }

        // Build records from column mappings
        const enabledMappings = columnMappings.filter(m => m.enabled && m.audienceLabField);
        if (enabledMappings.length === 0) {
            setError('Please select at least one column to use for matching');
            return;
        }

        // Build records array with mapped fields
        const records = parsedCSV.data.map(row => {
            const record: Record<string, string> = {};
            enabledMappings.forEach(mapping => {
                const value = row[mapping.csvColumn];
                if (value && mapping.audienceLabField) {
                    record[mapping.audienceLabField] = value.trim();
                }
            });
            return record;
        }).filter(record => Object.keys(record).length > 0); // Remove empty records

        // Build columns array
        const columns = enabledMappings
            .map(m => m.audienceLabField)
            .filter((col): col is string => col !== null);

        setError(null);
        setResults([]);
        setProgress(null);
        setCurrentJob(null);
        
        const startTime = Date.now();
        const jobName = `Enrichment_${new Date().toISOString().replace(/[:.]/g, '-')}`;

        try {
            const enrichedContacts = await enrichContactsJobBased(
                jobName,
                records,
                columns,
                matchOperator,
                selectedFields,
                (statusUpdate) => {
                    // Update status based on stage
                    setStatus(statusUpdate.stage);
                    
                    // Update job status message
                    if (statusUpdate.stage === 'submitting') {
                        setJobStatus('Submitting enrichment job...');
                    } else if (statusUpdate.stage === 'polling') {
                        if (statusUpdate.job) {
                            setCurrentJob(statusUpdate.job);
                            setJobStatus(`Job Status: ${statusUpdate.job.status}`);
                        }
                    } else if (statusUpdate.stage === 'downloading') {
                        setJobStatus('Downloading results...');
                    }

                    // Update progress bar
                    if (statusUpdate.progress !== undefined) {
                        setProgress({
                            totalBatches: 1,
                            completedBatches: statusUpdate.progress > 90 ? 1 : 0,
                            totalEmails: validationResult.valid.length,
                            processedEmails: Math.floor((validationResult.valid.length * statusUpdate.progress) / 100),
                            percentage: statusUpdate.progress,
                            creditsUsed: Math.floor((costEstimate.total_credits * statusUpdate.progress) / 100),
                            startTime,
                        });
                    }
                }
            );

            // Calculate processing time
            const endTime = Date.now();
            const processingTime = ((endTime - startTime) / 1000).toFixed(1);

            // Update results
            setResults(enrichedContacts);
            setStatus('complete');
            setJobStatus(`Completed! Enriched ${enrichedContacts.length} contacts in ${processingTime}s`);

            // Consume credits
            // TODO: Credit calculation may be inaccurate - AudienceLab returns all 74 fields regardless of selection
            // The actual cost should come from the AudienceLab API response, not our estimate
            // For now, using the estimate based on selected fields
            creditSystem.consumeCredits(costEstimate.total_credits);

            console.log(`✅ Enrichment complete! ${enrichedContacts.length} contacts in ${processingTime}s`);

        } catch (err) {
            console.error('Enrichment error:', err);
            setError(err instanceof Error ? err.message : 'An error occurred during enrichment');
            setStatus('error');
            setJobStatus('Error occurred');
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-slate-800">Enrichment</h1>
            
            {(status === 'submitting' || status === 'polling' || status === 'downloading') && (
                <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                        <h3 className="font-semibold text-blue-900">{jobStatus}</h3>
                    </div>
                    {currentJob && (
                        <div className="text-sm text-blue-700 space-y-1">
                            <p>Job ID: <code className="bg-blue-100 px-2 py-0.5 rounded">{currentJob.id}</code></p>
                            <p>Total Contacts: <strong>{currentJob.total}</strong></p>
                            <p>Created: <strong>{new Date(currentJob.created_at).toLocaleString()}</strong></p>
                        </div>
                    )}
                    {progress && (
                        <div className="mt-4">
                            <div className="flex justify-between text-sm text-blue-700 mb-2">
                                <span>Progress</span>
                                <span>{progress.percentage}%</span>
                            </div>
                            <div className="w-full bg-blue-200 rounded-full h-2">
                                <div 
                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${progress.percentage}%` }}
                                ></div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {status === 'complete' && results.length > 0 && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <h3 className="font-semibold text-green-900">Enrichment Complete!</h3>
                    </div>
                    <p className="text-sm text-green-700">
                        Successfully enriched <strong>{results.length}</strong> contact{results.length !== 1 ? 's' : ''} in <strong>{progress?.startTime ? ((Date.now() - progress.startTime) / 1000).toFixed(1) : '0.0'}s</strong>
                    </p>
                </div>
            )}

            {status === 'complete' && results.length > 0 && (
                <div className="p-4 bg-white border border-slate-200 rounded-lg">
                    <p className="text-green-800 font-semibold">
                        ✅ Enrichment Complete!
                    </p>
                    <p className="text-sm text-green-700 mt-1">
                        Successfully enriched {results.length.toLocaleString()} contacts
                        {costEstimate && ` using ${costEstimate.total_credits.toLocaleString()} credits`}
                    </p>
                </div>
            )}

            {status === 'error' && error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800 font-semibold">❌ Enrichment Failed</p>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader><CardTitle>1. Upload CSV File</CardTitle></CardHeader>
                        {!file ? (
                             <label htmlFor="file-upload" className="cursor-pointer">
                                <div onDragOver={handleDragOver} onDrop={handleDrop} className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-slate-300 rounded-lg text-center hover:border-blue-500 transition-colors">
                                    <UploadCloud className="w-12 h-12 text-slate-400 mb-4" />
                                    <p className="font-semibold text-slate-700">Drag and drop CSV file here</p>
                                    <p className="text-sm text-slate-500">or click to browse</p>
                                    <p className="text-xs text-slate-400 mt-4">Max file size: 50 MB</p>
                                </div>
                                <input id="file-upload" type="file" className="hidden" accept=".csv" onChange={(e) => handleFileChange(e.target.files)} />
                             </label>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex items-center p-4 bg-slate-50 border border-slate-200 rounded-lg">
                                    <FileIcon className="w-8 h-8 text-blue-500 mr-4"/>
                                    <div className="flex-1">
                                        <p className="font-semibold text-slate-800">{file.name}</p>
                                        <p className="text-sm text-slate-500">{(file.size / 1024).toFixed(2)} KB</p>
                                    </div>
                                    <button 
                                        onClick={() => { 
                                            setFile(null); 
                                            setValidationResult(null); 
                                            setResults([]);
                                            setStatus('idle');
                                        }} 
                                        className="text-slate-400 hover:text-red-500"
                                        disabled={status === 'processing'}
                                    >
                                        <XCircle />
                                    </button>
                                </div>
                                {validationResult && (
                                    <Card className="bg-slate-50">
                                        <CardTitle className="text-base mb-2">Email Validation Results</CardTitle>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div className="flex items-center"><CheckCircle className="text-green-500 mr-2" /> Valid emails: <span className="font-bold ml-1">{validationResult.valid.length}</span></div>
                                            <div className="flex items-center"><XCircle className="text-red-500 mr-2" /> Invalid emails: <span className="font-bold ml-1">{validationResult.invalid.length}</span></div>
                                            <div className="flex items-center"><AlertTriangle className="text-amber-500 mr-2" /> Duplicates removed: <span className="font-bold ml-1">{validationResult.duplicates.length}</span></div>
                                        </div>
                                        <div className="mt-4 pt-4 border-t border-slate-200">
                                            <p className="font-semibold">Total to enrich: {validationResult.valid.length} emails</p>
                                        </div>
                                    </Card>
                                )}
                            </div>
                        )}
                    </Card>

                    {parsedCSV && (
                        <Card>
                            <CardHeader><CardTitle>2. Map Input Columns</CardTitle></CardHeader>
                            <ColumnMappingStep
                                csvColumns={parsedCSV.columns}
                                sampleData={parsedCSV.data[0] || {}}
                                onMappingsChange={setColumnMappings}
                                onOperatorChange={setMatchOperator}
                            />
                        </Card>
                    )}

                    <Card>
                        <CardHeader><CardTitle>3. Select Fields to Enrich</CardTitle></CardHeader>
                        <div className="flex flex-wrap gap-2 mb-6">
                            {FIELD_PACKAGES.map(pkg => (
                                <button 
                                    key={pkg.id} 
                                    onClick={() => handlePackageSelect(pkg.id)} 
                                    className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${activePackage === pkg.id ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                                    disabled={status === 'processing'}
                                >
                                    {pkg.name} - {pkg.total_credits} credits
                                </button>
                            ))}
                             <button 
                                onClick={() => setActivePackage('custom')} 
                                className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${activePackage === 'custom' ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                                disabled={status === 'processing'}
                            >
                                Custom
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-96 overflow-y-auto p-1">
                            {Object.entries(groupedFields).map(([category, fields]) => (
                                <div key={category}>
                                    <h4 className="font-semibold capitalize text-slate-700 mb-2">{category.replace('_', ' ')}</h4>
                                    <div className="space-y-2">
                                        {fields.map(field => (
                                            <label key={field.id} className="flex items-center p-2 rounded-md hover:bg-slate-50 text-sm">
                                                <input 
                                                    type="checkbox" 
                                                    checked={selectedFields.includes(field.id)} 
                                                    onChange={() => handleFieldToggle(field.id)} 
                                                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                                    disabled={status === 'processing'}
                                                />
                                                <span className="ml-3 text-slate-600">{field.name}</span>
                                                <span className="ml-auto text-xs text-slate-400 font-mono">({field.cost}cr)</span>
                                                {field.icon && <span className="ml-1 text-xs">{field.icon}</span>}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <CardHeader><CardTitle>💰 Cost Estimator</CardTitle></CardHeader>
                        {!costEstimate ? (
                             <p className="text-sm text-slate-500">Upload a file and select fields to see the cost estimate.</p>
                        ) : (
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between"><span>Emails to enrich:</span> <span className="font-semibold">{costEstimate.emails.toLocaleString()}</span></div>
                                <div className="flex justify-between"><span>Fields selected:</span> <span className="font-semibold">{selectedFields.length}</span></div>
                                <div className="flex justify-between"><span>Credits per contact:</span> <span className="font-semibold">{costEstimate.credits_per_contact}</span></div>
                                <hr className="my-2" />
                                <div className="flex justify-between text-base">
                                    <span className="font-semibold">Total Credits:</span> 
                                    <span className="font-bold text-blue-600">{costEstimate.total_credits.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between"><span>Current Balance:</span> <span className="font-semibold">{costEstimate.current_balance.toLocaleString()}</span></div>
                                {costEstimate.can_afford ? (
                                    <div className="flex justify-between text-green-600">
                                        <span>Remaining After:</span> 
                                        <span className="font-semibold">{costEstimate.remaining_after.toLocaleString()}</span>
                                    </div>
                                ) : (
                                     <div className="flex justify-between text-red-600">
                                        <span>Shortfall:</span> 
                                        <span className="font-semibold">{costEstimate.shortfall.toLocaleString()}</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>⚙️ Processing Settings</CardTitle></CardHeader>
                        <div className="space-y-4 text-sm">
                            <div>
                                <label className="block text-slate-700 font-semibold mb-2">
                                    Parallel Batches: {concurrency}
                                </label>
                                <input 
                                    type="range" 
                                    min="1" 
                                    max="20" 
                                    value={concurrency} 
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value);
                                        setConcurrency(val);
                                        localStorage.setItem('enrichment_concurrency', val.toString());
                                    }}
                                    className="w-full"
                                    disabled={status === 'processing'}
                                />
                                <p className="text-xs text-slate-500 mt-1">Process {concurrency} batches simultaneously</p>
                            </div>
                            <div>
                                <label className="block text-slate-700 font-semibold mb-2">
                                    Batch Size: {batchSize}
                                </label>
                                <input 
                                    type="range" 
                                    min="100" 
                                    max="1000" 
                                    step="100" 
                                    value={batchSize} 
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value);
                                        setBatchSize(val);
                                        localStorage.setItem('enrichment_batch_size', val.toString());
                                    }}
                                    className="w-full"
                                    disabled={status === 'processing'}
                                />
                                <p className="text-xs text-slate-500 mt-1">{batchSize} emails per batch</p>
                            </div>
                        </div>
                    </Card>

                    <button 
                        onClick={() => {
                            console.log('🖱️ Button clicked - Disabled:', !costEstimate || !costEstimate.can_afford || status === 'processing');
                            console.log('📋 Button state:', { costEstimate: !!costEstimate, can_afford: costEstimate?.can_afford, status });
                            handleStartEnrichment();
                        }}
                        disabled={!costEstimate || !costEstimate.can_afford || status === 'processing'} 
                        className="w-full bg-blue-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center justify-center text-lg"
                    >
                        {status === 'processing' ? '⏳ Processing...' : '🚀 Start Enrichment'}
                        {costEstimate && status !== 'processing' && ` - Use ${costEstimate.total_credits.toLocaleString()} Credits`}
                    </button>
                </div>
            </div>

            {/* Results Table */}
            {results.length > 0 && (
                <ResultsTable 
                    data={results} 
                    fields={results.length > 0 ? Object.keys(results[0]) : []}
                    onExport={(format) => {
                        console.log(`Exported ${results.length} contacts as ${format}`);
                    }}
                />
            )}
        </div>
    );
};

export default EnrichmentTab;

