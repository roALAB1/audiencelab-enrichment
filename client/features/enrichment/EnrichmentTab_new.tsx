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
    
    // Column mapping
    const [columnMappings, setColumnMappings] = useState<ColumnMapping[]>([]);
    const [matchOperator, setMatchOperator] = useState<MatchOperator>('OR');
    
    // Validation and enrichment
    const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
    const [selectedFields, setSelectedFields] = useState<string[]>(FIELD_PACKAGES.find(p => p.id === 'basic')?.fields as string[] || []);
    const [activePackage, setActivePackage] = useState<string>('basic');
    const [status, setStatus] = useState<EnrichmentStatus>('idle');
    const [progress, setProgress] = useState<ProgressData | null>(null);
    const [jobStatus, setJobStatus] = useState<string>('');
    const [currentJob, setCurrentJob] = useState<EnrichmentJob | null>(null);
    const [results, setResults] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    
    // Job-based API doesn't need concurrency/batch settings
    const [concurrency] = useState(5);
    const [batchSize] = useState(1000);
    
    const creditSystem = useContext(CreditSystemContext);

    /**
     * Handle file upload
     */
    const handleFileChange = (files: FileList | null) => {
        if (files && files[0]) {
            setFile(files[0]);
            processFile(files[0]);
            // Reset previous results
            setResults([]);
            setStatus('idle');
            setError(null);
            setColumnMappings([]);
        }
    };
    
    /**
     * Process uploaded CSV file
     */
    const processFile = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            
            // Parse CSV properly
            const parsed = parseCSV(text);
            setParsedCSV(parsed);
            
            // Validate based on mapped input columns
            validateParsedCSV(parsed, []);
        };
        reader.readAsText(file);
    };

    /**
     * Validate parsed CSV data
     * For now, just count total rows as "valid"
     * We'll validate specific fields based on column mappings
     */
    const validateParsedCSV = (parsed: ParsedCSV, mappings: ColumnMapping[]) => {
        // Count rows with at least one enabled mapped field
        const validRows: string[] = [];
        const invalidRows: { email: string; reason: string }[] = [];
        const duplicates: string[] = [];
        
        if (mappings.length === 0 || mappings.every(m => !m.enabled)) {
            // No mappings yet, just count all rows as valid
            const results: ValidationResult = {
                valid: parsed.data.map((_, idx) => `row_${idx}`),
                invalid: [],
                duplicates: [],
                total: parsed.rowCount,
            };
            setValidationResult(results);
            return;
        }

        // Validate based on enabled mappings
        const seen = new Set<string>();
        
        parsed.data.forEach((row, idx) => {
            // Check if at least one enabled field has a value
            const hasValue = mappings
                .filter(m => m.enabled && m.audienceLabField)
                .some(m => {
                    const value = row[m.csvColumn];
                    return value && value.trim().length > 0;
                });

            if (!hasValue) {
                invalidRows.push({
                    email: `row_${idx}`,
                    reason: 'No valid input fields',
                });
                return;
            }

            // Create a unique key from all enabled fields
            const key = mappings
                .filter(m => m.enabled && m.audienceLabField)
                .map(m => row[m.csvColumn] || '')
                .join('|')
                .toLowerCase();

            if (seen.has(key)) {
                duplicates.push(`row_${idx}`);
            } else {
                validRows.push(`row_${idx}`);
                seen.add(key);
            }
        });

        const results: ValidationResult = {
            valid: validRows,
            invalid: invalidRows,
            duplicates,
            total: parsed.rowCount,
        };
        
        setValidationResult(results);
    };

    /**
     * Handle column mapping changes
     */
    const handleMappingsChange = useCallback((mappings: ColumnMapping[]) => {
        setColumnMappings(mappings);
        
        // Re-validate with new mappings
        if (parsedCSV) {
            validateParsedCSV(parsedCSV, mappings);
        }
    }, [parsedCSV]);

    /**
     * Handle match operator change
     */
    const handleOperatorChange = useCallback((operator: MatchOperator) => {
        setMatchOperator(operator);
    }, []);
    
    /**
     * Handle field selection for enrichment output
     */
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

    const groupedFields = useMemo(() => {
        return ALL_FIELDS.reduce((acc, field) => {
            if (!acc[field.category]) {
                acc[field.category] = [];
            }
            acc[field.category].push(field);
            return acc;
        }, {} as Record<FieldCategory, Field[]>);
    }, []);

    /**
     * Cost estimation
     */
    const costEstimate = useMemo(() => {
        if (!creditSystem || !validationResult) return null;
        return creditSystem.estimateCredits(validationResult.valid.length, selectedFields);
    }, [creditSystem, validationResult, selectedFields]);

    const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); };
    const handleDrop = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); handleFileChange(e.dataTransfer.files); };

    /**
     * Start enrichment with job-based API
     */
    const handleStartEnrichment = async () => {
        if (!validationResult || !costEstimate || !creditSystem || !parsedCSV) {
            console.error('❌ Missing required data');
            return;
        }

        // Get enabled column mappings
        const enabledMappings = columnMappings.filter(m => m.enabled && m.audienceLabField);
        
        if (enabledMappings.length === 0) {
            setError('Please select at least one input column for matching');
            return;
        }

        setError(null);
        setResults([]);
        setProgress(null);
        setCurrentJob(null);
        
        const startTime = Date.now();
        const jobName = `Enrichment_${new Date().toISOString().replace(/[:.]/g, '-')}`;

        try {
            // Build records with mapped columns
            const records = parsedCSV.data
                .filter((_, idx) => validationResult.valid.includes(`row_${idx}`))
                .map(row => {
                    const record: Record<string, string> = {};
                    enabledMappings.forEach(mapping => {
                        if (mapping.audienceLabField) {
                            record[mapping.audienceLabField] = row[mapping.csvColumn] || '';
                        }
                    });
                    return record;
                });

            // Get column names for API
            const columns = enabledMappings
                .map(m => m.audienceLabField)
                .filter((col): col is string => col !== null);

            const enrichedContacts = await enrichContactsJobBased(
                jobName,
                records,
                columns,
                matchOperator,
                selectedFields,
                (statusUpdate) => {
                    setStatus(statusUpdate.stage);
                    
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

            const endTime = Date.now();
            const processingTime = ((endTime - startTime) / 1000).toFixed(1);

            setResults(enrichedContacts);
            setStatus('complete');
            setJobStatus(`Completed! Enriched ${enrichedContacts.length} contacts in ${processingTime}s`);

            creditSystem.consumeCredits(costEstimate.total_credits);

            console.log(`✅ Enrichment complete! ${enrichedContacts.length} contacts in ${processingTime}s`);

        } catch (err) {
            console.error('Enrichment error:', err);
            setError(err instanceof Error ? err.message : 'An error occurred during enrichment');
            setStatus('error');
            setJobStatus('Error occurred');
        }
    };

    // TO BE CONTINUED IN PART 2...
    return null;
};

export default EnrichmentTab;

