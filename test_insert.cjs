const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://hlkugmhxgzcalrnnemdn.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhsa3VnbWh4Z3pjYWxybm5lbWRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2MDA4OTIsImV4cCI6MjA5MjE3Njg5Mn0.GEfbmYzc_jH3av_wNo0r8_MCet4nZu0yLo278r6x020'
);

async function testInsertClient() {
  console.log('Testing insert client...');
  const newRow = {
      company_name: 'Test Client',
      industry: 'Tech',
      pic_name: 'Test PIC',
      pic_email: 'test@example.com',
      pic_phone: '1234567890',
      status: 'active',
      contract_end_date: new Date().toISOString().split('T')[0],
    };

  const { data, error } = await supabase
      .from('clients')
      .insert([newRow])
      .select()
      .single();

  console.log('Data:', data);
  if (error) console.log('Error:', error);
}

testInsertClient();
