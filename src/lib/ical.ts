const roomIcalUrls: Record<string, string> = {
  'classic-en-suite': import.meta.env.VITE_AIRBNB_ICAL_URL_ROOM_1 || '',
  'city-view-studio': import.meta.env.VITE_AIRBNB_ICAL_URL_ROOM_2 || '',
  'penthouse-suite': import.meta.env.VITE_AIRBNB_ICAL_URL_ROOM_3 || '',
  'loft-residency': import.meta.env.VITE_AIRBNB_ICAL_URL_ROOM_4 || '',
  'master-suite': import.meta.env.VITE_AIRBNB_ICAL_URL_ROOM_5 || '',
  'executive-studio': import.meta.env.VITE_AIRBNB_ICAL_URL_ROOM_6 || '',
};

const unfoldIcal = (value: string) => value.replace(/\r?\n[ \t]/g, '');

const parseIcalDate = (value: string) => {
  const dateValue = value.includes(':') ? value.split(':').pop() || '' : value;
  const cleanValue = dateValue.trim();
  const year = Number(cleanValue.slice(0, 4));
  const month = Number(cleanValue.slice(4, 6));
  const day = Number(cleanValue.slice(6, 8));

  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
};

const toDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export function getRoomIcalUrl(roomId: string) {
  return roomIcalUrls[roomId] || '';
}

export function parseBookedDatesFromIcal(icalText: string) {
  const bookedDates = new Set<string>();
  const events = unfoldIcal(icalText).match(/BEGIN:VEVENT[\s\S]*?END:VEVENT/g) || [];

  for (const event of events) {
    const startLine = event.split(/\r?\n/).find((line) => line.startsWith('DTSTART'));
    const endLine = event.split(/\r?\n/).find((line) => line.startsWith('DTEND'));
    const startDate = startLine ? parseIcalDate(startLine) : null;
    const endDate = endLine ? parseIcalDate(endLine) : null;

    if (!startDate || !endDate) continue;

    const date = new Date(startDate);
    while (date < endDate) {
      bookedDates.add(toDateKey(date));
      date.setDate(date.getDate() + 1);
    }
  }

  return bookedDates;
}

export { toDateKey };
