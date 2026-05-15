import { supabase } from './supabase';
import type { SiteData } from '../context/SiteContext';

const CONTENT_ID = 'main';

export async function loadSiteContent() {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('site_content')
    .select('data')
    .eq('id', CONTENT_ID)
    .maybeSingle();

  if (error) throw error;
  return (data?.data as Partial<SiteData> | null) || null;
}

export async function saveSiteContent(data: SiteData) {
  if (!supabase) return;

  const { error } = await supabase
    .from('site_content')
    .upsert({
      id: CONTENT_ID,
      data,
      updated_at: new Date().toISOString(),
    });

  if (error) throw error;
}
