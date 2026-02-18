import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const email = 'zcaudate@outlook.com';

async function makeAdmin() {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // First, find the user by email
  const { data: { users }, error: userError } = await supabase.auth.admin.listUsers();

  if (userError) {
    console.error('Error fetching users:', userError);
    return;
  }

  const user = users.find(u => u.email === email);

  if (!user) {
    console.error(`User with email ${email} not found`);
    return;
  }

  console.log(`Found user: ${user.id} (${user.email})`);

  // Update the profile to set is_admin = true
  const { data, error } = await supabase
    .from('profiles')
    .update({ is_admin: true })
    .eq('id', user.id)
    .select();

  if (error) {
    console.error('Error updating profile:', error);
    return;
  }

  console.log(`✅ Successfully made ${email} an admin!`);
  console.log('Updated profile:', data);
}

makeAdmin();
