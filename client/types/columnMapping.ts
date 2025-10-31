/**
 * Column Mapping Types
 * 
 * Defines types for mapping CSV columns to AudienceLab input fields
 */

/**
 * AudienceLab supported input columns
 * These are the fields that can be used for MATCHING (not enrichment output)
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
 * Column mapping from CSV column name to AudienceLab field
 */
export interface ColumnMapping {
  csvColumn: string;           // Original CSV column name
  audienceLabField: AudienceLabInputField | null;  // Mapped AudienceLab field
  enabled: boolean;            // Whether to use this column for matching
  sampleValues?: string[];     // Sample values from CSV for preview
}

/**
 * Match operator for multi-field matching
 */
export type MatchOperator = 'OR' | 'AND';

/**
 * Auto-detect mapping from common CSV column names to AudienceLab fields
 */
export const AUTO_MAPPING_PATTERNS: Record<string, AudienceLabInputField> = {
  // Email patterns
  'email': 'EMAIL',
  'e-mail': 'EMAIL',
  'email_address': 'EMAIL',
  'emailaddress': 'EMAIL',
  'work_email': 'BUSINESS_EMAIL',
  'business_email': 'BUSINESS_EMAIL',
  'personal_email': 'PERSONAL_EMAIL',
  
  // Name patterns
  'first_name': 'FIRST_NAME',
  'firstname': 'FIRST_NAME',
  'fname': 'FIRST_NAME',
  'given_name': 'FIRST_NAME',
  'last_name': 'LAST_NAME',
  'lastname': 'LAST_NAME',
  'lname': 'LAST_NAME',
  'surname': 'LAST_NAME',
  'family_name': 'LAST_NAME',
  
  // Phone patterns
  'phone': 'PHONE',
  'phone_number': 'PHONE',
  'phonenumber': 'PHONE',
  'mobile': 'PHONE',
  'cell': 'PHONE',
  'telephone': 'PHONE',
  
  // Address patterns
  'address': 'PERSONAL_ADDRESS',
  'street': 'PERSONAL_ADDRESS',
  'street_address': 'PERSONAL_ADDRESS',
  'city': 'PERSONAL_CITY',
  'state': 'PERSONAL_STATE',
  'zip': 'PERSONAL_ZIP',
  'zipcode': 'PERSONAL_ZIP',
  'zip_code': 'PERSONAL_ZIP',
  'postal_code': 'PERSONAL_ZIP',
  
  // Company patterns
  'company': 'COMPANY_NAME',
  'company_name': 'COMPANY_NAME',
  'companyname': 'COMPANY_NAME',
  'organization': 'COMPANY_NAME',
  'employer': 'COMPANY_NAME',
  'domain': 'COMPANY_DOMAIN',
  'company_domain': 'COMPANY_DOMAIN',
  'website': 'COMPANY_DOMAIN',
  'company_website': 'COMPANY_DOMAIN',
  'industry': 'COMPANY_INDUSTRY',
  'company_industry': 'COMPANY_INDUSTRY',
  
  // Social patterns
  'linkedin': 'LINKEDIN_URL',
  'linkedin_url': 'LINKEDIN_URL',
  'linkedin_profile': 'LINKEDIN_URL',
};

/**
 * Auto-detect AudienceLab field from CSV column name
 */
export function autoDetectField(csvColumn: string): AudienceLabInputField | null {
  const normalized = csvColumn.toLowerCase().trim().replace(/\s+/g, '_');
  return AUTO_MAPPING_PATTERNS[normalized] || null;
}

/**
 * Get display name for AudienceLab field
 */
export function getFieldDisplayName(field: AudienceLabInputField): string {
  return field
    .split('_')
    .map(word => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Get field category for grouping
 */
export function getFieldCategory(field: AudienceLabInputField): string {
  if (field.includes('EMAIL')) return 'Email';
  if (field.includes('NAME')) return 'Name';
  if (field.includes('PHONE')) return 'Phone';
  if (field.includes('ADDRESS') || field.includes('CITY') || field.includes('STATE') || field.includes('ZIP')) {
    return 'Address';
  }
  if (field.includes('COMPANY')) return 'Company';
  if (field.includes('LINKEDIN')) return 'Social';
  return 'Other';
}

