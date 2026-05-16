import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { config } from 'dotenv';

config({ path: path.resolve(process.cwd(), '.env'), quiet: true });

const outputDir = process.env.ICAL_CACHE_DIR || path.resolve(process.cwd(), 'public/calendar-cache');
const intervalMs = Number(process.env.ICAL_SYNC_INTERVAL_MS || 30000);

const rooms = [
  ['classic-en-suite', process.env.AIRBNB_ICAL_URL_ROOM_1],
  ['city-view-studio', process.env.AIRBNB_ICAL_URL_ROOM_2],
  ['penthouse-suite', process.env.AIRBNB_ICAL_URL_ROOM_3],
  ['loft-residency', process.env.AIRBNB_ICAL_URL_ROOM_4],
  ['master-suite', process.env.AIRBNB_ICAL_URL_ROOM_5],
  ['executive-studio', process.env.AIRBNB_ICAL_URL_ROOM_6],
];

const unfoldIcal = (value) => value.replace(/\r?\n[ \t]/g, '');

const parseIcalDate = (value) => {
  const dateValue = value.includes(':') ? value.split(':').pop() || '' : value;
  const cleanValue = dateValue.trim();
  const year = Number(cleanValue.slice(0, 4));
  const month = Number(cleanValue.slice(4, 6));
  const day = Number(cleanValue.slice(6, 8));

  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
};

const toDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const parseBookedDatesFromIcal = (icalText) => {
  const bookedDates = new Set();
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

  return [...bookedDates].sort();
};

async function fetchIcal(url) {
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) throw new Error(`Airbnb returned ${response.status}`);

  const text = await response.text();
  if (!text.includes('BEGIN:VCALENDAR')) throw new Error('Airbnb response was not iCal');

  return text;
}

async function syncRoom(roomId, icalUrl) {
  if (!icalUrl) throw new Error(`Missing iCal URL for ${roomId}`);

  const icalText = await fetchIcal(icalUrl);
  const bookedDates = parseBookedDatesFromIcal(icalText);
  const payload = {
    roomId,
    syncedAt: new Date().toISOString(),
    bookedDates,
  };

  await fs.mkdir(outputDir, { recursive: true });
  await fs.writeFile(
    path.join(outputDir, `${roomId}.json`),
    `${JSON.stringify(payload, null, 2)}\n`,
    'utf8',
  );

  return bookedDates.length;
}

async function syncAll() {
  const results = await Promise.allSettled(
    rooms.map(async ([roomId, icalUrl]) => [roomId, await syncRoom(roomId, icalUrl)]),
  );

  for (const result of results) {
    if (result.status === 'fulfilled') {
      const [roomId, count] = result.value;
      console.log(`[ical-sync] ${roomId}: ${count} booked dates`);
    } else {
      console.error(`[ical-sync] ${result.reason.message}`);
    }
  }
}

await syncAll();

if (process.argv.includes('--watch')) {
  setInterval(syncAll, intervalMs);
}
