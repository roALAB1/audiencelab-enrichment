/**
 * Column Mapping Types
 * 
 * Defines types for mapping CSV columns to AudienceLab input fields
 * Based on official API documentation: AUDIENCELAB_API.md
 */

/**
 * AudienceLab supported input columns for MATCHING
 * Source: https://audiencelab.mintlify.app/api-reference
 * 
 * These are the ONLY 16 fields that can be used for matching in the enrichment API
 */
export const AUDIENCELAB_INPUT_FIELDS = [
  'EMAIL',
  'PERSONAL_EMAIL',
  'BUSINESS_EMAIL',
  'FIRST_NAME',
  'LAST_NAME',
  'PHONE',
  'PERSONAL_ADDRESS',
  'PERSONAL_CITY',
  'PERSONAL_STATE',
  'PERSONAL_ZIP',
  'COMPANY_NAME',
  'COMPANY_DOMAIN',
  'COMPANY_INDUSTRY',
  'SHA256_PERSONAL_EMAIL',
  'LINKEDIN_URL',
  'UP_ID',
] as const;

export type AudienceLabInputField = typeof AUDIENCELAB_INPUT_FIELDS[number];

/**
 * Column mapping: maps a CSV column to an AudienceLab input field
 */
export interface ColumnMapping {
  csvColumn: string;
  audienceLabField: AudienceLabInputField | null;
}

/**
 * Match operator for multi-field matching
 */
export type MatchOperator = 'OR' | 'AND';

/**
 * Auto-detect AudienceLab field from CSV column name
 * 
 * @param columnName - CSV column name
 * @returns Detected AudienceLab field or null
 */
export function autoDetectField(columnName: string): AudienceLabInputField | null {
  const normalized = columnName.toUpperCase().trim();
  
  // Direct match
  if (AUDIENCELAB_INPUT_FIELDS.includes(normalized as AudienceLabInputField)) {
    return normalized as AudienceLabInputField;
  }
  
  // Pattern matching for common variations
  const patterns: Record<string, AudienceLabInputField> = {
    // Email patterns
    'EMAIL': 'EMAIL',
    'BUSINESS_EMAIL': 'BUSINESS_EMAIL',
    'WORK_EMAIL': 'BUSINESS_EMAIL',
    'COMPANY_EMAIL': 'BUSINESS_EMAIL',
    'PERSONAL_EMAIL': 'PERSONAL_EMAIL',
    'PRIVATE_EMAIL': 'PERSONAL_EMAIL',
    'HOME_EMAIL': 'PERSONAL_EMAIL',
    'SHA256_PERSONAL_EMAIL': 'SHA256_PERSONAL_EMAIL',
    
    // Name patterns
    'FIRST_NAME': 'FIRST_NAME',
    'FIRSTNAME': 'FIRST_NAME',
    'FIRST': 'FIRST_NAME',
    'GIVEN_NAME': 'FIRST_NAME',
    'LAST_NAME': 'LAST_NAME',
    'LASTNAME': 'LAST_NAME',
    'LAST': 'LAST_NAME',
    'SURNAME': 'LAST_NAME',
    'FAMILY_NAME': 'LAST_NAME',
    
    // Phone patterns
    'PHONE': 'PHONE',
    'MOBILE': 'PHONE',
    'MOBILE_PHONE': 'PHONE',
    'CELL': 'PHONE',
    'CELL_PHONE': 'PHONE',
    
    // Address patterns
    'PERSONAL_ADDRESS': 'PERSONAL_ADDRESS',
    'ADDRESS': 'PERSONAL_ADDRESS',
    'STREET': 'PERSONAL_ADDRESS',
    'PERSONAL_CITY': 'PERSONAL_CITY',
    'CITY': 'PERSONAL_CITY',
    'PERSONAL_STATE': 'PERSONAL_STATE',
    'STATE': 'PERSONAL_STATE',
    'PERSONAL_ZIP': 'PERSONAL_ZIP',
    'ZIP': 'PERSONAL_ZIP',
    'ZIPCODE': 'PERSONAL_ZIP',
    'POSTAL_CODE': 'PERSONAL_ZIP',
    
    // Company patterns
    'COMPANY': 'COMPANY_NAME',
    'COMPANY_NAME': 'COMPANY_NAME',
    'ORGANIZATION': 'COMPANY_NAME',
    'EMPLOYER': 'COMPANY_NAME',
    'COMPANY_DOMAIN': 'COMPANY_DOMAIN',
    'DOMAIN': 'COMPANY_DOMAIN',
    'WEBSITE': 'COMPANY_DOMAIN',
    'COMPANY_INDUSTRY': 'COMPANY_INDUSTRY',
    'INDUSTRY': 'COMPANY_INDUSTRY',
    
    // Social patterns
    'LINKEDIN_URL': 'LINKEDIN_URL',
    'LINKEDIN': 'LINKEDIN_URL',
    
    // ID patterns
    'UP_ID': 'UP_ID',
    'UPID': 'UP_ID',
  };
  
  // Check exact pattern match
  if (patterns[normalized]) {
    return patterns[normalized];
  }
  
  // Check if column contains pattern keywords
  for (const [pattern, field] of Object.entries(patterns)) {
    if (normalized.includes(pattern)) {
      return field;
    }
  }
  
  return null;
}

/**
 * Get display name for AudienceLab field
 * 
 * @param field - AudienceLab field name
 * @returns Human-readable display name
 */
/**
 * Get category for AudienceLab field (for grouping in UI)
 * 
 * @param field - AudienceLab field name
 * @returns Category name
 */
export function getFieldCategory(field: AudienceLabInputField): string {
  if (field.includes('EMAIL')) return 'Email';
  if (field === 'FIRST_NAME' || field === 'LAST_NAME') return 'Name';
  if (field === 'PHONE') return 'Phone';
  if (field.includes('PERSONAL_')) return 'Address';
  if (field.includes('COMPANY_')) return 'Company';
  if (field === 'LINKEDIN_URL') return 'Social';
  if (field === 'UP_ID') return 'ID';
  return 'Other';
}

/**
 * Get display name for AudienceLab field
 * 
 * @param field - AudienceLab field name
 * @returns Human-readable display name
 */
export function getFieldDisplayName(field: AudienceLabInputField): string {
  const displayNames: Record<AudienceLabInputField, string> = {
    'EMAIL': 'Email',
    'PERSONAL_EMAIL': 'Personal Email',
    'BUSINESS_EMAIL': 'Business Email',
    'SHA256_PERSONAL_EMAIL': 'SHA256 Personal Email',
    'FIRST_NAME': 'First Name',
    'LAST_NAME': 'Last Name',
    'PHONE': 'Phone',
    'PERSONAL_ADDRESS': 'Personal Address',
    'PERSONAL_CITY': 'Personal City',
    'PERSONAL_STATE': 'Personal State',
    'PERSONAL_ZIP': 'Personal ZIP',
    'COMPANY_NAME': 'Company Name',
    'COMPANY_DOMAIN': 'Company Domain',
    'COMPANY_INDUSTRY': 'Company Industry',
    'LINKEDIN_URL': 'LinkedIn URL',
    'UP_ID': 'UP ID',
  };
  
  return displayNames[field] || field;
}

