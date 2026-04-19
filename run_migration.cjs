// Script to run SQL migration against Supabase
// Uses the service_role key + Management API approach
const fs = require('fs');
const path = require('path');

const PROJECT_REF = 'hlkugmhxgzcalrnnemdn';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhsa3VnbWh4Z3pjYWxybm5lbWRuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjYwMDg5MiwiZXhwIjoyMDkyMTc2ODkyfQ.r0nqwbtMioeO82EY571TBgBJbtmA0mVcBHeOzzG1xL4';

const sqlFile = fs.readFileSync(
  path.join(__dirname, 'supabase/migrations/001_initial_schema.sql'),
  'utf8'
);

// Split SQL into individual statements
const statements = sqlFile
  .split(';')
  .map(s => s.trim())
  .filter(s => s.length > 0 && !s.startsWith('--'));

async function runSQL(sql) {
  // Try the pg-meta endpoint that Supabase Studio uses internally
  const res = await fetch(
    `https://${PROJECT_REF}.supabase.co/pg/query`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'apikey': SERVICE_ROLE_KEY,
      },
      body: JSON.stringify({ query: sql }),
    }
  );
  return { status: res.status, body: await res.text() };
}

async function main() {
  console.log(`Total statements: ${statements.length}`);
  
  // First test connection
  const test = await runSQL('SELECT 1 as connected');
  console.log('Connection test:', test.status, test.body.substring(0, 200));
  
  if (test.status !== 200) {
    console.log('\\nDirect pg-meta endpoint not available. Trying alternative...');
    
    // Try the SQL API endpoint
    const alt = await fetch(
      `https://${PROJECT_REF}.supabase.co/rest/v1/`,
      {  
        headers: {
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
          'apikey': SERVICE_ROLE_KEY,
        }
      }
    );
    console.log('REST API status:', alt.status);
    console.log('REST API works but does not support DDL (CREATE TABLE).');
    console.log('\\n=== ALTERNATIVE: Use database password with psql ===');
    console.log('Please provide your Supabase database password.');
    console.log('Find it at: Supabase Dashboard → Settings → Database → Database password');
    return;
  }
  
  // Run full migration as one big query
  console.log('\\nRunning full migration...');
  const result = await runSQL(sqlFile);
  console.log('Result:', result.status);
  if (result.status === 200) {
    console.log('✅ Migration completed successfully!');
  } else {
    console.log('Response:', result.body.substring(0, 500));
  }
}

main().catch(console.error);
