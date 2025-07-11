require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Get the Supabase credentials from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // You'll need to add this to your .env.local file

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables. Make sure you have NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env.local file');
  process.exit(1);
}

// Create a Supabase client with the service role key for admin privileges
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Test users to create
const testUsers = [
  {
    email: 'super@example.com',
    password: 'SuperPass123!',
    profile: {
      fullName: 'Super User',
      role: 'super_user'
    }
  },
  {
    email: 'leader@example.com',
    password: 'LeaderPass123!',
    profile: {
      fullName: 'Administrator',
      role: 'school_leader'
    }
  },
  {
    email: 'teacher@example.com',
    password: 'TeacherPass123!',
    profile: {
      fullName: 'Teacher User',
      role: 'teacher',
      subject: 'Mathematics',
      grade: '10th Grade',
      yearsOfExperience: 5,
      employmentStartDate: '2019-08-15'
    }
  }
];

// Function to create a user and their profile
async function createUserWithProfile(userData) {
  try {
    // Create the user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      email_confirm: true
    });
    
    if (authError) {
      console.error(`Error creating user ${userData.email}:`, authError.message);
      return null;
    }
    
    console.log(`Created auth user: ${userData.email} with ID: ${authData.user.id}`);
    
    // Add the user profile
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        id: authData.user.id,
        email: userData.email,
        ...userData.profile
      });
    
    if (profileError) {
      console.error(`Error creating profile for ${userData.email}:`, profileError.message);
      return null;
    }
    
    console.log(`Created profile for: ${userData.email} with role: ${userData.profile.role}`);
    return authData.user;
  } catch (error) {
    console.error(`Unexpected error creating user ${userData.email}:`, error.message);
    return null;
  }
}

// Main function to seed users
async function seedUsers() {
  console.log('Starting to seed test users...');
  
  for (const user of testUsers) {
    console.log(`Processing user: ${user.email}`);
    
    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('user_profiles')
      .select('id, email')
      .eq('email', user.email)
      .single();
    
    if (existingUser) {
      console.log(`User ${user.email} already exists, skipping...`);
      continue;
    }
    
    await createUserWithProfile(user);
  }
  
  console.log('User seeding completed!');
  console.log('\nTest Users Created:');
  testUsers.forEach(user => {
    console.log(`- ${user.profile.role}: ${user.email} / ${user.password}`);
  });
}

// Run the seed function
seedUsers().catch(error => {
  console.error('Error in seed process:', error);
  process.exit(1);
}); 