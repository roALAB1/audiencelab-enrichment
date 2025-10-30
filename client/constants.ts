
import { Field, FieldPackage } from './types';

export const ALL_FIELDS: Field[] = [
    // Personal Information
    { id: 'email', name: 'Email', cost: 1, category: 'personal', note: 'Base field', icon: '⭐' },
    { id: 'first_name', name: 'First Name', cost: 1, category: 'personal', note: 'Base field', icon: '⭐' },
    { id: 'last_name', name: 'Last Name', cost: 1, category: 'personal', note: 'Base field', icon: '⭐' },
    { id: 'full_name', name: 'Full Name', cost: 0, category: 'personal', note: 'Derived' },
    { id: 'phone', name: 'Phone', cost: 3, category: 'personal', note: 'Premium', icon: '📞' },
    { id: 'mobile_phone', name: 'Mobile Phone', cost: 5, category: 'personal', note: 'Premium', icon: '📞' },
    { id: 'personal_email', name: 'Personal Email', cost: 3, category: 'personal' },
    // Professional Information
    { id: 'job_title', name: 'Job Title', cost: 1, category: 'professional', note: 'Base field', icon: '⭐' },
    { id: 'seniority', name: 'Seniority', cost: 1, category: 'professional', note: 'Base field', icon: '⭐' },
    { id: 'department', name: 'Department', cost: 1, category: 'professional', note: 'Base field', icon: '⭐' },
    { id: 'linkedin_url', name: 'LinkedIn URL', cost: 2, category: 'professional' },
    { id: 'years_experience', name: 'Years of Experience', cost: 2, category: 'professional' },
    { id: 'previous_companies', name: 'Previous Companies', cost: 3, category: 'professional' },
    // Location Information
    { id: 'city', name: 'City', cost: 1, category: 'location' },
    { id: 'state', name: 'State', cost: 1, category: 'location' },
    { id: 'country', name: 'Country', cost: 1, category: 'location' },
    { id: 'zip_code', name: 'ZIP Code', cost: 1, category: 'location' },
    { id: 'timezone', name: 'Timezone', cost: 1, category: 'location' },
    // Company Information
    { id: 'company', name: 'Company', cost: 1, category: 'company', note: 'Base field', icon: '⭐' },
    { id: 'company_domain', name: 'Company Domain', cost: 1, category: 'company' },
    { id: 'company_size', name: 'Company Size', cost: 2, category: 'company' },
    { id: 'company_industry', name: 'Company Industry', cost: 2, category: 'company' },
    // Social Profiles
    { id: 'twitter_url', name: 'Twitter URL', cost: 2, category: 'social' },
    { id: 'facebook_url', name: 'Facebook URL', cost: 2, category: 'social' },
    // Premium Fields
    { id: 'gender', name: 'Gender', cost: 2, category: 'premium' },
    { id: 'age_range', name: 'Age Range', cost: 2, category: 'premium' },
    { id: 'education', name: 'Education', cost: 3, category: 'premium' },
    { id: 'school', name: 'School', cost: 3, category: 'premium' },
    { id: 'skills', name: 'Skills', cost: 4, category: 'premium', note: 'Premium', icon: '🔥' },
    { id: 'interests', name: 'Interests', cost: 3, category: 'premium' },
    { id: 'company_revenue', name: 'Company Revenue', cost: 3, category: 'premium', note: 'Company data', icon: '💰' },
    { id: 'company_founded', name: 'Company Founded', cost: 2, category: 'premium' },
    { id: 'company_type', name: 'Company Type', cost: 2, category: 'premium' },
    { id: 'company_location', name: 'Company Location', cost: 2, category: 'premium' },
    { id: 'company_phone', name: 'Company Phone', cost: 2, category: 'premium' },
    { id: 'company_employees', name: 'Company Employees', cost: 3, category: 'premium', note: 'Company data', icon: '💰' },
    { id: 'company_technologies', name: 'Company Technologies', cost: 5, category: 'premium', note: 'Premium', icon: '🔥' },
    { id: 'company_description', name: 'Company Description', cost: 2, category: 'premium' },
    { id: 'confidence_score', name: 'Confidence Score', cost: 0, category: 'premium' },
];

export const FIELD_PACKAGES: FieldPackage[] = [
    { id: 'basic', name: 'Basic', fields: ['email', 'first_name', 'last_name', 'job_title', 'company', 'company_domain'], total_credits: 6 },
    { id: 'standard', name: 'Standard', fields: ['email', 'first_name', 'last_name', 'job_title', 'company', 'company_domain', 'seniority', 'department', 'city', 'state', 'country', 'linkedin_url'], total_credits: 12 },
    { id: 'professional', name: 'Professional', fields: ['email', 'first_name', 'last_name', 'job_title', 'company', 'company_domain', 'seniority', 'department', 'city', 'state', 'country', 'linkedin_url', 'phone', 'company_size', 'company_industry', 'company_revenue', 'education'], total_credits: 20 },
    { id: 'premium', name: 'Premium', fields: ['email', 'first_name', 'last_name', 'job_title', 'company', 'company_domain', 'seniority', 'department', 'city', 'state', 'country', 'linkedin_url', 'phone', 'company_size', 'company_industry', 'company_revenue', 'education', 'mobile_phone', 'skills', 'company_technologies', 'previous_companies'], total_credits: 35 },
    { id: 'complete', name: 'Complete', fields: 'all', total_credits: 50 },
];
