const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
// Initialize Supabase client with the service role key
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

exports.handler = async (event, context) => {
  // Enable CORS by setting headers
  const headers = {
    'Access-Control-Allow-Origin': '*', // Allow from any origin
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (event.httpMethod === 'OPTIONS') {
    // Handle preflight requests
    return {
      statusCode: 200,
      headers,
      body: 'OK',
    };
  }

  const userId = event.queryStringParameters.id;

  if (!userId) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'User ID is required' }),
    };
  }

  try {
    // Perform the delete operation
    const { error } = await supabase.auth.admin.deleteUser(userId);

    if (error) {
      console.error('Error deleting user:', error);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: error.message }),
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'User deleted successfully.' }),
    };
  } catch (err) {
    console.error('Unexpected error deleting user:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};
