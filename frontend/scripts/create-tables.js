require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Get the Supabase credentials from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables. Make sure you have NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env.local file');
  process.exit(1);
}

// Create a Supabase client with the service role key for admin privileges
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Main function to create tables
async function createTables() {
  console.log('Creating required tables in Supabase...');

  try {
    console.log('Creating user_profiles table...');
    
    // We need to use the Supabase REST API directly since the JavaScript client
    // doesn't support direct SQL execution
    const apiEndpoint = `${supabaseUrl}/rest/v1/`;
    
    const sql = `
      CREATE TABLE IF NOT EXISTS public.user_profiles (
        id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
        email TEXT NOT NULL,
        role TEXT NOT NULL,
        "fullName" TEXT NOT NULL,
        "employmentStartDate" DATE,
        "yearsOfExperience" INTEGER,
        "subject" TEXT,
        "grade" TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
      );
    `;
    
    // Log instructions for manual table creation
    console.log('');
    console.log('============================================================');
    console.log('ERROR: The JavaScript client cannot execute SQL directly.');
    console.log('');
    console.log('To create the user_profiles table, please:');
    console.log('1. Log into your Supabase dashboard');
    console.log('2. Go to the SQL Editor');
    console.log('3. Create a new query');
    console.log('4. Copy and paste the SQL below:');
    console.log('');
    console.log(sql);
    console.log('');
    console.log('After creating the table, run the following SQL to add RLS policies:');
    console.log('');
    console.log(`
      -- Set up Row Level Security
      ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
      
      -- Create policies
      -- Users can read their own profile
      CREATE POLICY "Users can read own profile"
        ON public.user_profiles
        FOR SELECT
        USING (auth.uid() = id);
      
      -- Users can update their own profile
      CREATE POLICY "Users can update own profile"
        ON public.user_profiles
        FOR UPDATE
        USING (auth.uid() = id);
      
      -- Super users can read all profiles
      CREATE POLICY "Super users can read all profiles"
        ON public.user_profiles
        FOR SELECT
        USING (
          EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE id = auth.uid() AND role = 'super_user'
          )
        );
      
      -- Super users can update all profiles
      CREATE POLICY "Super users can update all profiles"
        ON public.user_profiles
        FOR UPDATE
        USING (
          EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE id = auth.uid() AND role = 'super_user'
          )
        );
      
      -- Super users can insert profiles
      CREATE POLICY "Super users can insert profiles"
        ON public.user_profiles
        FOR INSERT
        WITH CHECK (
          EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE id = auth.uid() AND role = 'super_user'
          )
        );
      
      -- Special policy for the seed script to insert initial profiles
      CREATE POLICY "Service role can insert profiles"
        ON public.user_profiles
        FOR INSERT
        WITH CHECK (true);
    `);
    console.log('');
    console.log('For convenience, the complete SQL is available in:');
    console.log('scripts/create-tables-sql.sql');
    console.log('============================================================');
    
    console.log('');
    console.log('Would you like me to attempt a check if the user_profiles table already exists?');
    console.log('This will help determine if you need to create it manually. (y/n)');
    
    // Use async read from stdin
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    const answer = await new Promise((resolve) => {
      readline.question('> ', (ans) => {
        readline.close();
        resolve(ans.toLowerCase());
      });
    });
    
    if (answer === 'y' || answer === 'yes') {
      // Try to query the user_profiles table to see if it exists
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id')
        .limit(1);
      
      if (error) {
        console.log('');
        console.log('Error querying user_profiles table:');
        console.log(error.message);
        console.log('');
        console.log('This likely means the table does not exist yet. Please create it using the SQL above.');
      } else {
        console.log('');
        console.log('Good news! The user_profiles table already exists.');
        console.log('You can proceed with seeding users using:');
        console.log('npm run seed:users');
      }
    } else {
      console.log('');
      console.log('Please create the table manually using the SQL above before running seed:users');
    }
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

// Run the function
createTables().catch(error => {
  console.error('Unexpected error:', error);
  process.exit(1);
}); 