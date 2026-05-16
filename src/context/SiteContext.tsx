import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { defaultPages, defaultReviews, defaultRooms, defaultSettings } from '../data/siteDefaults';
import { loadSiteContent, saveSiteContent } from '../lib/siteContent';

export type PageData = {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  featureImage?: string;
}

export interface Room {
  id: string;
  name: string;
  type: string;
  description: string;
  longDescription: string;
  guestAccess?: string;
  image: string;
  features: { icon?: string; title: string; desc: string }[];
  gallery: string[];
  details: string;
  capacity?: number;
  rating?: number;
  reviewsCount?: number;
  airbnbUrl?: string;
  enquiryEmail?: string;
  whatsappUrl?: string;
}

export interface Review {
  id: string;
  roomId?: string;
  reviewerName: string;
  reviewerAvatar?: string;
  reviewerProfileUrl?: string;
  reviewerRole: string;
  rating: number;
  comment: string;
  approved: boolean;
  showOnHome?: boolean;
}

export type SiteData = {
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

type SiteContextType = {
  data: SiteData;
  isLoading: boolean;
  loadError: string | null;
  updatePage: (pageName: string, updates: Partial<PageData>) => void;
  updateRoom: (roomId: string, updates: Partial<Room>) => void;
  addRoom: (room: Room) => void;
  deleteRoom: (roomId: string) => void;
  updateReview: (reviewId: string, updates: Partial<Review>) => void;
  updateSettings: (updates: Partial<SiteSettings>) => void;
  addReview: (review: Review) => void;
  deleteReview: (reviewId: string) => void;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

const mergePages = (sourcePages?: Partial<SiteData>['pages']) => {
  const pages = { ...defaultPages };

  Object.entries(sourcePages || {}).forEach(([key, page]) => {
    pages[key] = {
      ...(defaultPages[key] || {}),
      ...page
    } as PageData;
  });

  return pages;
};

const mergeReviews = (sourceReviews?: Partial<SiteData>['reviews']) => {
  const reviews = { ...defaultReviews };

  Object.entries(sourceReviews || {}).forEach(([key, review]) => {
    reviews[key] = {
      ...(defaultReviews[key] || {}),
      ...review
    } as Review;
  });

  return reviews;
};

const mergeSiteData = (source?: Partial<SiteData> | null): SiteData => ({
  pages: mergePages(source?.pages),
  rooms: {
    ...defaultRooms,
    ...(source?.rooms || {})
  },
  reviews: mergeReviews(source?.reviews),
  settings: {
    ...defaultSettings,
    ...(source?.settings || {})
  }
});

const hasRemoteContent = (source?: Partial<SiteData> | null) => {
  if (!source) return false;
  return Boolean(source.pages || source.rooms || source.reviews || source.settings);
};

const loadLocalSiteData = () => {
  const saved = localStorage.getItem('siteData');
  if (!saved) return null;

  try {
    return mergeSiteData(JSON.parse(saved));
  } catch (e) {
    console.error('Failed to parse site data from local storage');
    return null;
  }
};

export function SiteProvider({ children }: { children: ReactNode }) {
  const localDataRef = useRef<SiteData | null>(loadLocalSiteData());
  const [data, setData] = useState<SiteData>(() => localDataRef.current || mergeSiteData());
  const [isRemoteLoaded, setIsRemoteLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    let cancelled = false;

    loadSiteContent()
      .then((remoteData) => {
        if (cancelled) return;

        if (hasRemoteContent(remoteData)) {
          const merged = mergeSiteData(remoteData);
          setData(merged);
          localStorage.setItem('siteData', JSON.stringify(merged));
        } else if (localDataRef.current) {
          setIsDirty(true);
        }

        setLoadError(null);
        setIsRemoteLoaded(true);
      })
      .catch((error) => {
        console.error('Failed to load site content from Supabase', error);
        setLoadError('Live content could not be loaded. Showing locally cached content.');
        setIsRemoteLoaded(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('siteData', JSON.stringify(data));

    if (!isRemoteLoaded || !isDirty) return;

    const timeout = window.setTimeout(() => {
      saveSiteContent(data).catch((error) => {
        console.error('Failed to save site content to Supabase', error);
      }).finally(() => setIsDirty(false));
    }, 500);

    return () => window.clearTimeout(timeout);
  }, [data, isRemoteLoaded, isDirty]);

  const updatePage = (pageName: string, updates: Partial<PageData>) => {
    setIsDirty(true);
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
    setIsDirty(true);
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

  const addRoom = (room: Room) => {
    setIsDirty(true);
    setData(prev => ({
      ...prev,
      rooms: {
        ...prev.rooms,
        [room.id]: room
      }
    }));
  };

  const deleteRoom = (roomId: string) => {
    setIsDirty(true);
    setData(prev => {
      const rooms = { ...prev.rooms };
      delete rooms[roomId];
      return {
        ...prev,
        rooms
      };
    });
  };

  const updateReview = (reviewId: string, updates: Partial<Review>) => {
    setIsDirty(true);
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
    setIsDirty(true);
    setData(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        ...updates
      }
    }));
  };

  const addReview = (review: Review) => {
    setIsDirty(true);
    setData(prev => ({
      ...prev,
      reviews: {
        ...prev.reviews,
        [review.id]: review
      }
    }));
  };

  const deleteReview = (reviewId: string) => {
    setIsDirty(true);
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
    <SiteContext.Provider value={{ data, isLoading: !isRemoteLoaded, loadError, updatePage, updateRoom, addRoom, deleteRoom, updateReview, updateSettings, addReview, deleteReview }}>
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
