const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const regions = [
  'aws-0-ap-southeast-1.pooler.supabase.com', // Singapore (most likely for ID)
  'aws-0-us-east-1.pooler.supabase.com',
  'aws-0-eu-central-1.pooler.supabase.com',
  'aws-0-us-west-1.pooler.supabase.com',
  'aws-0-ap-southeast-2.pooler.supabase.com',
  'aws-0-ap-northeast-1.pooler.supabase.com',
];

const sqlFile = fs.readFileSync(
  path.join(__dirname, 'supabase/migrations/001_initial_schema.sql'),
  'utf8'
);

async function tryConnect(host) {
  const connectionString = `postgresql://postgres.hlkugmhxgzcalrnnemdn:Nasuti0n1011@${host}:6543/postgres`;
  console.log(`Trying ${host}...`);
  const client = new Client({ connectionString, connectionTimeoutMillis: 5000 });
  try {
    await client.connect();
    console.log(`✅ Successfully connected to ${host}!`);
    console.log('Running SQL migration script...');
    await client.query(sqlFile);
    console.log('✅ Migration completed successfully!');
    await client.end();
    return true;
  } catch (err) {
    if (err.code !== 'ENOTFOUND' && err.code !== 'ETIMEDOUT') {
      console.log(`❌ Auth/fatal error at ${host}:`, err.message);
    }
    await client.end().catch(()=>null);
    return false;
  }
}

async function main() {
  for (const host of regions) {
    const success = await tryConnect(host);
    if (success) return;
  }
  console.log('❌ Could not connect to any common pooler regions.');
}

main();
