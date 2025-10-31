# AudienceLab Enrichment Dashboard - TODO

## Critical Production Issues (URGENT)
- [x] Fix missing index.css in production build (MIME type error) - Added CSS import to index.tsx
- [ ] Fix enrichment job submission error: "failed to close storage writer: rpc error: code = Unavailable desc = connection error" - This is an AudienceLab API timeout issue, not our code
- [x] Add all 48 AudienceLab input fields to column mapping (expanded from 16 to 48 fields)
- [ ] Remove Tailwind CDN from production (use PostCSS build) - Low priority

## Multi-Field Input Matching
- [x] Create column mapping types with 16 AudienceLab input fields
- [x] Implement CSV parser utility
- [x] Add column mapping UI to select which CSV columns to use for matching
- [x] Map CSV columns to AudienceLab input fields (EMAIL, FIRST_NAME, LAST_NAME, COMPANY_NAME, etc.)
- [x] Add OR/AND toggle for match logic
- [x] Update job submission to include all selected input columns
- [x] Update validation to support multi-field input (basic implementation)
- [x] Create simplified ColumnMappingStep component (no shadcn dependencies)
- [x] Integrate ColumnMappingStep into EnrichmentTab workflow
- [x] Update job submission to use records/columns/operator
- [ ] Update cost estimation for multi-field matching
- [ ] Test with various CSV structures
- [ ] Deploy and verify multi-field matching works

See MULTI_FIELD_PROGRESS.md for detailed implementation status

Note: Project has dual structure (client/ and client/src/). Multi-field components created in client/ structure to match existing EnrichmentTab.



## Current Task: Fix Production Issues
- [ ] Investigate index.css build configuration
- [ ] Fix Vite build to include index.css
- [ ] Debug storage writer timeout error
- [ ] Expand field selection to include all 40+ AudienceLab fields



## Update Field Selection to Match AudienceLab CSV
- [x] Parse AudienceLab CSV header to get all 74 field names
- [x] Update constants.ts ALL_FIELDS to use exact AudienceLab field names (UUID, FIRST_NAME, BUSINESS_EMAIL, etc.)
- [x] Map field IDs to match AudienceLab output format
- [x] Update field packages to reference correct field IDs
- [x] Test field selection displays all AudienceLab fields
- [x] Add new categories: System, Demographics, Contact, Skiptrace



## Critical Bugs (Production)
- [x] Fix "setConcurrency is not defined" error - Added setter functions to useState
- [x] Fix "setBatchSize is not defined" error - Added setter functions to useState
- [x] Fix empty results table - Changed CSV parser to use proper parseCSVLine function
- [x] Fix results table display - Show all columns from enriched data instead of just selected fields
- [x] Fix CSV download - Now uses proper CSV parser that handles quoted values
- [ ] Credit calculation issue - AudienceLab returns all 74 fields but we only charge for selected fields (documented in code with TODO)

Note: Credit calculation needs AudienceLab API to return actual cost. Current estimate may be lower than actual usage.



## New Critical Bug
- [x] Fix "unsupported column JOB_TITLE" error - Used official API documentation
- [x] Research AudienceLab API documentation - Found AUDIENCELAB_API.md with exact list
- [x] Update AUDIENCELAB_INPUT_FIELDS to use exact API column names - Now matches the 16 supported fields

Note: AudienceLab API only supports 16 input fields for matching (EMAIL, PERSONAL_EMAIL, BUSINESS_EMAIL, FIRST_NAME, LAST_NAME, PHONE, PERSONAL_ADDRESS, PERSONAL_CITY, PERSONAL_STATE, PERSONAL_ZIP, COMPANY_NAME, COMPANY_DOMAIN, COMPANY_INDUSTRY, SHA256_PERSONAL_EMAIL, LINKEDIN_URL, UP_ID). JOB_TITLE and other fields are OUTPUT only.



## Critical CSV Parsing Bug
- [x] Fix parseCSVLine to handle multi-line fields (fields with newlines inside quotes)
- [x] Fix handling of escaped quotes inside quoted fields
- [x] Fix handling of JSON arrays in CSV fields (COMPANY_NAME_HISTORY, JOB_TITLE_HISTORY)
- [x] Test with actual AudienceLab CSV that has complex COMPANY_DESCRIPTION fields - Tested with 4527 records, all parsed correctly

Fixed: Rewrote CSV parser to use character-by-character parsing with quote state tracking instead of line-by-line splitting. Now correctly handles multi-line fields, escaped quotes, and complex data.

