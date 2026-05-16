import { rooms as initialRooms } from './rooms';
import { airbnbReviews } from './airbnbReviews';
import type { PageData, Review, Room, SiteSettings } from '../context/SiteContext';

export const defaultPages: Record<string, PageData> = {
  'Home': {
    id: 'home',
    title: 'The\nCollective\nSpirit.',
    description: 'Six private rooms, a rooftop workspace, and a shared kitchen - all in the heart of Manchester. Built for professionals, creatives, and teams who want more than just a bed.',
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNSlwUHEAhil8a_suo2jgS9N0oAFm8HOoUmYjzw_fvSWEgk7W0CCxIerUCtXpIdo3m10Z8Nhq8zbz_JPuhRobZrzP9Pu6h70u5gEKKT5h-fG0PHwZtk8IdJ70zfvz8qMqcNLacfXY6GYSgdLNCdt-xWNOj946Fk9ugOi0PSj0_3rCnnipubiOxHGErTTKiueVgZll2bk3TKjKTCartvpEwZKATdF11QHz9NDDg--FwiWszyJoMtT5OTalEAKYbr4MphTlN1xKI3-U'
  },
  'Spaces': {
    id: 'spaces',
    title: 'Rooms.',
    description: 'Six private rooms - from bunk setups to king en-suites. Every room includes access to the shared kitchen, roof terrace, and rooftop workspace.',
    coverImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000'
  },
  'Coworking': {
    id: 'coworking',
    title: 'Elevate\nYour Work.',
    description: 'The top-floor workspace at Wood Street Collective. Four hot desks with monitors, fast Wi-Fi, and a roof terrace - open to guests and day-pass members.',
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNSlwUHEAhil8a_suo2jgS9N0oAFm8HOoUmYjzw_fvSWEgk7W0CCxIerUCtXpIdo3m10Z8Nhq8zbz_JPuhRobZrzP9Pu6h70u5gEKKT5h-fG0PHwZtk8IdJ70zfvz8qMqcNLacfXY6GYSgdLNCdt-xWNOj946Fk9ugOi0PSj0_3rCnnipubiOxHGErTTKiueVgZll2bk3TKjKTCartvpEwZKATdF11QHz9NDDg--FwiWszyJoMtT5OTalEAKYbr4MphTlN1xKI3-U'
  },
  'About': {
    id: 'about',
    title: 'Elevating the\nManchester Experience.',
    description: 'A sanctuary for professionals and creatives in the heart of the city.',
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAM0tRKGJ76qkiUGHXCLhtOnzmG6pkFc-Xf7Pe24pJKlu5Z1ZMVfYTMJXimrwSkQkZ1UoGlc4EC93vwg9_L-XQQVzdvDGSdQyBhEuYT9Rn6FFfw5800gCuH6xWbKbupuPn41B_6TIlqjE1j5l4JyLevX4im7W9Jis0eijNX5cf79YxLMwHRWikczg3vUoNyXbsYPQOqJg6Se5VkreKUmf7HRxQZnt8yhhjHHr73YwPtArTPLxPydlWxCwXDP2xpenK28re12r3WS60'
  },
  'Amenities': {
    id: 'amenities',
    title: 'Everything You Need.\nNothing You Don\'t.',
    description: 'Every detail at Wood Street Collective has been considered for professionals who value their time and comfort.',
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCb_QluUVG-tfSLvjtb8UCBD0SlNDQyyPcsr-3HMoeZoPeh9b0EBJAHyMvEXjFlNZPz0_kpM5s_eGsQhvau0vYheIypNoynPE7TT76E3sVWGgIh3iXIMcvnH_kIBwDLpoAdiswTadDxrGPcZvTSS-Ci8ylCniewfsc-iP5aGmOU1FLosRGPeH24ooKU_z8NT5_V3jD1zoQ1MKoJaEDw7Md1SwNdBEdZzrrRfV6rdk4VnS5TvtrDB-6uZ0jP55yZxTrI2Zyu5kIkcFU'
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
