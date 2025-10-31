/**
 * CSV Parser Utility
 * 
 * Parses CSV files and extracts columns and data
 */

export interface ParsedCSV {
  columns: string[];
  data: Record<string, string>[];
  rowCount: number;
}

/**
 * Parse CSV file content
 * 
 * @param csvText - Raw CSV text content
 * @returns Parsed CSV data with columns and rows
 */
export function parseCSV(csvText: string): ParsedCSV {
  const lines = csvText.trim().split('\n');
  
  if (lines.length === 0) {
    return { columns: [], data: [], rowCount: 0 };
  }

  // Parse header row
  const headerLine = lines[0];
  const columns = parseCSVLine(headerLine);

  // Parse data rows
  const data: Record<string, string>[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue; // Skip empty lines

    const values = parseCSVLine(line);
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
 * Parse a single CSV line, handling quoted values and commas
 * 
 * @param line - CSV line to parse
 * @returns Array of values
 */
function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // End of value
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  // Add last value
  values.push(current.trim());

  return values;
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
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }

  return str;
}

