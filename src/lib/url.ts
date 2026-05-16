const ALLOWED_PROTOCOLS = /^https?:\/\//i;

export function toExternalUrl(value?: string) {
  const trimmed = value?.trim();
  if (!trimmed) return '';

  if (ALLOWED_PROTOCOLS.test(trimmed)) {
    return trimmed;
  }

  // Strip any non-http protocol before prepending https
  const stripped = trimmed.replace(/^[a-zA-Z][a-zA-Z0-9+\-.]*:\/\//, '').replace(/^\/+/, '');
  return `https://${stripped}`;
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
