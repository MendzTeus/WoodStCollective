import { rooms as initialRooms } from './rooms';
import { airbnbReviews } from './airbnbReviews';
import type { PageData, Review, Room, SiteSettings } from '../context/SiteContext';

export const defaultPages: Record<string, PageData> = {
  'Home': {
    id: 'home',
    title: 'The\nCollective\nSpirit.',
    description: 'Six private rooms, a rooftop workspace, and a shared kitchen. All in the heart of Manchester.',
    coverImage: '',
    featureImage: ''
  },
  'Spaces': {
    id: 'spaces',
    title: 'Rooms.',
    description: 'Six private rooms - from bunk setups to king en-suites. Every room includes access to the shared kitchen, roof terrace, and rooftop workspace.',
    coverImage: ''
  },
  'Coworking': {
    id: 'coworking',
    title: 'Elevate\nYour Work.',
    description: 'The top-floor workspace at Wood Street Collective. Four hot desks with monitors, fast Wi-Fi, and a roof terrace - open to guests and day-pass members.',
    coverImage: ''
  },
  'About': {
    id: 'about',
    title: 'Elevating the\nManchester Experience.',
    description: 'A sanctuary for professionals and creatives in the heart of the city.',
    coverImage: '',
    featureImage: ''
  },
  'Amenities': {
    id: 'amenities',
    title: 'Everything You Need.\nNothing You Don\'t.',
    description: 'Every detail at Wood Street Collective has been considered for professionals who value their time and comfort.',
    coverImage: ''
  }
};

export const defaultRooms: Record<string, Room> = initialRooms.reduce((acc, room) => {
  acc[room.id] = { ...room, features: room.features.map(f => ({ icon: f.icon, title: f.title, desc: f.desc })) };
  return acc;
}, {} as Record<string, Room>);

export const defaultReviews: Record<string, Review> = airbnbReviews;

export const defaultSettings: SiteSettings = {
  instagramUrl: '',
  email: '',
  whatsappUrl: '',
  airbnbUrl: ''
};
