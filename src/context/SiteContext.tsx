import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { rooms as initialRooms } from '../data/rooms';

export type PageData = {
  id: string;
  title: string;
  description: string;
  coverImage: string;
}

export interface Room {
  id: string;
  name: string;
  type: string;
  description: string;
  longDescription: string;
  image: string;
  features: { title: string; desc: string }[];
  gallery: string[];
  details: string;
  airbnbUrl?: string;
  enquiryEmail?: string;
  whatsappUrl?: string;
}

export interface Review {
  id: string;
  reviewerName: string;
  reviewerRole: string;
  rating: number;
  comment: string;
  approved: boolean;
}

type SiteData = {
  pages: Record<string, PageData>;
  rooms: Record<string, Room>;
  reviews: Record<string, Review>;
  settings: SiteSettings;
}

export type SiteSettings = {
  instagramUrl: string;
  email: string;
  whatsappUrl: string;
  airbnbUrl: string;
}

const defaultPages: Record<string, PageData> = {
  'Home': {
    id: 'home',
    title: 'The\nCollective\nSpirit.',
    description: 'A curated sanctuary for deep work and creative expansion. Designed for those who seek architectural clarity and professional excellence in the heart of the city.',
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNSlwUHEAhil8a_suo2jgS9N0oAFm8HOoUmYjzw_fvSWEgk7W0CCxIerUCtXpIdo3m10Z8Nhq8zbz_JPuhRobZrzP9Pu6h70u5gEKKT5h-fG0PHwZtk8IdJ70zfvz8qMqcNLacfXY6GYSgdLNCdt-xWNOj946Fk9ugOi0PSj0_3rCnnipubiOxHGErTTKiueVgZll2bk3TKjKTCartvpEwZKATdF11QHz9NDDg--FwiWszyJoMtT5OTalEAKYbr4MphTlN1xKI3-U'
  },
  'Spaces': {
    id: 'spaces',
    title: 'Rooms &\nSuites.',
    description: 'Discover our curated selection of private living environments. From minimalist en-suites to expansive signature penthouses, each space is a sanctuary of architectural clarity.',
    coverImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000'
  },
  'Coworking': {
    id: 'coworking',
    title: 'Elevate\nYour Work.',
    description: 'The top-floor workspace at Wood Street Collective. A sanctuary for deep work and creative collaboration, designed for professionals who demand excellence.',
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

const defaultRooms: Record<string, Room> = initialRooms.reduce((acc, room) => {
  acc[room.id] = { ...room, features: room.features.map(f => ({ title: f.title, desc: f.desc })) };
  return acc;
}, {} as Record<string, Room>);

const defaultReviews: Record<string, Review> = {
  '1': {
    id: '1',
    reviewerName: 'Sarah Jenkins',
    reviewerRole: 'Guest (Heritage Suite)',
    rating: 5,
    comment: 'Absolutely breathtaking design and service. The attention to detail in the room was flawless.',
    approved: true
  },
  '2': {
    id: '2',
    reviewerName: 'Michael Chen',
    reviewerRole: 'Co-living Resident',
    rating: 5,
    comment: 'The coliving experience here completely changed my approach to deep work. The community is fantastic and the architecture is inspiring.',
    approved: true
  },
  '3': {
    id: '3',
    reviewerName: 'Emma Richardson',
    reviewerRole: 'Guest (Loft Apartment)',
    rating: 4,
    comment: 'A beautiful sanctuary in the city. The amenities are top-notch and the coworking space is incredibly productive.',
    approved: true
  }
};

const defaultSettings: SiteSettings = {
  instagramUrl: '',
  email: '',
  whatsappUrl: '',
  airbnbUrl: ''
};

type SiteContextType = {
  data: SiteData;
  updatePage: (pageName: string, updates: Partial<PageData>) => void;
  updateRoom: (roomId: string, updates: Partial<Room>) => void;
  updateReview: (reviewId: string, updates: Partial<Review>) => void;
  updateSettings: (updates: Partial<SiteSettings>) => void;
  addReview: (review: Review) => void;
  deleteReview: (reviewId: string) => void;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export function SiteProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SiteData>(() => {
    const saved = localStorage.getItem('siteData');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          pages: {
            ...defaultPages,
            ...(parsed.pages || {})
          },
          rooms: {
            ...defaultRooms,
            ...(parsed.rooms || {})
          },
          reviews: {
            ...defaultReviews,
            ...(parsed.reviews || {})
          },
          settings: {
            ...defaultSettings,
            ...(parsed.settings || {})
          }
        };
      } catch (e) {
        console.error('Failed to parse site data from local storage');
      }
    }
    return { pages: defaultPages, rooms: defaultRooms, reviews: defaultReviews, settings: defaultSettings };
  });

  useEffect(() => {
    localStorage.setItem('siteData', JSON.stringify(data));
  }, [data]);

  const updatePage = (pageName: string, updates: Partial<PageData>) => {
    setData(prev => ({
      ...prev,
      pages: {
        ...prev.pages,
        [pageName]: {
          ...prev.pages[pageName],
          ...updates
        }
      }
    }));
  };

  const updateRoom = (roomId: string, updates: Partial<Room>) => {
    setData(prev => ({
      ...prev,
      rooms: {
        ...prev.rooms,
        [roomId]: {
          ...prev.rooms[roomId],
          ...updates
        }
      }
    }));
  };

  const updateReview = (reviewId: string, updates: Partial<Review>) => {
    setData(prev => ({
      ...prev,
      reviews: {
        ...prev.reviews,
        [reviewId]: {
          ...prev.reviews[reviewId],
          ...updates
        }
      }
    }));
  };

  const updateSettings = (updates: Partial<SiteSettings>) => {
    setData(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        ...updates
      }
    }));
  };

  const addReview = (review: Review) => {
    setData(prev => ({
      ...prev,
      reviews: {
        ...prev.reviews,
        [review.id]: review
      }
    }));
  };

  const deleteReview = (reviewId: string) => {
    setData(prev => {
      const newReviews = { ...prev.reviews };
      delete newReviews[reviewId];
      return {
        ...prev,
        reviews: newReviews
      };
    });
  };

  return (
    <SiteContext.Provider value={{ data, updatePage, updateRoom, updateReview, updateSettings, addReview, deleteReview }}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSiteData() {
  const context = useContext(SiteContext);
  if (context === undefined) {
    throw new Error('useSiteData must be used within a SiteProvider');
  }
  return context;
}
