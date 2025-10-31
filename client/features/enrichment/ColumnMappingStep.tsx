/**
 * Column Mapping Step Component
 * 
 * Allows users to map CSV columns to AudienceLab input fields for matching
 */

import React, { useEffect } from 'react';
import type { ColumnMapping, MatchOperator, AudienceLabInputField } from '../../types/columnMapping';
import {
  AUDIENCELAB_INPUT_FIELDS,
  autoDetectField,
  getFieldDisplayName,
  getFieldCategory,
} from '../../types/columnMapping';

interface ColumnMappingStepProps {
  csvColumns: string[];
  sampleData: Record<string, string>;
  onMappingsChange: (mappings: ColumnMapping[]) => void;
  onOperatorChange: (operator: MatchOperator) => void;
}

export default function ColumnMappingStep({
  csvColumns,
  sampleData,
  onMappingsChange,
  onOperatorChange,
}: ColumnMappingStepProps) {
  const [columnMappings, setColumnMappings] = React.useState<ColumnMapping[]>([]);
  const [matchOperator, setMatchOperator] = React.useState<MatchOperator>('OR');

  // Initialize mappings when CSV columns change
  useEffect(() => {
    if (csvColumns.length > 0 && columnMappings.length === 0) {
      const initialMappings: ColumnMapping[] = csvColumns.map(column => {
        const detectedField = autoDetectField(column);
        const sampleValue = sampleData[column] || '';

        return {
          csvColumn: column,
          audienceLabField: detectedField,
          enabled: detectedField !== null, // Auto-enable if detected
          sampleValues: sampleValue ? [sampleValue] : [],
        };
      });

      setColumnMappings(initialMappings);
      onMappingsChange(initialMappings);
    }
  }, [csvColumns, sampleData]);

  const handleMappingChange = (index: number, field: string) => {
    const updated = [...columnMappings];
    const audienceLabField = field === '' ? null : (field as AudienceLabInputField);
    updated[index] = {
      ...updated[index],
      audienceLabField,
      enabled: audienceLabField !== null,
    };
    setColumnMappings(updated);
    onMappingsChange(updated);
  };

  const handleToggleEnabled = (index: number) => {
    const updated = [...columnMappings];
    updated[index] = {
      ...updated[index],
      enabled: !updated[index].enabled,
    };
    setColumnMappings(updated);
    onMappingsChange(updated);
  };

  const handleOperatorChange = (operator: MatchOperator) => {
    setMatchOperator(operator);
    onOperatorChange(operator);
  };

  const enabledCount = columnMappings.filter(m => m.enabled && m.audienceLabField).length;

  // Group fields by category for the dropdown
  const fieldsByCategory = AUDIENCELAB_INPUT_FIELDS.reduce((acc, field) => {
    const category = getFieldCategory(field);
    if (!acc[category]) acc[category] = [];
    acc[category].push(field);
    return acc;
  }, {} as Record<string, AudienceLabInputField[]>);

  return (
    <div className="space-y-4">
      {/* Match Operator Toggle */}
      <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-lg">
        <div className="flex-1">
          <h4 className="font-semibold text-slate-800 mb-1">Match Logic</h4>
          <p className="text-sm text-slate-600">
            {matchOperator === 'OR' 
              ? 'Match if ANY selected field matches (more permissive)' 
              : 'Match only if ALL selected fields match (more strict)'}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleOperatorChange('OR')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              matchOperator === 'OR'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
            }`}
          >
            OR
          </button>
          <button
            onClick={() => handleOperatorChange('AND')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              matchOperator === 'AND'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
            }`}
          >
            AND
          </button>
        </div>
      </div>

      {/* Column Mappings */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-slate-800">
            CSV Columns ({enabledCount} selected for matching)
          </h4>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {columnMappings.map((mapping, index) => (
            <div
              key={mapping.csvColumn}
              className={`p-4 border rounded-lg transition-colors ${
                mapping.enabled
                  ? 'bg-blue-50 border-blue-200'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Enable/Disable Toggle */}
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={mapping.enabled}
                    onChange={() => handleToggleEnabled(index)}
                    className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                </label>

                {/* Column Info */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-800">{mapping.csvColumn}</p>
                      {mapping.sampleValues.length > 0 && (
                        <p className="text-sm text-slate-500">
                          Sample: {mapping.sampleValues[0]}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Field Mapping Dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Maps to AudienceLab field:
                    </label>
                    <select
                      value={mapping.audienceLabField || ''}
                      onChange={(e) => handleMappingChange(index, e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      disabled={!mapping.enabled}
                    >
                      <option value="">-- Not mapped --</option>
                      {Object.entries(fieldsByCategory).map(([category, fields]) => (
                        <optgroup key={category} label={category}>
                          {fields.map(field => (
                            <option key={field} value={field}>
                              {getFieldDisplayName(field)}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Help Text */}
      {enabledCount === 0 && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-800">
            ⚠️ Please select at least one column to use for matching
          </p>
        </div>
      )}
    </div>
  );
}

