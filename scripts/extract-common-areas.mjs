import fs from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();
const sourcePath = path.resolve(projectRoot, process.argv[2] || '../fotos.html');
const jsonOutputPath = path.resolve(projectRoot, process.argv[3] || '../common_areas_site_ready.json');
const tsOutputPath = path.resolve(projectRoot, 'src/data/commonAreas.ts');

const SOURCE_URL_REGEX = /https:\/\/a0\.muscache\.com\/im\/pictures\/hosting\/Hosting-[^"' <,]+/g;

const groups = [
  {
    marker: 'Quartos 1, 2 e 3',
    id: 'rooms-1-3',
    title: 'Rooms 1, 2 and 3 common areas',
    roomIds: ['classic-en-suite', 'city-view-studio', 'penthouse-suite'],
    roomNumbers: [1, 2, 3],
    kitchenVariant: 'rooms 1-3 kitchen',
  },
  {
    marker: 'Quartos 4, 5 e 6',
    id: 'rooms-4-6',
    title: 'Rooms 4, 5 and 6 common areas',
    roomIds: ['loft-residency', 'master-suite', 'executive-studio'],
    roomNumbers: [4, 5, 6],
    kitchenVariant: 'rooms 4-6 kitchen',
  },
];

const sections = [
  {
    key: 'sharedFullKitchen',
    labels: ['Shared full kitchen'],
    title: 'Shared full kitchen',
    description: 'Shared full kitchen for food prep, coffee, and guest storage.',
  },
  {
    key: 'sharedDiningArea',
    labels: ['Shared dining area'],
    title: 'Shared dining area',
    description: 'Shared dining area for meals, planning, and informal team sessions.',
  },
  {
    key: 'sharedOffice',
    labels: ['Shared office'],
    title: 'Shared office',
    description: 'Shared office with hot desks, monitors, and fast Wi-Fi.',
  },
  {
    key: 'sharedBalcony',
    labels: ['Shared balcony', 'Shared deck'],
    title: 'Shared balcony',
    description: 'Shared balcony or deck for breaks, calls, and fresh-air working.',
  },
];

const readFile = (filePath) => fs.readFileSync(filePath, 'utf8');

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

const findGroupBlocks = (html) => groups.map((group, index) => {
  const start = html.indexOf(group.marker);
  if (start === -1) {
    throw new Error(`Could not find ${group.marker} in ${sourcePath}`);
  }

  const nextGroupStart = groups[index + 1]
    ? html.indexOf(groups[index + 1].marker, start + group.marker.length)
    : -1;

  return {
    ...group,
    html: html.slice(start, nextGroupStart === -1 ? html.length : nextGroupStart),
  };
});

const findRegionBlocks = (html) => {
  const matches = [...html.matchAll(/role="region" aria-label="([^"]+)"/g)];
  return matches.map((match, index) => ({
    label: match[1],
    start: match.index,
    end: matches[index + 1]?.index ?? html.length,
  }));
};

const findOverviewImage = (html, label) => {
  const marker = `Scroll to ${label}`;
  const start = html.indexOf(marker);
  if (start === -1) return null;

  const nextMarker = html.indexOf('Scroll to ', start + marker.length);
  const searchBlock = html.slice(start, nextMarker === -1 ? html.length : nextMarker);
  return extractUrls(searchBlock)[0] || null;
};

const extractSection = (groupHtml, section) => {
  const regions = findRegionBlocks(groupHtml);
  const matchingRegion = regions.find((region) => section.labels.includes(region.label));
  const sourceLabel = matchingRegion?.label || section.labels.find((label) => groupHtml.includes(label)) || section.labels[0];
  const regionHtml = matchingRegion ? groupHtml.slice(matchingRegion.start, matchingRegion.end) : '';
  const overviewImage = findOverviewImage(groupHtml, sourceLabel);
  const regionImages = extractUrls(regionHtml);

  const images = unique([overviewImage, ...regionImages]).map((url, index) => ({
    id: `${section.key}-${index + 1}`,
    url,
    source: index === 0 && url === overviewImage ? 'overview-thumbnail' : 'section-gallery',
  }));

  return {
    key: section.key,
    title: section.title,
    sourceLabel,
    description: section.description,
    amenities: extractAmenities(regionHtml),
    images,
    notes: regionImages.length === 0 && overviewImage
      ? ['Airbnb HTML only contained the overview thumbnail for this area.']
      : [],
  };
};

const html = readFile(sourcePath);
const output = {
  generatedAt: new Date().toISOString(),
  sourceFile: sourcePath,
  schema: 'common-area-media-v1',
  groups: findGroupBlocks(html).map((group) => ({
    id: group.id,
    title: group.title,
    roomIds: group.roomIds,
    roomNumbers: group.roomNumbers,
    kitchenVariant: group.kitchenVariant,
    areas: Object.fromEntries(sections.map((section) => [
      section.key,
      extractSection(group.html, section),
    ])),
  })),
};

fs.writeFileSync(jsonOutputPath, `${JSON.stringify(output, null, 2)}\n`);
fs.writeFileSync(
  tsOutputPath,
  `export const commonAreaGroups = ${JSON.stringify(output.groups, null, 2)} as const;\n\nexport type CommonAreaGroup = typeof commonAreaGroups[number];\nexport type CommonAreaKey = keyof CommonAreaGroup['areas'];\n\nexport const getCommonAreaImages = (key: CommonAreaKey) => (\n  commonAreaGroups.flatMap((group) => group.areas[key].images.map((image) => image.url))\n);\n\nexport const getCommonAreaByGroup = (groupId: CommonAreaGroup['id'], key: CommonAreaKey) => (\n  commonAreaGroups.find((group) => group.id === groupId)?.areas[key]\n);\n`,
);

console.log(`Wrote ${jsonOutputPath}`);
console.log(`Wrote ${tsOutputPath}`);
