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
  // Email fields
  'EMAIL',
  'PERSONAL_EMAIL',
  'BUSINESS_EMAIL',
  'SHA256_PERSONAL_EMAIL',
  
  // Name fields
  'FIRST_NAME',
  'LAST_NAME',
  'FULL_NAME',
  
  // Phone fields
  'PHONE',
  'MOBILE_PHONE',
  
  // Personal address fields
  'PERSONAL_ADDRESS',
  'PERSONAL_CITY',
  'PERSONAL_STATE',
  'PERSONAL_ZIP',
  'PERSONAL_COUNTRY',
  
  // Professional fields
  'JOB_TITLE',
  'SENIORITY',
  'DEPARTMENT',
  'YEARS_EXPERIENCE',
  'PREVIOUS_COMPANIES',
  
  // Company fields
  'COMPANY_NAME',
  'COMPANY_DOMAIN',
  'COMPANY_INDUSTRY',
  'COMPANY_SIZE',
  'COMPANY_REVENUE',
  'COMPANY_FOUNDED',
  'COMPANY_TYPE',
  'COMPANY_LOCATION',
  'COMPANY_PHONE',
  'COMPANY_EMPLOYEES',
  'COMPANY_TECHNOLOGIES',
  'COMPANY_DESCRIPTION',
  
  // Location fields
  'CITY',
  'STATE',
  'COUNTRY',
  'ZIP_CODE',
  'TIMEZONE',
  
  // Social fields
  'LINKEDIN_URL',
  'TWITTER_URL',
  'FACEBOOK_URL',
  
  // Premium fields
  'GENDER',
  'AGE_RANGE',
  'EDUCATION',
  'SCHOOL',
  'SKILLS',
  'INTERESTS',
  
  // Other
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
  'personal_address': 'PERSONAL_ADDRESS',
  'personal_city': 'PERSONAL_CITY',
  'personal_state': 'PERSONAL_STATE',
  'personal_zip': 'PERSONAL_ZIP',
  
  // General location patterns
  'city': 'CITY',
  'state': 'STATE',
  'country': 'COUNTRY',
  'zip': 'ZIP_CODE',
  'zipcode': 'ZIP_CODE',
  'zip_code': 'ZIP_CODE',
  'postal_code': 'ZIP_CODE',
  
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
  'twitter': 'TWITTER_URL',
  'twitter_url': 'TWITTER_URL',
  'facebook': 'FACEBOOK_URL',
  'facebook_url': 'FACEBOOK_URL',
  
  // Professional patterns
  'job_title': 'JOB_TITLE',
  'jobtitle': 'JOB_TITLE',
  'title': 'JOB_TITLE',
  'position': 'JOB_TITLE',
  'role': 'JOB_TITLE',
  'seniority': 'SENIORITY',
  'level': 'SENIORITY',
  'department': 'DEPARTMENT',
  'dept': 'DEPARTMENT',
  'years_experience': 'YEARS_EXPERIENCE',
  'years_of_experience': 'YEARS_EXPERIENCE',
  'experience': 'YEARS_EXPERIENCE',
  'previous_companies': 'PREVIOUS_COMPANIES',
  'past_companies': 'PREVIOUS_COMPANIES',
  
  // Company extended patterns
  'company_size': 'COMPANY_SIZE',
  'size': 'COMPANY_SIZE',
  'company_revenue': 'COMPANY_REVENUE',
  'revenue': 'COMPANY_REVENUE',
  'company_founded': 'COMPANY_FOUNDED',
  'founded': 'COMPANY_FOUNDED',
  'year_founded': 'COMPANY_FOUNDED',
  'company_type': 'COMPANY_TYPE',
  'company_location': 'COMPANY_LOCATION',
  'company_phone': 'COMPANY_PHONE',
  'company_employees': 'COMPANY_EMPLOYEES',
  'employees': 'COMPANY_EMPLOYEES',
  'company_technologies': 'COMPANY_TECHNOLOGIES',
  'technologies': 'COMPANY_TECHNOLOGIES',
  'tech_stack': 'COMPANY_TECHNOLOGIES',
  'company_description': 'COMPANY_DESCRIPTION',
  'description': 'COMPANY_DESCRIPTION',
  
  // Premium patterns
  'gender': 'GENDER',
  'sex': 'GENDER',
  'age_range': 'AGE_RANGE',
  'age': 'AGE_RANGE',
  'education': 'EDUCATION',
  'degree': 'EDUCATION',
  'school': 'SCHOOL',
  'university': 'SCHOOL',
  'college': 'SCHOOL',
  'skills': 'SKILLS',
  'skill': 'SKILLS',
  'interests': 'INTERESTS',
  'interest': 'INTERESTS',
  'hobbies': 'INTERESTS',
  
  // Location extended patterns
  'timezone': 'TIMEZONE',
  'time_zone': 'TIMEZONE',
  'full_name': 'FULL_NAME',
  'fullname': 'FULL_NAME',
  'mobile_phone': 'MOBILE_PHONE',
  'cell': 'MOBILE_PHONE',
  'cell_phone': 'MOBILE_PHONE',
  'personal_country': 'PERSONAL_COUNTRY',
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

