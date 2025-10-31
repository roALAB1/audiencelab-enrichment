/**
 * Column Mapping Step Component
 * 
 * Allows users to map CSV columns to AudienceLab input fields for matching
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Info } from 'lucide-react';
import type { ColumnMapping, MatchOperator, AudienceLabInputField } from '@/types/columnMapping';
import {
  AUDIENCELAB_INPUT_FIELDS,
  autoDetectField,
  getFieldDisplayName,
  getFieldCategory,
} from '@/types/columnMapping';

interface ColumnMappingStepProps {
  csvColumns: string[];
  csvData: any[];
  columnMappings: ColumnMapping[];
  matchOperator: MatchOperator;
  onMappingsChange: (mappings: ColumnMapping[]) => void;
  onOperatorChange: (operator: MatchOperator) => void;
}

export default function ColumnMappingStep({
  csvColumns,
  csvData,
  columnMappings,
  matchOperator,
  onMappingsChange,
  onOperatorChange,
}: ColumnMappingStepProps) {
  // Initialize mappings if empty
  useEffect(() => {
    if (columnMappings.length === 0 && csvColumns.length > 0) {
      const initialMappings: ColumnMapping[] = csvColumns.map(column => {
        const detectedField = autoDetectField(column);
        const sampleValues = csvData
          .slice(0, 3)
          .map(row => row[column])
          .filter(val => val && val.trim());

        return {
          csvColumn: column,
          audienceLabField: detectedField,
          enabled: detectedField !== null, // Auto-enable if detected
          sampleValues,
        };
      });

      onMappingsChange(initialMappings);
    }
  }, [csvColumns, csvData, columnMappings.length, onMappingsChange]);

  const handleMappingChange = (index: number, field: AudienceLabInputField | null) => {
    const updated = [...columnMappings];
    updated[index] = {
      ...updated[index],
      audienceLabField: field,
      enabled: field !== null, // Auto-enable when field is selected
    };
    onMappingsChange(updated);
  };

  const handleToggleEnabled = (index: number) => {
    const updated = [...columnMappings];
    updated[index] = {
      ...updated[index],
      enabled: !updated[index].enabled,
    };
    onMappingsChange(updated);
  };

  const enabledCount = columnMappings.filter(m => m.enabled && m.audienceLabField).length;

  // Group fields by category
  const fieldsByCategory = AUDIENCELAB_INPUT_FIELDS.reduce((acc, field) => {
    const category = getFieldCategory(field);
    if (!acc[category]) acc[category] = [];
    acc[category].push(field);
    return acc;
  }, {} as Record<string, AudienceLabInputField[]>);

  return (
    <Card>
      <CardHeader>
        <CardTitle>2. Map Input Columns</CardTitle>
        <CardDescription>
          Select which CSV columns to use for matching contacts. Map each column to the corresponding AudienceLab field.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Match Operator Toggle */}
        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
          <div className="space-y-1">
            <Label htmlFor="match-operator" className="text-base font-semibold">
              Match Logic
            </Label>
            <p className="text-sm text-muted-foreground">
              {matchOperator === 'OR' 
                ? 'Match if ANY selected field matches (recommended for most cases)'
                : 'Match only if ALL selected fields match (stricter matching)'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-sm font-medium ${matchOperator === 'OR' ? 'text-primary' : 'text-muted-foreground'}`}>
              OR
            </span>
            <Switch
              id="match-operator"
              checked={matchOperator === 'AND'}
              onCheckedChange={(checked) => onOperatorChange(checked ? 'AND' : 'OR')}
            />
            <span className={`text-sm font-medium ${matchOperator === 'AND' ? 'text-primary' : 'text-muted-foreground'}`}>
              AND
            </span>
          </div>
        </div>

        {/* Column Mappings */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Column Mappings</h3>
            <Badge variant="secondary">
              {enabledCount} {enabledCount === 1 ? 'field' : 'fields'} selected for matching
            </Badge>
          </div>

          {columnMappings.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Info className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>Upload a CSV file to see column mappings</p>
            </div>
          ) : (
            <div className="space-y-3">
              {columnMappings.map((mapping, index) => (
                <div
                  key={mapping.csvColumn}
                  className={`flex items-center gap-4 p-4 border rounded-lg ${
                    mapping.enabled ? 'bg-background' : 'bg-muted/50'
                  }`}
                >
                  {/* Enable Toggle */}
                  <Switch
                    checked={mapping.enabled}
                    onCheckedChange={() => handleToggleEnabled(index)}
                    disabled={!mapping.audienceLabField}
                  />

                  {/* CSV Column Name */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{mapping.csvColumn}</p>
                    {mapping.sampleValues && mapping.sampleValues.length > 0 && (
                      <p className="text-xs text-muted-foreground truncate">
                        Sample: {mapping.sampleValues.slice(0, 2).join(', ')}
                      </p>
                    )}
                  </div>

                  {/* Field Mapping Selector */}
                  <div className="w-64">
                    <Select
                      value={mapping.audienceLabField || 'none'}
                      onValueChange={(value) =>
                        handleMappingChange(index, value === 'none' ? null : value as AudienceLabInputField)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select field..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">
                          <span className="text-muted-foreground">Don't use for matching</span>
                        </SelectItem>
                        {Object.entries(fieldsByCategory).map(([category, fields]) => (
                          <div key={category}>
                            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                              {category}
                            </div>
                            {fields.map(field => (
                              <SelectItem key={field} value={field}>
                                {getFieldDisplayName(field)}
                              </SelectItem>
                            ))}
                          </div>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info Message */}
        {enabledCount > 0 && (
          <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
            <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-blue-900 dark:text-blue-100">
              {matchOperator === 'OR' ? (
                <>
                  AudienceLab will match contacts if <strong>any</strong> of the {enabledCount} selected {enabledCount === 1 ? 'field matches' : 'fields match'}.
                </>
              ) : (
                <>
                  AudienceLab will match contacts only if <strong>all</strong> {enabledCount} selected fields match.
                </>
              )}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

