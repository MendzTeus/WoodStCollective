import fs from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();
const sourcePath = path.resolve(projectRoot, process.argv[2] || '../fotos.html');
const jsonOutputPath = path.resolve(projectRoot, process.argv[3] || '../room_photo_options_site_ready.json');
const tsOutputPath = path.resolve(projectRoot, 'src/data/roomPhotoOptions.ts');
const fallbackRoomsPath = path.resolve(projectRoot, '../airbnb_rooms_site_ready.json');

const SOURCE_URL_REGEX = /https:\/\/a0\.muscache\.com\/im\/pictures\/hosting\/Hosting-[^"' <,)]+/g;

const roomMap = {
  1: { id: 'classic-en-suite', listingId: '1523978018503532881' },
  2: { id: 'city-view-studio', listingId: '1523922798240522995' },
  3: { id: 'penthouse-suite', listingId: '1523956559132675863' },
  4: { id: 'loft-residency', listingId: '1521765380778708080' },
  5: { id: 'master-suite', listingId: '1522455244829831002' },
  6: { id: 'executive-studio', listingId: '1517332573480357530' },
};

const sections = [
  { key: 'bedroom', title: 'Bedroom', labels: ['Bedroom'] },
  { key: 'bathroom', title: 'Full bathroom', labels: ['Full bathroom'] },
];

const normalizeUrl = (url) => url.split('?')[0].replace(/&amp;/g, '&');
const unique = (values) => [...new Set(values.filter(Boolean))];

const extractUrls = (html) => unique(
  [...html.matchAll(SOURCE_URL_REGEX)].map((match) => normalizeUrl(match[0])),
);

const extractAmenities = (html) => unique(
  [...html.matchAll(/<li[^>]*>\s*<span>([^<]+)<\/span>/g)].map((match) => (
    match[1]
      .replace(/&amp;/g, '&')
      .replace(/\s+/g, ' ')
      .trim()
  )),
);

const findRoomBlocks = (html) => {
  const matches = [...html.matchAll(/Quarto\s+(\d+)/g)];

  return matches.map((match, index) => ({
    roomNumber: Number(match[1]),
    html: html.slice(match.index, matches[index + 1]?.index ?? html.length),
  }));
};

const findSectionMarkers = (html) => (
  [...html.matchAll(/id="scrollTo_([^"]+)"/g)]
    .map((match) => ({ label: match[1], index: match.index }))
    .filter((marker) => !/^\d+$/.test(marker.label))
);

const findOverviewImage = (html, label) => {
  const marker = `Scroll to ${label}`;
  const start = html.indexOf(marker);
  if (start === -1) return null;

  const nextMarker = html.indexOf('Scroll to ', start + marker.length);
  const searchBlock = html.slice(start, nextMarker === -1 ? html.length : nextMarker);
  return extractUrls(searchBlock)[0] || null;
};

const getKnownNonRoomImages = (roomHtml) => {
  const selectedLabels = new Set(sections.flatMap((section) => section.labels));
  const markers = findSectionMarkers(roomHtml);

  return unique(markers.flatMap((marker, index) => {
    if (selectedLabels.has(marker.label)) return [];

    const sectionHtml = roomHtml.slice(marker.index, markers[index + 1]?.index ?? roomHtml.length);
    return [findOverviewImage(roomHtml, marker.label), ...extractUrls(sectionHtml)];
  }));
};

const extractSection = (roomHtml, section) => {
  const markers = findSectionMarkers(roomHtml);
  const markerIndex = markers.findIndex((marker) => section.labels.includes(marker.label));
  const sourceLabel = markerIndex >= 0 ? markers[markerIndex].label : section.labels[0];
  const sectionHtml = markerIndex >= 0
    ? roomHtml.slice(markers[markerIndex].index, markers[markerIndex + 1]?.index ?? roomHtml.length)
    : '';

  const overviewImage = findOverviewImage(roomHtml, sourceLabel);
  const sectionImages = extractUrls(sectionHtml);
  const images = unique([overviewImage, ...sectionImages]).map((url, index) => ({
    id: `${section.key}-${index + 1}`,
    url,
    source: index === 0 && url === overviewImage ? 'overview-thumbnail' : 'section-gallery',
  }));

  return {
    key: section.key,
    title: section.title,
    sourceLabel,
    amenities: extractAmenities(sectionHtml),
    images,
    notes: sectionImages.length === 0 && overviewImage
      ? ['Airbnb HTML only contained the overview thumbnail for this room section.']
      : [],
  };
};

const html = fs.readFileSync(sourcePath, 'utf8');
const fallbackRooms = fs.existsSync(fallbackRoomsPath)
  ? JSON.parse(fs.readFileSync(fallbackRoomsPath, 'utf8')).rooms || []
  : [];

const fallbackRoomsByListingId = new Map(
  fallbackRooms.map((room) => [room.id, room]),
);

const rooms = findRoomBlocks(html).map((block) => {
  const room = roomMap[block.roomNumber];
  if (!room) return null;

  const sectionData = Object.fromEntries(sections.map((section) => [
    section.key,
    extractSection(block.html, section),
  ]));
  const selectedUrls = new Set(sections.flatMap((section) => (
    sectionData[section.key].images.map((image) => image.url)
  )));
  const knownNonRoomUrls = new Set(getKnownNonRoomImages(block.html));
  const fallbackRoom = fallbackRoomsByListingId.get(room.listingId);
  const fallbackImages = unique([
    fallbackRoom?.heroImage,
    ...(fallbackRoom?.gallery || []),
  ]).filter((url) => !knownNonRoomUrls.has(url) && !selectedUrls.has(url));

  if (fallbackImages.length > 0) {
    sectionData.airbnbRoomGallery = {
      key: 'airbnbRoomGallery',
      title: 'Room / bathroom candidates',
      sourceLabel: 'Airbnb room gallery',
      amenities: [],
      images: fallbackImages.map((url, index) => ({
        id: `airbnb-room-gallery-${index + 1}`,
        url,
        source: 'airbnb-room-gallery',
      })),
      notes: ['Filtered against known kitchen, dining, office, balcony, deck, and exterior Airbnb sections.'],
    };
  }

  return {
    roomId: room.id,
    roomNumber: block.roomNumber,
    listingId: room.listingId,
    sections: sectionData,
    images: unique(Object.values(sectionData).flatMap((section) => (
      section.images.map((image) => image.url)
    ))),
  };
}).filter(Boolean);

const output = {
  generatedAt: new Date().toISOString(),
  sourceFile: sourcePath,
  schema: 'room-photo-options-v1',
  rooms,
};

fs.writeFileSync(jsonOutputPath, `${JSON.stringify(output, null, 2)}\n`);
fs.writeFileSync(
  tsOutputPath,
  `export const roomPhotoOptionGroups = ${JSON.stringify(rooms, null, 2)} as const;\n\nexport type RoomPhotoOptionGroup = typeof roomPhotoOptionGroups[number];\nexport type RoomPhotoOptionSection = keyof RoomPhotoOptionGroup['sections'];\n\ntype RoomPhotoOptionImage = {\n  readonly id: string;\n  readonly url: string;\n  readonly source: string;\n};\n\ntype RoomPhotoOptionSectionData = {\n  readonly key: string;\n  readonly title: string;\n  readonly sourceLabel: string;\n  readonly amenities: readonly string[];\n  readonly images: readonly RoomPhotoOptionImage[];\n  readonly notes: readonly string[];\n};\n\nexport const getRoomPhotoOptionGroup = (roomId: string) => (\n  roomPhotoOptionGroups.find((group) => group.roomId === roomId)\n);\n\nexport const getRoomPhotoOptions = (roomId: string) => {\n  const group = getRoomPhotoOptionGroup(roomId);\n  if (!group) return [];\n\n  const sections = Object.values(group.sections) as readonly RoomPhotoOptionSectionData[];\n\n  return sections.flatMap((section) => (\n    section.images.map((image: RoomPhotoOptionImage, index: number) => ({\n      ...image,\n      sectionKey: section.key,\n      sectionTitle: section.title,\n      sectionIndex: index + 1,\n    }))\n  ));\n};\n`,
);

console.log(`Wrote ${jsonOutputPath}`);
console.log(`Wrote ${tsOutputPath}`);
