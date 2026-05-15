export function toExternalUrl(value?: string) {
  const trimmed = value?.trim();
  if (!trimmed) return '';

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed.replace(/^\/+/, '')}`;
}

export function toMailto(value?: string) {
  const trimmed = value?.trim();
  if (!trimmed) return '';
  return trimmed.startsWith('mailto:') ? trimmed : `mailto:${trimmed}`;
}

export function toWhatsAppUrl(value?: string) {
  const trimmed = value?.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const digits = trimmed.replace(/[^\d]/g, '');
  return digits ? `https://wa.me/${digits}` : '';
}
