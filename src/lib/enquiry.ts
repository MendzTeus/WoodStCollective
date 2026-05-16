type EnquiryFields = Record<string, FormDataEntryValue>;

const DEFAULT_ENQUIRY_EMAIL = 'hello@woodstreetcollective.com';

export function getEnquiryEmail(email?: string) {
  return email?.trim() || DEFAULT_ENQUIRY_EMAIL;
}

export function openMailEnquiry(subject: string, fields: EnquiryFields, email?: string) {
  const body = Object.entries(fields)
    .filter(([, value]) => String(value).trim())
    .map(([key, value]) => `${key}: ${String(value).trim()}`)
    .join('\n');

  window.location.href = `mailto:${encodeURIComponent(getEnquiryEmail(email))}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
