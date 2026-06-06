import { supabase } from './supabase';
import type { SiteData } from '../context/SiteContext';

const CONTENT_ID = 'main';

type SiteContentRow = {
  data: Partial<SiteData> | null;
};

export async function loadSiteContent() {
  if (!supabase) return null;

  const { data: sessionData } = await supabase.auth.getSession();
  const table = sessionData.session ? 'site_content' : 'site_content_public';

  const { data, error } = await supabase
    .from(table)
    .select('data')
    .eq('id', CONTENT_ID)
    .returns<SiteContentRow[]>()
    .maybeSingle();

  if (error && table === 'site_content') {
    const fallback = await supabase
      .from('site_content_public')
      .select('data')
      .eq('id', CONTENT_ID)
      .returns<SiteContentRow[]>()
      .maybeSingle();

    if (fallback.error) throw fallback.error;
    return fallback.data?.data || null;
  }

  if (error) throw error;
  return data?.data || null;
}

export async function saveSiteContent(data: SiteData) {
  if (!supabase) return;
  const publicData = toPublicSiteContent(data);

  const { error } = await supabase
    .from('site_content')
    .upsert({
      id: CONTENT_ID,
      data,
      updated_at: new Date().toISOString(),
    });

  if (error) throw error;

  const { error: publicError } = await supabase
    .from('site_content_public')
    .upsert({
      id: CONTENT_ID,
      data: publicData,
      updated_at: new Date().toISOString(),
    });

  if (publicError) throw publicError;
}

function toPublicSiteContent(data: SiteData): SiteData {
  const approvedReviews = Object.fromEntries(
    Object.entries(data.reviews || {}).filter(([, review]) => review.approved),
  );

  return {
    pages: data.pages,
    rooms: data.rooms,
    reviews: approvedReviews,
    settings: data.settings,
  };
}
