/**
 * CSV Parser Utility
 * 
 * Parses CSV files with proper handling of:
 * - Multi-line fields (newlines inside quotes)
 * - Escaped quotes ("")
 * - Commas inside quoted fields
 * - JSON arrays and complex data
 */

export interface ParsedCSV {
  columns: string[];
  data: Record<string, string>[];
  rowCount: number;
}

/**
 * Parse CSV file content with proper multi-line field support
 * 
 * @param csvText - Raw CSV text content
 * @returns Parsed CSV data with columns and rows
 */
export function parseCSV(csvText: string): ParsedCSV {
  const records = parseCSVRecords(csvText);
  
  if (records.length === 0) {
    return { columns: [], data: [], rowCount: 0 };
  }

  // First record is the header
  const columns = records[0];
  
  // Convert remaining records to objects
  const data: Record<string, string>[] = [];
  
  for (let i = 1; i < records.length; i++) {
    const values = records[i];
    const row: Record<string, string> = {};
    
    columns.forEach((column, index) => {
      row[column] = values[index] || '';
    });
    
    data.push(row);
  }

  return {
    columns,
    data,
    rowCount: data.length,
  };
}

/**
 * Parse CSV text into records (array of arrays)
 * Handles multi-line fields properly by tracking quote state
 * 
 * @param csvText - Raw CSV text
 * @returns Array of records, where each record is an array of field values
 */
function parseCSVRecords(csvText: string): string[][] {
  const records: string[][] = [];
  let currentRecord: string[] = [];
  let currentField = '';
  let inQuotes = false;
  
  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote ("") - add one quote to field
        currentField += '"';
        i++; // Skip the next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // End of field
      currentRecord.push(currentField);
      currentField = '';
    } else if (char === '\n' && !inQuotes) {
      // End of record (only if not inside quotes)
      currentRecord.push(currentField);
      if (currentRecord.some(field => field.trim() !== '')) {
        // Only add non-empty records
        records.push(currentRecord);
      }
      currentRecord = [];
      currentField = '';
    } else if (char === '\r' && nextChar === '\n' && !inQuotes) {
      // Windows line ending (\r\n) - end of record
      currentRecord.push(currentField);
      if (currentRecord.some(field => field.trim() !== '')) {
        records.push(currentRecord);
      }
      currentRecord = [];
      currentField = '';
      i++; // Skip the \n
    } else if (char === '\r' && !inQuotes) {
      // Mac line ending (\r) - end of record
      currentRecord.push(currentField);
      if (currentRecord.some(field => field.trim() !== '')) {
        records.push(currentRecord);
      }
      currentRecord = [];
      currentField = '';
    } else {
      // Regular character - add to current field
      currentField += char;
    }
  }
  
  // Add last field and record if not empty
  if (currentField || currentRecord.length > 0) {
    currentRecord.push(currentField);
    if (currentRecord.some(field => field.trim() !== '')) {
      records.push(currentRecord);
    }
  }
  
  return records;
}

/**
 * Convert parsed CSV data back to CSV string
 * 
 * @param columns - Column names
 * @param data - Data rows
 * @returns CSV string
 */
export function toCSV(columns: string[], data: Record<string, any>[]): string {
  const lines: string[] = [];

  // Header row
  lines.push(columns.map(escapeCSVValue).join(','));

  // Data rows
  data.forEach(row => {
    const values = columns.map(column => escapeCSVValue(row[column]));
    lines.push(values.join(','));
  });

  return lines.join('\n');
}

/**
 * Escape CSV value (add quotes if needed)
 * 
 * @param value - Value to escape
 * @returns Escaped value
 */
function escapeCSVValue(value: any): string {
  if (value === null || value === undefined) {
    return '';
  }

  const str = String(value);

  // Quote if contains comma, quote, or newline
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }

  return str;
}

