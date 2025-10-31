# Multi-Field Input Matching - Implementation Progress

## Overview
Adding support for multi-field input matching with OR/AND logic to the enrichment workflow. This allows users to match contacts based on multiple CSV columns (not just email) and choose whether to use OR or AND logic.

## ✅ Completed Components

### 1. Type Definitions (`client/types/columnMapping.ts`)
- **16 AudienceLab input fields** supported: EMAIL, FIRST_NAME, LAST_NAME, PHONE, COMPANY_NAME, etc.
- **Auto-detection patterns** for common CSV column names
- **Field categorization** (Email, Name, Phone, Address, Company, Social)
- **Helper functions** for field display names and auto-mapping

### 2. Column Mapping UI (`client/features/enrichment/ColumnMappingStep.tsx`)
- **Visual column mapper** with enable/disable toggles for each CSV column
- **OR/AND operator toggle** with clear explanations
- **Auto-detection** of field mappings on CSV upload
- **Sample value preview** for each column
- **Grouped field selector** by category (Email, Name, Company, etc.)
- **Validation feedback** showing how many fields are selected

### 3. CSV Parser (`client/utils/csvParser.ts`)
- **Proper CSV parsing** handling quotes, commas, and newlines
- **Column extraction** from header row
- **Data row parsing** into structured records
- **CSV generation** utility for export

### 4. API Client Updates (`client/services/audienceLabAPI.ts`)
- **Updated `createEnrichmentJob()`** to accept:
  - `records`: Array of contact records with multiple fields
  - `columns`: Array of column names being provided
  - `operator`: 'OR' or 'AND' match logic
- **Updated `enrichContactsJobBased()`** to pass through new parameters

## 🔄 In Progress

### 5. EnrichmentTab Integration (`client/features/enrichment/EnrichmentTab_new.tsx`)
**Status:** Partially complete (logic done, UI rendering incomplete)

**Completed:**
- State management for column mappings and match operator
- CSV parsing on file upload
- Validation based on mapped columns
- Job submission with mapped records and columns
- Callback handlers for mapping changes

**Remaining:**
- Complete the UI rendering (copy from original EnrichmentTab)
- Integrate ColumnMappingStep component into the workflow
- Update the upload section to show parsed CSV info
- Test the complete workflow

## ❌ Not Started

### 6. Validation Updates
- Update validation logic to check specific field types (email format, phone format, etc.)
- Add field-specific validation messages
- Handle duplicate detection across multiple fields

### 7. Cost Estimation Updates
- Currently estimates based on row count only
- Should factor in number of input fields being matched
- Add tooltip explaining cost calculation

### 8. Testing & Deployment
- Test with various CSV structures
- Test OR vs AND logic
- Test auto-detection accuracy
- Deploy to Vercel
- Update user documentation

## 📋 Next Steps

### Immediate (to complete the feature):

1. **Finish EnrichmentTab UI:**
   ```bash
   # Copy UI sections from EnrichmentTab.tsx.backup
   # Integrate ColumnMappingStep between upload and field selection
   # Update step numbering (1. Upload, 2. Map Columns, 3. Select Fields, 4. Start)
   ```

2. **Replace old EnrichmentTab:**
   ```bash
   mv client/features/enrichment/EnrichmentTab_new.tsx client/features/enrichment/EnrichmentTab.tsx
   ```

3. **Test locally:**
   - Upload CSV with multiple columns
   - Verify auto-detection works
   - Test OR vs AND logic
   - Verify job submission with mapped fields

4. **Deploy to Vercel:**
   ```bash
   git add -A
   git commit -m "Add multi-field input matching with OR/AND logic"
   git push
   ```

### Future Enhancements:

- **Save column mappings** as templates for reuse
- **Field-specific validation** (email format, phone format, etc.)
- **Preview matched records** before submitting job
- **Support for fuzzy matching** on certain fields
- **Batch validation** for large CSVs

## 🐛 Known Issues

1. **EnrichmentTab_new.tsx returns null** - UI rendering not implemented yet
2. **Original EnrichmentTab still in use** - New version not activated
3. **No field-specific validation** - All fields treated as strings
4. **Cost estimation unchanged** - Doesn't account for multi-field matching

## 📁 File Structure

```
client/
├── types/
│   └── columnMapping.ts          ✅ Complete
├── utils/
│   └── csvParser.ts               ✅ Complete
├── features/enrichment/
│   ├── ColumnMappingStep.tsx      ✅ Complete
│   ├── EnrichmentTab.tsx          ⚠️  Original (still in use)
│   ├── EnrichmentTab.tsx.backup   📦 Backup
│   └── EnrichmentTab_new.tsx      🔄 In progress
└── services/
    └── audienceLabAPI.ts          ✅ Updated
```

## 🔧 Technical Notes

### API Request Format (AudienceLab)
```json
{
  "name": "Job_Name",
  "operator": "OR",  // or "AND"
  "columns": ["EMAIL", "FIRST_NAME", "LAST_NAME"],
  "records": [
    {
      "EMAIL": "john@example.com",
      "FIRST_NAME": "John",
      "LAST_NAME": "Doe"
    }
  ]
}
```

### Column Mapping Flow
1. User uploads CSV
2. Parse CSV → extract columns
3. Auto-detect mappings (email → EMAIL, first_name → FIRST_NAME)
4. User reviews/adjusts mappings
5. User selects OR/AND logic
6. User selects output fields to enrich
7. Submit job with mapped records

### Validation Logic
- Row is **valid** if at least one enabled mapped field has a value
- Row is **duplicate** if all enabled field values match another row
- Row is **invalid** if all enabled fields are empty

## 💡 Design Decisions

1. **Auto-detection first, manual override available** - Most users will have standard column names
2. **OR as default operator** - More permissive, better for data quality issues
3. **Enable/disable per column** - Flexibility to exclude certain fields from matching
4. **Sample values shown** - Helps users verify correct mapping
5. **Grouped field selector** - Easier to find the right field among 16 options

## 🎯 Success Criteria

- [ ] User can upload CSV with any column structure
- [ ] System auto-detects common field mappings
- [ ] User can manually map/unmap columns
- [ ] User can toggle OR/AND logic
- [ ] Job submission includes all mapped fields
- [ ] Enrichment results returned correctly
- [ ] Cost estimation accounts for multi-field matching
- [ ] UI is intuitive and provides clear feedback

