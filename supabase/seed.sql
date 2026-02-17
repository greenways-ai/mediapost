-- Seed data for local development
-- This runs after migrations when using `supabase db reset`

-- Note: This file is for local development only
-- It will not be run in production

-- Create a test user (optional)
-- The password would be set through the auth system
-- INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at)
-- VALUES (
--   '00000000-0000-0000-0000-000000000000',
--   'test@example.com',
--   crypt('password', gen_salt('bf')),
--   NOW()
-- );

-- The trigger create_default_accounts will automatically create
-- accounts and profile for any new user
