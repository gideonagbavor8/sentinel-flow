import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Use this for client-side (public) operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Use this for server-side (admin) operations (like Audit Logs)
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export const uploadFile = async (file: File, projectId: string) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `${projectId}/${fileName}`;

  const { data, error } = await supabase.storage
    .from('sentinel')
    .upload(filePath, file);

  if (error) throw error;
  return data.path;
};