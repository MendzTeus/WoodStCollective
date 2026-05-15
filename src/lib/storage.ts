import { supabase } from './supabase';

const BUCKET = 'site-images';

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'image';

export async function uploadSiteImage(file: File, folder: string) {
  if (!supabase) {
    throw new Error('Supabase is not configured.');
  }

  const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const path = `${slugify(folder)}/${Date.now()}-${slugify(file.name.replace(/\.[^.]+$/, ''))}.${extension}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, {
      cacheControl: '31536000',
      contentType: file.type,
      upsert: false,
    });

  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
