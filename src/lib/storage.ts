import { supabase } from './supabase';

const BUCKET = 'site-images';
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

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

  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new Error('Only JPEG, PNG, WebP, and GIF images are allowed.');
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    throw new Error('Image must be 5MB or smaller.');
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
