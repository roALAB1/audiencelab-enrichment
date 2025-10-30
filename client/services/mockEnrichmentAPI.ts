/**
 * Mock Enrichment API for Demo/Testing
 * 
 * Simulates the AudienceLab enrichment API with realistic fake data
 */

// Sample data generators
const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Robert', 'Lisa', 'James', 'Mary'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
const companies = ['TechCorp', 'InnovateLabs', 'DataSystems', 'CloudWorks', 'DigitalEdge', 'SmartSolutions', 'NextGen Inc', 'FutureWorks', 'Synergy Group', 'Quantum Labs'];
const jobTitles = ['CEO', 'CTO', 'VP of Engineering', 'Marketing Director', 'Sales Manager', 'Product Manager', 'Software Engineer', 'Data Scientist', 'Operations Manager', 'HR Director'];
const cities = ['San Francisco', 'New York', 'Austin', 'Seattle', 'Boston', 'Chicago', 'Los Angeles', 'Denver', 'Atlanta', 'Portland'];
const states = ['CA', 'NY', 'TX', 'WA', 'MA', 'IL', 'CO', 'GA', 'OR'];
const countries = ['United States', 'Canada', 'United Kingdom'];

function randomItem<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generatePhoneNumber(): string {
    const area = Math.floor(Math.random() * 900) + 100;
    const prefix = Math.floor(Math.random() * 900) + 100;
    const line = Math.floor(Math.random() * 9000) + 1000;
    return `+1-${area}-${prefix}-${line}`;
}

function generateLinkedInURL(firstName: string, lastName: string): string {
    return `https://linkedin.com/in/${firstName.toLowerCase()}-${lastName.toLowerCase()}-${Math.floor(Math.random() * 999)}`;
}

/**
 * Generate mock enriched contact data
 */
function generateEnrichedContact(email: string, fields: string[]): any {
    const firstName = randomItem(firstNames);
    const lastName = randomItem(lastNames);
    const company = randomItem(companies);
    
    const contact: any = {
        email: email,
    };

    // Add requested fields
    fields.forEach(field => {
        switch (field) {
            case 'first_name':
                contact.first_name = firstName;
                break;
            case 'last_name':
                contact.last_name = lastName;
                break;
            case 'full_name':
                contact.full_name = `${firstName} ${lastName}`;
                break;
            case 'job_title':
                contact.job_title = randomItem(jobTitles);
                break;
            case 'company':
                contact.company = company;
                break;
            case 'company_domain':
                contact.company_domain = `${company.toLowerCase().replace(/\s+/g, '')}.com`;
                break;
            case 'phone':
                contact.phone = generatePhoneNumber();
                break;
            case 'mobile_phone':
                contact.mobile_phone = generatePhoneNumber();
                break;
            case 'personal_email':
                contact.personal_email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@gmail.com`;
                break;
            case 'linkedin_url':
                contact.linkedin_url = generateLinkedInURL(firstName, lastName);
                break;
            case 'city':
                contact.city = randomItem(cities);
                break;
            case 'state':
                contact.state = randomItem(states);
                break;
            case 'country':
                contact.country = randomItem(countries);
                break;
            case 'zip_code':
                contact.zip_code = String(Math.floor(Math.random() * 90000) + 10000);
                break;
            case 'timezone':
                contact.timezone = 'America/Los_Angeles';
                break;
            case 'department':
                contact.department = randomItem(['Engineering', 'Sales', 'Marketing', 'Operations', 'Finance']);
                break;
            case 'seniority':
                contact.seniority = randomItem(['Executive', 'Director', 'Manager', 'Individual Contributor']);
                break;
            case 'years_experience':
                contact.years_experience = Math.floor(Math.random() * 20) + 1;
                break;
            case 'previous_companies':
                contact.previous_companies = [randomItem(companies), randomItem(companies)];
                break;
            default:
                // For any other fields, add placeholder data
                contact[field] = `${field}_data`;
        }
    });

    return contact;
}

/**
 * Simulate API delay
 */
function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Mock enrichment function that simulates the real API
 */
export async function mockEnrichContactsParallel(
    emails: string[],
    fields: string[],
    concurrency: number = 5,
    batchSize: number = 1000,
    onProgress?: (progress: {
        totalBatches: number;
        completedBatches: number;
        totalEmails: number;
        processedEmails: number;
        percentage: number;
        creditsUsed: number;
        startTime?: number;
    }) => void,
    onBatchComplete?: (batchIndex: number, contacts: any[], usage: any) => void
): Promise<any[]> {
    // Split emails into batches
    const batches: string[][] = [];
    for (let i = 0; i < emails.length; i += batchSize) {
        batches.push(emails.slice(i, i + batchSize));
    }

    const allContacts: any[] = [];
    let completedBatches = 0;
    let processedEmails = 0;
    const creditsPerContact = fields.length; // Simplified: 1 credit per field
    let creditsUsed = 0;

    // Process batches in parallel with concurrency limit
    for (let i = 0; i < batches.length; i += concurrency) {
        const batchGroup = batches.slice(i, i + concurrency);
        
        const results = await Promise.all(
            batchGroup.map(async (batch, index) => {
                const batchIndex = i + index;
                
                // Simulate API delay (100-500ms per batch)
                await delay(Math.random() * 400 + 100);
                
                // Generate enriched contacts for this batch
                const contacts = batch.map(email => generateEnrichedContact(email, fields));
                
                const usage = {
                    records_used_hour: processedEmails + contacts.length,
                    records_limit_hour: 1000,
                    records_used_day: processedEmails + contacts.length,
                    records_limit_day: 10000,
                    records_used_month: processedEmails + contacts.length,
                    records_limit_month: 100000,
                };
                
                // Call batch complete callback
                if (onBatchComplete) {
                    onBatchComplete(batchIndex, contacts, usage);
                }

                return {
                    contacts,
                    usage,
                };
            })
        );

        // Aggregate results
        results.forEach((result) => {
            allContacts.push(...result.contacts);
            processedEmails += result.contacts.length;
            creditsUsed = processedEmails * creditsPerContact;
        });

        completedBatches += batchGroup.length;

        // Call progress callback
        if (onProgress) {
            onProgress({
                totalBatches: batches.length,
                completedBatches,
                totalEmails: emails.length,
                processedEmails,
                percentage: Math.round((completedBatches / batches.length) * 100),
                creditsUsed,
            });
        }
    }

    return allContacts;
}

