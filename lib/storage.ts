import { createClient } from '@supabase/supabase-js';

export interface BlockData {
  id: string;
  code: string;
  created_at: string;
}


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Anon Key:', supabaseAnonKey ? supabaseAnonKey.slice(0, 8) + '...' : undefined);
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function saveBlock(code: string): Promise<string> {
  const { data, error } = await supabase
    .from('blocks')
    .insert([{ code }])
    .select('id')
    .single();
  if (error || !data) {
    console.error('Supabase insert error:', error);
    throw new Error('Failed to save block');
  }
  return data.id;
}

export async function getBlock(id: string): Promise<BlockData | null> {
  const { data, error } = await supabase
    .from('blocks')
    .select('*')
    .eq('id', id)
    .single();
  if (error || !data) return null;
  return data as BlockData;
}
