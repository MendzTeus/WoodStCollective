export interface Room {
  id: string;
  name: string;
  type: string;
  description: string;
  longDescription: string;
  image: string;
  features: { icon: string; title: string; desc: string }[];
  gallery: string[];
  details: string;
  airbnbUrl?: string;
}

export const rooms: Room[] = [
  {
    id: "classic-en-suite",
    name: "Classic En-Suite",
    type: "Room 1",
    description: "A sanctuary of sophisticated design in the heart of Manchester.",
    longDescription: "Designed for discerning professionals, the Classic En-Suite offers an impeccable blend of privacy and luxury. Every detail has been curated to provide a premium living experience, from the custom-designed workstation to the spa-inspired bathroom.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD7OczJILloz1EEHLDDHLHBQVGs-gL3MxVIDkUEq4jxWn3_eguqhKmpBPM06DSWa9YLQFWV8KpqdMei7Bn-Gh78simyIpH1UoxrePBEnAqUlP2FVj0jSyhsJZ3DS5ZP38hd9biUe-ak7W8OeBT90IsBQZai4z3QrVJmvK2taYfg5tTq81WjBxDa64Zp3_ivGCOaqCq7RSiPhKLB8oUl1H-gAFiqMDOw_U8ErUtpqOmgwMXP9ctNy1ZW1aT-Dj5RNXk2a5JdOj2D8nA",
    details: "King Bed",
    airbnbUrl: "https://www.airbnb.com/",
    features: [
      { icon: "Bed", title: "Premium Bedding", desc: "High-thread-count linens and a custom mattress." },
      { icon: "Bath", title: "En-Suite", desc: "Rainfall shower and boutique toiletries." }
    ],
    gallery: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB7p54s_4-rWeEuWQALBQEMtGabD8X-TcyDLlTpxds7yHgo6cye80_A7MWsM5EoD-mF2j5rbbgc_nc7DGE6d9j1m0XGxTo4LzyEgL8XOrSVoXhg2GxAVXmRZaXyiFAaFxEvy847_lINRtGtklG-XO_W0zv4PtdSLIImpEvQjuG6m-uzn3JPbf1ZJGSYY8MHuVnCQB3tsNw49gYpr4NIFt2GYbXL1mG3IOvq5TroGPXXQ1iZ6Xb_NIVcVcfo-09ryS02Zh_51rSwGeI",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAJdEdhEJY7W8Ad2iBmKSVTv2BaFNIfuF7_maz6EPs8_t5-NpyF5x9ceB5EfvwvLD_mhN5H9V0QvpcIIz21ZYVnEguNtSw9kFojk482h0iqIQg5zC6Tvwoyc3gSmPawXEt5JBO34fV1gq5zMl5P5r3eiKIQqpQh7mcj8c6F5M4W_X7k9vdqioZyoX_nLyNAFNt8wUyLhp-a-0fJRcMC2CVe6Zz_WbHYb9jxEHPAKOU4mxi_C-oPNHR955aJ8MfRMZ7VMQ7yec88tsk",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAKhtHh6GPAg5tNqkwNJ0hmVUnVT5mpYtbc0TfrXmFheF-vE4DDwUt-vGlVyLY7h7PIa8JkG9ozVCVMkyX4bmOs2xcxA9TuZH7nCu3Mtk2PZZ6ROlE-JGcbnsWHCo2lANLLE8CYt05BYLAUuhcvYCM4HLRb0zssZ4leP0Bvum9-2Kp4ivzF9IM0gXf15YTKcIDZ803xXEtwjjbgZTYLX3y2Bvc2y4cbIx2cd_7wn2U08KV35dJaoLIYtSJ7m3-ElVRmSdI2UT75yz4"
    ]
  },
  {
    id: "city-view-studio",
    name: "City View Studio",
    type: "Room 2",
    description: "Panoramic vistas meeting architectural precision.",
    longDescription: "Our City View Studio is designed for the high-altitude professional. Floor-to-ceiling windows bathe the room in natural light and offer inspiring views of the skyline morning and night.",
    image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=2070",
    details: "King Bed • Skyline",
    features: [
      { icon: "Bed", title: "Premium Bedding", desc: "High-thread-count linens and a custom mattress." },
      { icon: "Bath", title: "En-Suite", desc: "Rainfall shower and boutique toiletries." }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=2000",
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=2000",
      "https://images.unsplash.com/photo-1583847268964-b28dc2f51ac9?auto=format&fit=crop&q=80&w=2000"
    ]
  },
  {
    id: "penthouse-suite",
    name: "The Penthouse",
    type: "Room 3",
    description: "The pinnacle of Wood Street luxury living.",
    longDescription: "Spanning the entire corner of the top floor, The Penthouse features a separate lounge area, a library, and a private terrace overlooking the city's architectural landmarks.",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=2070",
    details: "Master Suite • Private Terrace",
    features: [
      { icon: "Bed", title: "Premium Bedding", desc: "High-thread-count linens and a custom mattress." },
      { icon: "Bath", title: "En-Suite", desc: "Rainfall shower and boutique toiletries." }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1616486341351-79b524021182?auto=format&fit=crop&q=80&w=2000",
      "https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&q=80&w=2000",
      "https://images.unsplash.com/photo-1617104551722-3b2d51366400?auto=format&fit=crop&q=80&w=2000"
    ]
  },
  {
    id: "loft-residency",
    name: "Loft Residency",
    type: "Room 4",
    description: "Industrial heritage meets contemporary minimalism.",
    longDescription: "High ceilings, exposed brickwork, and polished concrete floors provide an authentic industrial aesthetic, softened by premium wool textures and warm architectural lighting.",
    image: "https://images.unsplash.com/photo-1536376074432-bf121817b62a?auto=format&fit=crop&q=80&w=2070",
    details: "High Ceilings • Bi-level",
    features: [
      { icon: "Bed", title: "Premium Bedding", desc: "High-thread-count linens and a custom mattress." },
      { icon: "Bath", title: "En-Suite", desc: "Rainfall shower and boutique toiletries." }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1617806118233-f8e187f4289b?auto=format&fit=crop&q=80&w=2000",
      "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?auto=format&fit=crop&q=80&w=2000",
      "https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&q=80&w=2000"
    ]
  },
  {
    id: "master-suite",
    name: "Master Suite",
    type: "Room 5",
    description: "Unparalleled space and comfort for extended stays.",
    longDescription: "The Master Suite is our most popular choice for long-term residencies, offering a complete walk-in wardrobe, a master bathroom with a deep soaking tub, and a private foyer.",
    image: "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&q=80&w=2070",
    details: "Walk-in Wardrobe • Soaking Tub",
    features: [
      { icon: "Bed", title: "Premium Bedding", desc: "High-thread-count linens and a custom mattress." },
      { icon: "Bath", title: "En-Suite", desc: "Rainfall shower and boutique toiletries." }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1616594111350-bf9260cad495?auto=format&fit=crop&q=80&w=2000",
      "https://images.unsplash.com/photo-1616486701797-0f33f61038bc?auto=format&fit=crop&q=80&w=2000",
      "https://images.unsplash.com/photo-1616594111350-bf924446340a?auto=format&fit=crop&q=80&w=2000"
    ]
  },
  {
    id: "executive-studio",
    name: "Executive Studio",
    type: "Room 6",
    description: "Optimized for productivity and seamless transitions.",
    longDescription: "The Executive Studio features a professional-grade audio setup for calls and a modular layout that quickly transitions from a high-stakes office to a peaceful retreat.",
    image: "https://images.unsplash.com/photo-1598928636439-d9fe27af5809?auto=format&fit=crop&q=80&w=2070",
    details: "Smart Office • Soundproofed",
    features: [
      { icon: "Bed", title: "Premium Bedding", desc: "High-thread-count linens and a custom mattress." },
      { icon: "Bath", title: "En-Suite", desc: "Rainfall shower and boutique toiletries." }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1617104551722-3b2d51366400?auto=format&fit=crop&q=80&w=2000",
      "https://images.unsplash.com/photo-1617806118233-f8e187f4289b?auto=format&fit=crop&q=80&w=2000",
      "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?auto=format&fit=crop&q=80&w=2000"
    ]
  }
];
