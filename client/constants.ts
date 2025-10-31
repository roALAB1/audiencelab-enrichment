
import { Field, FieldPackage } from './types';

export const ALL_FIELDS: Field[] = [
    // System
    { id: 'uuid', name: 'UUID', cost: 0, category: 'system', note: 'System ID' },
    
    // Personal Information
    { id: 'first_name', name: 'First Name', cost: 1, category: 'personal', note: 'Base field', icon: '⭐' },
    { id: 'last_name', name: 'Last Name', cost: 1, category: 'personal', note: 'Base field', icon: '⭐' },
    { id: 'personal_address', name: 'Personal Address', cost: 2, category: 'personal' },
    { id: 'personal_city', name: 'Personal City', cost: 1, category: 'personal' },
    { id: 'personal_state', name: 'Personal State', cost: 1, category: 'personal' },
    { id: 'personal_zip', name: 'Personal ZIP', cost: 1, category: 'personal' },
    { id: 'personal_zip4', name: 'Personal ZIP+4', cost: 1, category: 'personal' },
    
    // Demographics
    { id: 'age_range', name: 'Age Range', cost: 2, category: 'demographics' },
    { id: 'children', name: 'Children', cost: 2, category: 'demographics' },
    { id: 'gender', name: 'Gender', cost: 2, category: 'demographics' },
    { id: 'homeowner', name: 'Homeowner', cost: 2, category: 'demographics' },
    { id: 'married', name: 'Married', cost: 2, category: 'demographics' },
    { id: 'net_worth', name: 'Net Worth', cost: 3, category: 'demographics', note: 'Premium', icon: '💰' },
    { id: 'income_range', name: 'Income Range', cost: 3, category: 'demographics', note: 'Premium', icon: '💰' },
    
    // Contact - Phone Numbers
    { id: 'direct_number', name: 'Direct Number', cost: 3, category: 'contact', note: 'Premium', icon: '📞' },
    { id: 'direct_number_dnc', name: 'Direct Number DNC', cost: 0, category: 'contact', note: 'Metadata' },
    { id: 'mobile_phone', name: 'Mobile Phone', cost: 5, category: 'contact', note: 'Premium', icon: '📞' },
    { id: 'mobile_phone_dnc', name: 'Mobile Phone DNC', cost: 0, category: 'contact', note: 'Metadata' },
    { id: 'personal_phone', name: 'Personal Phone', cost: 3, category: 'contact', note: 'Premium', icon: '📞' },
    { id: 'personal_phone_dnc', name: 'Personal Phone DNC', cost: 0, category: 'contact', note: 'Metadata' },
    { id: 'valid_phones', name: 'Valid Phones', cost: 0, category: 'contact', note: 'Metadata' },
    
    // Contact - Email
    { id: 'business_email', name: 'Business Email', cost: 1, category: 'contact', note: 'Base field', icon: '⭐' },
    { id: 'personal_emails', name: 'Personal Emails', cost: 3, category: 'contact' },
    { id: 'personal_verified_emails', name: 'Personal Verified Emails', cost: 4, category: 'contact', note: 'Verified', icon: '✓' },
    { id: 'business_verified_emails', name: 'Business Verified Emails', cost: 2, category: 'contact', note: 'Verified', icon: '✓' },
    { id: 'sha256_personal_email', name: 'SHA256 Personal Email', cost: 0, category: 'contact', note: 'Hash' },
    { id: 'sha256_business_email', name: 'SHA256 Business Email', cost: 0, category: 'contact', note: 'Hash' },
    
    // Professional Information
    { id: 'job_title', name: 'Job Title', cost: 1, category: 'professional', note: 'Base field', icon: '⭐' },
    { id: 'headline', name: 'Headline', cost: 1, category: 'professional' },
    { id: 'department', name: 'Department', cost: 1, category: 'professional', note: 'Base field', icon: '⭐' },
    { id: 'seniority_level', name: 'Seniority Level', cost: 1, category: 'professional', note: 'Base field', icon: '⭐' },
    { id: 'inferred_years_experience', name: 'Years of Experience', cost: 2, category: 'professional' },
    { id: 'company_name_history', name: 'Company History', cost: 3, category: 'professional' },
    { id: 'job_title_history', name: 'Job Title History', cost: 3, category: 'professional' },
    { id: 'education_history', name: 'Education History', cost: 3, category: 'professional' },
    
    // Company Information
    { id: 'company_name', name: 'Company Name', cost: 1, category: 'company', note: 'Base field', icon: '⭐' },
    { id: 'company_address', name: 'Company Address', cost: 1, category: 'company' },
    { id: 'company_description', name: 'Company Description', cost: 2, category: 'company' },
    { id: 'company_domain', name: 'Company Domain', cost: 1, category: 'company' },
    { id: 'company_employee_count', name: 'Company Employee Count', cost: 2, category: 'company' },
    { id: 'company_linkedin_url', name: 'Company LinkedIn URL', cost: 2, category: 'company' },
    { id: 'company_phone', name: 'Company Phone', cost: 2, category: 'company' },
    { id: 'company_revenue', name: 'Company Revenue', cost: 3, category: 'company', note: 'Premium', icon: '💰' },
    { id: 'company_sic', name: 'Company SIC Code', cost: 1, category: 'company' },
    { id: 'company_naics', name: 'Company NAICS Code', cost: 1, category: 'company' },
    { id: 'company_city', name: 'Company City', cost: 1, category: 'company' },
    { id: 'company_state', name: 'Company State', cost: 1, category: 'company' },
    { id: 'company_zip', name: 'Company ZIP', cost: 1, category: 'company' },
    { id: 'company_industry', name: 'Company Industry', cost: 2, category: 'company' },
    
    // Social Profiles
    { id: 'linkedin_url', name: 'LinkedIn URL', cost: 2, category: 'social' },
    { id: 'twitter_url', name: 'Twitter URL', cost: 2, category: 'social' },
    { id: 'facebook_url', name: 'Facebook URL', cost: 2, category: 'social' },
    { id: 'social_connections', name: 'Social Connections', cost: 2, category: 'social' },
    
    // Premium Fields
    { id: 'skills', name: 'Skills', cost: 4, category: 'premium', note: 'Premium', icon: '🔥' },
    { id: 'interests', name: 'Interests', cost: 3, category: 'premium' },
    
    // Skiptrace Fields
    { id: 'skiptrace_match_score', name: 'Skiptrace Match Score', cost: 0, category: 'skiptrace', note: 'Metadata' },
    { id: 'skiptrace_name', name: 'Skiptrace Name', cost: 3, category: 'skiptrace', note: 'Skiptrace', icon: '🔍' },
    { id: 'skiptrace_address', name: 'Skiptrace Address', cost: 3, category: 'skiptrace', note: 'Skiptrace', icon: '🔍' },
    { id: 'skiptrace_city', name: 'Skiptrace City', cost: 3, category: 'skiptrace', note: 'Skiptrace', icon: '🔍' },
    { id: 'skiptrace_state', name: 'Skiptrace State', cost: 3, category: 'skiptrace', note: 'Skiptrace', icon: '🔍' },
    { id: 'skiptrace_zip', name: 'Skiptrace ZIP', cost: 3, category: 'skiptrace', note: 'Skiptrace', icon: '🔍' },
    { id: 'skiptrace_landline_numbers', name: 'Skiptrace Landline Numbers', cost: 5, category: 'skiptrace', note: 'Skiptrace', icon: '🔍' },
    { id: 'skiptrace_wireless_numbers', name: 'Skiptrace Wireless Numbers', cost: 5, category: 'skiptrace', note: 'Skiptrace', icon: '🔍' },
    { id: 'skiptrace_credit_rating', name: 'Skiptrace Credit Rating', cost: 4, category: 'skiptrace', note: 'Skiptrace', icon: '🔍' },
    { id: 'skiptrace_dnc', name: 'Skiptrace DNC', cost: 0, category: 'skiptrace', note: 'Metadata' },
    { id: 'skiptrace_exact_age', name: 'Skiptrace Exact Age', cost: 3, category: 'skiptrace', note: 'Skiptrace', icon: '🔍' },
    { id: 'skiptrace_ethnic_code', name: 'Skiptrace Ethnic Code', cost: 3, category: 'skiptrace', note: 'Skiptrace', icon: '🔍' },
    { id: 'skiptrace_language_code', name: 'Skiptrace Language Code', cost: 3, category: 'skiptrace', note: 'Skiptrace', icon: '🔍' },
    { id: 'skiptrace_ip', name: 'Skiptrace IP', cost: 3, category: 'skiptrace', note: 'Skiptrace', icon: '🔍' },
    { id: 'skiptrace_b2b_address', name: 'Skiptrace B2B Address', cost: 3, category: 'skiptrace', note: 'Skiptrace', icon: '🔍' },
    { id: 'skiptrace_b2b_phone', name: 'Skiptrace B2B Phone', cost: 5, category: 'skiptrace', note: 'Skiptrace', icon: '🔍' },
    { id: 'skiptrace_b2b_source', name: 'Skiptrace B2B Source', cost: 0, category: 'skiptrace', note: 'Metadata' },
    { id: 'skiptrace_b2b_website', name: 'Skiptrace B2B Website', cost: 3, category: 'skiptrace', note: 'Skiptrace', icon: '🔍' },
];

