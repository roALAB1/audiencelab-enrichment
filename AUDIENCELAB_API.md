# AudienceLab API Documentation

Official API docs: https://audiencelab.mintlify.app/api-reference

## Authentication

All endpoints require API key authentication via header:
```
X-Api-Key: your_api_key_here
```

## Base URL
```
https://api.audiencelab.io
```

---

## Bulk Enrichment Workflow

The AudienceLab API uses an **asynchronous job-based system** for bulk enrichment:

1. **Submit enrichment job** → Get job ID
2. **Poll for job status** → Wait for completion
3. **Download results** → Get CSV URL

---

## 1. Create Enrichment Job

**Endpoint:** `POST /enrichments`

**Purpose:** Submit a batch of contacts for enrichment

**Request:**
```json
{
  "name": "My Enrichment Job",
  "operator": "OR",
  "columns": ["EMAIL", "FIRST_NAME", "LAST_NAME"],
  "records": [
    {
      "email": "user1@example.com"
    },
    {
      "email": "user2@example.com"
    }
  ]
}
```

**Parameters:**
- `name` (string, required) - Job name for tracking
- `operator` (string, default: "OR") - Match logic: "OR" or "AND"
- `columns` (array, optional) - Input fields present in records
- `records` (array, required) - Array of contact objects to enrich

**Input Columns (what you provide):**
- `EMAIL`
- `PERSONAL_EMAIL`
- `BUSINESS_EMAIL`
- `FIRST_NAME`
- `LAST_NAME`
- `PHONE`
- `PERSONAL_ADDRESS`
- `PERSONAL_CITY`
- `PERSONAL_STATE`
- `PERSONAL_ZIP`
- `COMPANY_NAME`
- `COMPANY_DOMAIN`
- `COMPANY_INDUSTRY`
- `SHA256_PERSONAL_EMAIL`
- `LINKEDIN_URL`
- `UP_ID`

**Response (202 Accepted):**
```json
{
  "jobId": "399e88c3-3263-4d9a-826c-437ef57f7b6c",
  "status": "IN_QUEUE"
}
```

---

## 2. Get Enrichment Jobs

**Endpoint:** `GET /enrichments`

**Purpose:** List all enrichment jobs and their status

**Query Parameters:**
- `page` (integer, default: 1) - Page number
- `page_size` (integer, default: 100) - Items per page (max 1000)

**Response (200 OK):**
```json
{
  "total_records": 150,
  "page_size": 100,
  "page": 1,
  "total_pages": 2,
  "data": [
    {
      "id": "ca80f27b-9ae8-4351-99ac-51d5b5ebe423",
      "name": "My Enrichment Job",
      "status": "COMPLETED",
      "csv_url": "gs://bucket/path/to/file.csv.gz",
      "total": 1500,
      "created_at": "2025-10-29T10:30:00Z"
    }
  ]
}
```

**Job Statuses:**
- `IN_QUEUE` - Job is queued for processing
- `PROCESSING` - Job is being processed
- `COMPLETED` - Job completed, results available
- `FAILED` - Job failed

---

## 3. Single Contact Enrichment (Real-time)

**Endpoint:** `POST /enrich`

**Purpose:** Look up a single contact in real-time (not for bulk)

**Request:**
```json
{
  "request_id": "req_123456",
  "filter": {
    "email": "user@example.com"
  },
  "fields": ["first_name", "last_name", "company", "job_title"],
  "is_or_match": false
}
```

**Parameters:**
- `filter` (object, required) - Search criteria (email, phone, name, etc.)
- `fields` (array, optional) - Fields to return in response
- `request_id` (string, optional) - Tracking ID
- `is_or_match` (boolean, default: false) - OR vs AND matching

**Available Output Fields:**
- `company` - Company name
- `job_title` - Job title/position
- `first_name` - First name
- `last_name` - Last name
- `b2b_email` - Business email address
- `personal_email` - Personal email address
- `b2b_phone` - Business phone number
- `personal_phone` - Personal phone number
- `sha256` - SHA256 hash identifier
- `linkedin_url` - LinkedIn profile URL
- `address` - Street address
- `city` - City
- `state` - State/province
- `zip` - ZIP/postal code
- `industry` - Industry classification
- `company_domain` - Company domain

**Response (200 OK):**
```json
{
  "request_id": "req_123456",
  "timestamp": 1704067200000,
  "found": 1,
  "result": [
    {
      "email": "user@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "company_name": "Acme Corp",
      "job_title": "Senior Engineer"
    }
  ]
}
```

---

## Implementation Notes

### For Dashboard Integration

1. **Bulk Enrichment (Recommended for 100+ contacts):**
   - Use `POST /enrichments` to submit job
   - Poll `GET /enrichments` to check status
   - Download CSV from `csv_url` when status is `COMPLETED`

2. **Real-time Enrichment (For small batches < 100):**
   - Use `POST /enrich` with individual contacts
   - Process in parallel batches
   - Immediate results

### Rate Limits

- Check API documentation for current rate limits
- Bulk jobs are preferred for large datasets
- Real-time endpoint may have stricter limits

### Error Handling

- `400` - Bad Request (invalid parameters)
- `401` - Unauthorized (invalid API key)
- `500` - Internal Server Error

---

## Example cURL Commands

**Create Enrichment Job:**
```bash
curl -X POST https://api.audiencelab.io/enrichments \
  -H "Content-Type: application/json" \
  -H "X-Api-Key: YOUR_API_KEY" \
  -d '{
    "name": "Test Job",
    "operator": "OR",
    "columns": ["EMAIL"],
    "records": [
      {"email": "test@example.com"}
    ]
  }'
```

**Check Job Status:**
```bash
curl -X GET https://api.audiencelab.io/enrichments \
  -H "X-Api-Key: YOUR_API_KEY"
```

**Real-time Lookup:**
```bash
curl -X POST https://api.audiencelab.io/enrich \
  -H "Content-Type: application/json" \
  -H "X-Api-Key: YOUR_API_KEY" \
  -d '{
    "filter": {
      "email": "test@example.com"
    },
    "fields": ["first_name", "last_name", "company"]
  }'
```

