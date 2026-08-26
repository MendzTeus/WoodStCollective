export interface Room {
  id: string;
  name: string;
  type: string;
  description: string;
  longDescription: string;
  guestAccess: string;
  image: string;
  features: { icon: string; title: string; desc: string }[];
  gallery: string[];
  details: string;
  capacity: number;
  rating: number;
  reviewsCount: number;
  airbnbUrl?: string;
  enquiryEmail?: string;
  whatsappUrl?: string;
}

const sharedFeatures = [
  { icon: "Bath", title: "Private Room", desc: "A generous private room with bathroom access as listed." },
  { icon: "ChefHat", title: "Shared Kitchen", desc: "Second-floor kitchen and dining area with appliances and utensils." },
  { icon: "Monitor", title: "Workspace Included", desc: "Top-floor hot desks with monitors and fast Wi-Fi." },
  { icon: "Sunset", title: "Roof Terrace", desc: "Outdoor seating above the city for breaks, calls, or fresh-air work." },
];

export const rooms: Room[] = [
  {
    id: "classic-en-suite",
    name: "The Collective 1",
    type: "Room 1",
    description: "1BR retreat with a private en-suite in the heart of Manchester.",
    longDescription: "The Wood Street Collective: stay, work, connect.\n\nThe Wood Street Collective is more than a place to stay; it’s a fully integrated community living and working space designed for modern professionals.\n\nStay in one of our six thoughtfully designed private rooms and enjoy full access to shared kitchen and dining areas, alongside a dedicated, high-quality workspace with desks and fast, reliable high-speed Wi-Fi. All included.\n\nNeed space to collaborate?\nOur communal dining area easily doubles as a meeting space for up to six colleagues, perfect for team sessions, planning days, or informal meetings. Without the cost or hassle of booking external venues.\n\nNow imagine the savings: no GBP 46-per-person day passes, no costly meeting room hire for just a few hours, no juggling multiple bookings across different locations.\n\nAt The Wood Street Collective, it’s all under one roof.\n\nAnd unlike traditional accommodation, we go one step further. While check-out is at 10 am, guests are welcome to continue using the workspace until 5 pm, giving you a full, productive day.\n\nWhether you’re travelling for work, hosting a small team meet-up, or simply want a smarter way to live and work, The Wood Street Collective offers flexibility, community, and exceptional value.\n\nStay over. Plug in. Work better.",
    guestAccess: "Your room is a generous private space with an en-suite bathroom. Beyond that, you’ll have full access to our well-equipped shared kitchen on the second floor and our rooftop office featuring four hot desks and monitors. The rooftop terrace also offers comfortable seating and a dining area for you to relax or work outdoors.",
    image: "https://qjcfybgdadvtpbllxlbb.supabase.co/storage/v1/object/public/site-images/airbnb-import/f64496283f98.jpeg",
    details: "1BR · Private En-Suite · 1 guest",
    capacity: 1,
    rating: 4.91,
    reviewsCount: 11,
    airbnbUrl: "https://airbnb.com/h/20-1-wsc",
    gallery: [
      "https://qjcfybgdadvtpbllxlbb.supabase.co/storage/v1/object/public/site-images/airbnb-import/f64496283f98.jpeg",
      "https://qjcfybgdadvtpbllxlbb.supabase.co/storage/v1/object/public/site-images/airbnb-import/873a3b720aad.jpeg",
      "https://qjcfybgdadvtpbllxlbb.supabase.co/storage/v1/object/public/site-images/airbnb-import/fb1ca8d57136.jpeg",
      "https://qjcfybgdadvtpbllxlbb.supabase.co/storage/v1/object/public/site-images/airbnb-import/a875539a2d91.jpeg",
      "https://qjcfybgdadvtpbllxlbb.supabase.co/storage/v1/object/public/site-images/airbnb-import/85115f698ef0.jpeg",
      "https://qjcfybgdadvtpbllxlbb.supabase.co/storage/v1/object/public/site-images/airbnb-import/1b99d57ba9fd.jpeg",
      "https://qjcfybgdadvtpbllxlbb.supabase.co/storage/v1/object/public/site-images/airbnb-import/6928b4b4f66a.jpeg",
      "https://qjcfybgdadvtpbllxlbb.supabase.co/storage/v1/object/public/site-images/airbnb-import/f133667edc4a.jpeg"
    ],
    features: sharedFeatures,
  },
  {
    id: "city-view-studio",
    name: "The Collective 2",
    type: "Room 2",
    description: "Bunk 1BR with separate shower, ideal for up to four guests.",
    longDescription: "The Wood Street Collective: stay, work, connect.\n\nThe Wood Street Collective is more than a place to stay; it’s a fully integrated community living and working space designed for modern professionals.\n\nStay in one of our six thoughtfully designed private rooms and enjoy full access to shared kitchen and dining areas, alongside a dedicated, high-quality workspace with desks and fast, reliable high-speed Wi-Fi. All included.\n\nNeed space to collaborate?\nOur communal dining area easily doubles as a meeting space for up to six colleagues, perfect for team sessions, planning days, or informal meetings. Without the cost or hassle of booking external venues.\n\nNow imagine the savings: no GBP 46-per-person day passes, no costly meeting room hire for just a few hours, no juggling multiple bookings across different locations.\n\nAt The Wood Street Collective, it’s all under one roof.\n\nAnd unlike traditional accommodation, we go one step further. While check-out is at 10 am, guests are welcome to continue using the workspace until 5 pm, giving you a full, productive day.\n\nWhether you’re travelling for work, hosting a small team meet-up, or simply want a smarter way to live and work, The Wood Street Collective offers flexibility, community, and exceptional value.\n\nStay over. Plug in. Work better.",
    guestAccess: "Your room is a generous private space with an en-suite bathroom. Beyond that, you’ll have full access to our well-equipped shared kitchen on the second floor and our rooftop office featuring four hot desks and monitors. The rooftop terrace also offers comfortable seating and a dining area for you to relax or work outdoors.",
    image: "https://qjcfybgdadvtpbllxlbb.supabase.co/storage/v1/object/public/site-images/airbnb-import/42c0465d533e.jpeg",
    details: "Bunk 1BR · Separate Shower · Up to 4 guests",
    capacity: 4,
    rating: 4.92,
    reviewsCount: 13,
    airbnbUrl: "https://airbnb.com/h/20-2-wsc",
    gallery: [
      "https://qjcfybgdadvtpbllxlbb.supabase.co/storage/v1/object/public/site-images/airbnb-import/42c0465d533e.jpeg",
      "https://qjcfybgdadvtpbllxlbb.supabase.co/storage/v1/object/public/site-images/airbnb-import/0ad1d87f3d15.jpeg",
      "https://qjcfybgdadvtpbllxlbb.supabase.co/storage/v1/object/public/site-images/airbnb-import/885c0dadfe8e.jpeg",
      "https://qjcfybgdadvtpbllxlbb.supabase.co/storage/v1/object/public/site-images/airbnb-import/411fa25478f9.jpeg",
      "https://qjcfybgdadvtpbllxlbb.supabase.co/storage/v1/object/public/site-images/airbnb-import/1d8550dbc2f9.jpeg",
      "https://qjcfybgdadvtpbllxlbb.supabase.co/storage/v1/object/public/site-images/airbnb-import/0bb00bf2b2f7.jpeg",
      "https://qjcfybgdadvtpbllxlbb.supabase.co/storage/v1/object/public/site-images/airbnb-import/f188ee3f2302.jpeg",
      "https://qjcfybgdadvtpbllxlbb.supabase.co/storage/v1/object/public/site-images/airbnb-import/f5582a7136c3.jpeg"
    ],
    features: sharedFeatures,
  },
  {
    id: "penthouse-suite",
    name: "The Collective 3",
    type: "Room 3",
    description: "King 1BR with private en-suite and full workspace access.",
    longDescription: "The Wood Street Collective: stay, work, connect.\n\nThe Wood Street Collective is more than a place to stay; it’s a fully integrated community living and working space designed for modern professionals.\n\nStay in one of our six thoughtfully designed private rooms and enjoy full access to shared kitchen and dining areas, alongside a dedicated, high-quality workspace with desks and fast, reliable high-speed Wi-Fi. All included.\n\nNeed space to collaborate?\nOur communal dining area easily doubles as a meeting space for up to six colleagues, perfect for team sessions, planning days, or informal meetings. Without the cost or hassle of booking external venues.\n\nNow imagine the savings: no GBP 46-per-person day passes, no costly meeting room hire for just a few hours, no juggling multiple bookings across different locations.\n\nAt The Wood Street Collective, it’s all under one roof.\n\nAnd unlike traditional accommodation, we go one step further. While check-out is at 10 am, guests are welcome to continue using the workspace until 5 pm, giving you a full, productive day.\n\nWhether you’re travelling for work, hosting a small team meet-up, or simply want a smarter way to live and work, The Wood Street Collective offers flexibility, community, and exceptional value.\n\nStay over. Plug in. Work better.",
    guestAccess: "Your room is a generous private space with an en-suite bathroom. Beyond that, you’ll have full access to our well-equipped shared kitchen on the second floor and our rooftop office featuring four hot desks and monitors. The rooftop terrace also offers comfortable seating and a dining area for you to relax or work outdoors.",
    image: "https://qjcfybgdadvtpbllxlbb.supabase.co/storage/v1/object/public/site-images/airbnb-import/371d077307fc.jpeg",
    details: "1BR King · Private En-Suite · 1 guest",
    capacity: 1,
    rating: 4.89,
    reviewsCount: 9,
    airbnbUrl: "https://airbnb.com/h/20-3-wsc",
    gallery: [
      "https://qjcfybgdadvtpbllxlbb.supabase.co/storage/v1/object/public/site-images/airbnb-import/371d077307fc.jpeg",
      "https://qjcfybgdadvtpbllxlbb.supabase.co/storage/v1/object/public/site-images/airbnb-import/0b7a9372119c.jpeg",
      "https://qjcfybgdadvtpbllxlbb.supabase.co/storage/v1/object/public/site-images/airbnb-import/29c2fa3e93f7.jpeg",
      "https://qjcfybgdadvtpbllxlbb.supabase.co/storage/v1/object/public/site-images/airbnb-import/2ba3c9328dbf.jpeg",
      "https://qjcfybgdadvtpbllxlbb.supabase.co/storage/v1/object/public/site-images/airbnb-import/2fc8d05ed43f.jpeg"
    ],
    features: sharedFeatures,
  },
  {
    id: "loft-residency",
    name: "The Collective 4",
    type: "Room 4",
    description: "Large 1BR with separate shower and shared amenity access.",
    longDescription: "The Wood Street Collective: stay, work, connect.\n\nThe Wood Street Collective is more than a place to stay; it’s a fully integrated community living and working space designed for modern professionals.\n\nStay in one of our six thoughtfully designed private rooms and enjoy full access to shared kitchen and dining areas, alongside a dedicated, high-quality workspace with desks and fast, reliable high-speed Wi-Fi. All included.\n\nNeed space to collaborate?\nOur communal dining area easily doubles as a meeting space for up to six colleagues, perfect for team sessions, planning days, or informal meetings. Without the cost or hassle of booking external venues.\n\nNow imagine the savings: no GBP 46-per-person day passes, no costly meeting room hire for just a few hours, no juggling multiple bookings across different locations.\n\nAt The Wood Street Collective, it’s all under one roof.\n\nAnd unlike traditional accommodation, we go one step further. While check-out is at 10 am, guests are welcome to continue using the workspace until 5 pm, giving you a full, productive day.\n\nWhether you’re travelling for work, hosting a small team meet-up, or simply want a smarter way to live and work, The Wood Street Collective offers flexibility, community, and exceptional value.\n\nStay over. Plug in. Work better.",
    guestAccess: "Your room is a generous private space with an en-suite bathroom. Beyond that, you’ll have full access to our well-equipped shared kitchen on the second floor and our rooftop office featuring four hot desks and monitors. The rooftop terrace also offers comfortable seating and a dining area for you to relax or work outdoors.",
    image: "https://qjcfybgdadvtpbllxlbb.supabase.co/storage/v1/object/public/site-images/airbnb-import/058ce984d3e8.jpeg",
    details: "Large 1BR · Separate Shower · 1 guest",
    capacity: 1,
    rating: 4.89,
    reviewsCount: 9,
    airbnbUrl: "https://airbnb.com/h/22-4-wsc",
    gallery: [
      "https://qjcfybgdadvtpbllxlbb.supabase.co/storage/v1/object/public/site-images/airbnb-import/058ce984d3e8.jpeg",
      "https://qjcfybgdadvtpbllxlbb.supabase.co/storage/v1/object/public/site-images/airbnb-import/c95d7f5e587f.jpeg",
      "https://qjcfybgdadvtpbllxlbb.supabase.co/storage/v1/object/public/site-images/airbnb-import/438563ea9360.jpeg",
      "https://qjcfybgdadvtpbllxlbb.supabase.co/storage/v1/object/public/site-images/airbnb-import/06471c0cdb15.jpeg",
      "https://qjcfybgdadvtpbllxlbb.supabase.co/storage/v1/object/public/site-images/airbnb-import/4a131aeb714b.jpeg"
    ],
    features: sharedFeatures,
  },
  {
    id: "master-suite",
    name: "The Collective 5",
    type: "Room 5",
    description: "King 1BR with private en-suite and access to the full house.",
    longDescription: "The Wood Street Collective: stay, work, connect.\n\nThe Wood Street Collective is more than a place to stay; it’s a fully integrated community living and working space designed for modern professionals.\n\nStay in one of our six thoughtfully designed private rooms and enjoy full access to shared kitchen and dining areas, alongside a dedicated, high-quality workspace with desks and fast, reliable high-speed Wi-Fi. All included.\n\nNeed space to collaborate?\nOur communal dining area easily doubles as a meeting space for up to six colleagues, perfect for team sessions, planning days, or informal meetings. Without the cost or hassle of booking external venues.\n\nNow imagine the savings: no GBP 46-per-person day passes, no costly meeting room hire for just a few hours, no juggling multiple bookings across different locations.\n\nAt The Wood Street Collective, it’s all under one roof.\n\nAnd unlike traditional accommodation, we go one step further. While check-out is at 10 am, guests are welcome to continue using the workspace until 5 pm, giving you a full, productive day.\n\nWhether you’re travelling for work, hosting a small team meet-up, or simply want a smarter way to live and work, The Wood Street Collective offers flexibility, community, and exceptional value.\n\nStay over. Plug in. Work better.",
    guestAccess: "Your room is a generous private space with an en-suite bathroom. Beyond that, you’ll have full access to our well-equipped shared kitchen on the second floor and our rooftop office featuring four hot desks and monitors. The rooftop terrace also offers comfortable seating and a dining area for you to relax or work outdoors.",
    image: "https://qjcfybgdadvtpbllxlbb.supabase.co/storage/v1/object/public/site-images/airbnb-import/5249c7c019a2.jpeg",
    details: "King 1BR · Private En-Suite · 1 guest",
    capacity: 1,
    rating: 4.86,
    reviewsCount: 7,
    airbnbUrl: "https://airbnb.com/h/22-5-wsc",
    gallery: [
      "https://qjcfybgdadvtpbllxlbb.supabase.co/storage/v1/object/public/site-images/airbnb-import/5249c7c019a2.jpeg",
      "https://qjcfybgdadvtpbllxlbb.supabase.co/storage/v1/object/public/site-images/airbnb-import/483181e181a4.jpeg",
      "https://qjcfybgdadvtpbllxlbb.supabase.co/storage/v1/object/public/site-images/airbnb-import/39444ba06a73.jpeg",
      "https://qjcfybgdadvtpbllxlbb.supabase.co/storage/v1/object/public/site-images/airbnb-import/7756c47a70a4.jpeg",
      "https://qjcfybgdadvtpbllxlbb.supabase.co/storage/v1/object/public/site-images/airbnb-import/259517c79c85.jpeg",
      "https://qjcfybgdadvtpbllxlbb.supabase.co/storage/v1/object/public/site-images/airbnb-import/116f46853d40.jpeg",
      "https://qjcfybgdadvtpbllxlbb.supabase.co/storage/v1/object/public/site-images/airbnb-import/b30a5f6902ff.jpeg",
      "https://qjcfybgdadvtpbllxlbb.supabase.co/storage/v1/object/public/site-images/airbnb-import/111b48ae5eec.jpeg"
    ],
    features: sharedFeatures,
  },
  {
    id: "executive-studio",
    name: "The Collective 6",
    type: "Room 6",
    description: "King 1BR en-suite with rooftop workspace access included.",
    longDescription: "The Wood Street Collective: stay, work, connect.\n\nThe Wood Street Collective is more than a place to stay; it’s a fully integrated community living and working space designed for modern professionals.\n\nStay in one of our six thoughtfully designed private rooms and enjoy full access to shared kitchen and dining areas, alongside a dedicated, high-quality workspace with desks and fast, reliable high-speed Wi-Fi. All included.\n\nNeed space to collaborate?\nOur communal dining area easily doubles as a meeting space for up to six colleagues, perfect for team sessions, planning days, or informal meetings. Without the cost or hassle of booking external venues.\n\nNow imagine the savings: no GBP 46-per-person day passes, no costly meeting room hire for just a few hours, no juggling multiple bookings across different locations.\n\nAt The Wood Street Collective, it’s all under one roof.\n\nAnd unlike traditional accommodation, we go one step further. While check-out is at 10 am, guests are welcome to continue using the workspace until 5 pm, giving you a full, productive day.\n\nWhether you’re travelling for work, hosting a small team meet-up, or simply want a smarter way to live and work, The Wood Street Collective offers flexibility, community, and exceptional value.\n\nStay over. Plug in. Work better.",
    guestAccess: "Your room is a generous private space with an en-suite bathroom. Beyond that, you’ll have full access to our well-equipped shared kitchen on the second floor and our rooftop office featuring four hot desks and monitors. The rooftop terrace also offers comfortable seating and a dining area for you to relax or work outdoors.",
    image: "https://qjcfybgdadvtpbllxlbb.supabase.co/storage/v1/object/public/site-images/airbnb-import/53414df4f47a.jpeg",
    details: "King 1BR · En-Suite · 1 guest",
    capacity: 1,
    rating: 5,
    reviewsCount: 11,
    airbnbUrl: "https://airbnb.com/h/22-6-wsc",
    gallery: [
      "https://qjcfybgdadvtpbllxlbb.supabase.co/storage/v1/object/public/site-images/airbnb-import/53414df4f47a.jpeg",
      "https://qjcfybgdadvtpbllxlbb.supabase.co/storage/v1/object/public/site-images/airbnb-import/5ce250c05263.jpeg"
    ],
    features: sharedFeatures,
  }
];