export const FIELD_PACKAGES: FieldPackage[] = [
    { 
        id: 'basic', 
        name: 'Basic', 
        fields: ['business_email', 'first_name', 'last_name', 'job_title', 'company_name', 'company_domain'], 
        total_credits: 6 
    },
    { 
        id: 'standard', 
        name: 'Standard', 
        fields: ['business_email', 'first_name', 'last_name', 'job_title', 'company_name', 'company_domain', 'seniority_level', 'department', 'personal_city', 'personal_state', 'linkedin_url'], 
        total_credits: 12 
    },
    { 
        id: 'professional', 
        name: 'Professional', 
        fields: ['business_email', 'first_name', 'last_name', 'job_title', 'company_name', 'company_domain', 'seniority_level', 'department', 'personal_city', 'personal_state', 'linkedin_url', 'direct_number', 'company_employee_count', 'company_industry', 'company_revenue', 'education_history'], 
        total_credits: 20 
    },
    { 
        id: 'premium', 
        name: 'Premium', 
        fields: ['business_email', 'first_name', 'last_name', 'job_title', 'company_name', 'company_domain', 'seniority_level', 'department', 'personal_city', 'personal_state', 'linkedin_url', 'direct_number', 'company_employee_count', 'company_industry', 'company_revenue', 'education_history', 'mobile_phone', 'skills', 'company_name_history', 'personal_emails'], 
        total_credits: 35 
    },
    { 
        id: 'complete', 
        name: 'Complete', 
        fields: 'all', 
        total_credits: 50 
    },
];

