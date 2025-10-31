
export type Tab = 'overview' | 'enrichment' | 'quality' | 'analytics' | 'activity' | 'settings';

export interface UserCredits {
  balance: number;
  used_today: number;
  used_this_month: number;
  plan_limit: number;
  renewal_date: string;
}

export type FieldCategory = 'personal' | 'professional' | 'location' | 'company' | 'social' | 'premium' | 'demographics' | 'contact' | 'skiptrace' | 'system';

export interface Field {
  id: string;
  name: string;
  cost: number;
  category: FieldCategory;
  note?: 'Base field' | 'Premium' | 'Derived' | 'Company data' | 'Metadata' | 'Hash' | 'Verified' | 'Skiptrace' | 'System ID';
  icon?: string;
}

export interface FieldPackage {
  id: string;
  name: string;
  fields: string[] | 'all';
  total_credits: number;
}

export interface ValidationResult {
  valid: string[];
  invalid: { email: string; reason: string }[];
  duplicates: string[];
  total: number;
}

export type EnrichmentStatus = 'success' | 'partial' | 'failed' | 'queued' | 'running';

export interface EnrichmentResult {
  id: string;
  email: string;
  status: EnrichmentStatus;
  email_status: 'valid' | 'invalid' | 'catch-all' | 'risky' | 'unknown';
  email_deliverable: boolean;
  email_quality_score: number;
  confidence_score: number;
  data: Record<string, any>;
  credits_used: number;
}

export interface ActivityLog {
    id: string;
    timestamp: string;
    user: string;
    type: 'Enrichment' | 'Export' | 'Audience Creation';
    source: string;
    records: number;
    matchRate: number;
    creditsUsed: number;
    status: 'Success' | 'Partial' | 'Failed';
    duration: string;
}
