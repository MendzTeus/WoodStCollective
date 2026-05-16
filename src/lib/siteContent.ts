import { supabase } from './supabase';
import type { SiteData } from '../context/SiteContext';

const CONTENT_ID = 'main';

type SiteContentRow = {
  data: Partial<SiteData> | null;
};

export async function loadSiteContent() {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('site_content')
    .select('data')
    .eq('id', CONTENT_ID)
    .returns<SiteContentRow[]>()
    .maybeSingle();

  if (error) throw error;
  return data?.data || null;
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
