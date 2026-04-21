const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://hlkugmhxgzcalrnnemdn.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhsa3VnbWh4Z3pjYWxybm5lbWRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2MDA4OTIsImV4cCI6MjA5MjE3Njg5Mn0.GEfbmYzc_jH3av_wNo0r8_MCet4nZu0yLo278r6x020'
);

async function test() {
  console.log('Testing users table read...');
  const { data: user, error } = await supabase.from('users').select('*').eq('email', 'andri.nasution21@gmail.com').single();
  console.log('User:', user);
  if (error) console.log('Error:', error);

  if (user) {
    console.log('Testing user_roles with roles...');
    const { data: roles, error: rolesError } = await supabase.from('user_roles').select('roles(name)').eq('user_id', user.id);
    console.log('Roles:', JSON.stringify(roles, null, 2));
    if (rolesError) console.log('RolesError:', rolesError);
    
    // Testing the ambiguous join attempt
    const { data: rawUserRole, error: rawError } = await supabase.from('user_roles').select('*').eq('user_id', user.id);
    console.log('Raw user_roles:', JSON.stringify(rawUserRole, null, 2))
    if (rawError) console.log('RawError:', rawError);

    // Testing the array mapping in authStore
    if (roles) {
      console.log('Parsed role:', roles.length > 0 && roles[0].roles ? roles[0].roles.name : null);
    }
  }
}

test();
