// server.js (Node.js with Express)
import express from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config()
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const app = express();
const port = 3000;
app.use(cors())
app.options('*', cors());
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabaseUrl = process.env.SUPABASE_URL
// Initialize Supabase client with the service role key
const supabase = createClient(supabaseUrl, serviceRoleKey );
console.log(supabaseUrl)
app.delete('/delete-user/:id', async (req, res) => {
  const userId = req.params.id;

  // Perform the delete operation
  const { error } = await supabase.auth.admin.deleteUser(userId);

  if (error) {
    console.error('Error deleting user:', error);
    return res.status(400).json({ error: error.message });
  }

  res.status(200).json({ message: 'User deleted successfully.' });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
