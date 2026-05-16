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
    image: "https://a0.muscache.com/im/pictures/hosting/Hosting-1523978018503532881/original/e3ec6ec5-3bd9-4042-ba56-69b73dc47feb.jpeg",
    details: "1BR · Private En-Suite · 1 guest",
    capacity: 1,
    rating: 4.91,
    reviewsCount: 11,
    airbnbUrl: "https://airbnb.com/h/20-1-wsc",
    gallery: [
      "https://a0.muscache.com/im/pictures/hosting/Hosting-1523978018503532881/original/e3ec6ec5-3bd9-4042-ba56-69b73dc47feb.jpeg",
      "https://a0.muscache.com/im/pictures/hosting/Hosting-1523978018503532881/original/22f8ca21-5865-468f-99f6-a473422fb00d.jpeg",
      "https://a0.muscache.com/im/pictures/hosting/Hosting-1523978018503532881/original/b6abf834-8ee4-4b5d-8103-a43af76942d4.jpeg",
      "https://a0.muscache.com/im/pictures/hosting/Hosting-1523978018503532881/original/260eefbe-6532-435d-85f8-19594a489937.jpeg",
      "https://a0.muscache.com/im/pictures/hosting/Hosting-1523978018503532881/original/59b328aa-b8c0-489e-aae6-6eaf80679d88.jpeg",
      "https://a0.muscache.com/im/pictures/hosting/Hosting-1523978018503532881/original/1845acdf-2afe-406d-a566-693cb23e0295.jpeg",
      "https://a0.muscache.com/im/pictures/hosting/Hosting-1523978018503532881/original/7cd32b3f-2082-43e2-88a4-53318320d9f5.jpeg",
      "https://a0.muscache.com/im/pictures/hosting/Hosting-1523978018503532881/original/9cd23876-e55d-4183-b7c5-25033dd6b5be.jpeg"
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
    image: "https://a0.muscache.com/im/pictures/hosting/Hosting-1523922798240522995/original/ad5cbca6-96f3-4052-891d-7ff68ca2d96f.jpeg",
    details: "Bunk 1BR · Separate Shower · Up to 4 guests",
    capacity: 4,
    rating: 4.92,
    reviewsCount: 13,
    airbnbUrl: "https://airbnb.com/h/20-2-wsc",
    gallery: [
      "https://a0.muscache.com/im/pictures/hosting/Hosting-1523922798240522995/original/ad5cbca6-96f3-4052-891d-7ff68ca2d96f.jpeg",
      "https://a0.muscache.com/im/pictures/hosting/Hosting-1523922798240522995/original/afd305c0-3267-4a27-aeaa-985ce3b04f51.jpeg",
      "https://a0.muscache.com/im/pictures/hosting/Hosting-1523922798240522995/original/bcc86dbd-1c35-4382-a21f-9c4cbc1716f0.jpeg",
      "https://a0.muscache.com/im/pictures/hosting/Hosting-1523922798240522995/original/7792c92b-1948-40a9-b8d3-869217e61a27.jpeg",
      "https://a0.muscache.com/im/pictures/hosting/Hosting-1523922798240522995/original/406a13b9-08b3-42f5-9ee3-fa0239321f85.jpeg",
      "https://a0.muscache.com/im/pictures/hosting/Hosting-1523922798240522995/original/fe7f815a-3351-4980-98e5-61b386399126.jpeg",
      "https://a0.muscache.com/im/pictures/hosting/Hosting-1523922798240522995/original/03c023ae-f21c-4d9c-ba62-c4e14d725390.jpeg",
      "https://a0.muscache.com/im/pictures/hosting/Hosting-1523922798240522995/original/0b03ca36-283f-4982-8321-25fc2c541ebb.jpeg"
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
    image: "https://a0.muscache.com/im/pictures/hosting/Hosting-1523956559132675863/original/6a0e5985-1982-4841-811a-d1ed57edd327.jpeg",
    details: "1BR King · Private En-Suite · 1 guest",
    capacity: 1,
    rating: 4.89,
    reviewsCount: 9,
    airbnbUrl: "https://airbnb.com/h/20-3-wsc",
    gallery: [
      "https://a0.muscache.com/im/pictures/hosting/Hosting-1523956559132675863/original/6a0e5985-1982-4841-811a-d1ed57edd327.jpeg",
      "https://a0.muscache.com/im/pictures/hosting/Hosting-1523956559132675863/original/447d1213-498b-43c0-9d1a-3cd48cc25a96.jpeg",
      "https://a0.muscache.com/im/pictures/hosting/Hosting-1523956559132675863/original/be141a9e-9bc5-4b6c-b9f5-d27542cbd235.jpeg",
      "https://a0.muscache.com/im/pictures/hosting/Hosting-1523956559132675863/original/c4255099-7c27-4c05-ac2d-f572c8546f91.jpeg",
      "https://a0.muscache.com/im/pictures/hosting/Hosting-1523956559132675863/original/cc75cdb0-057e-4f69-ab98-7587ef2bf8d8.jpeg",
      "https://a0.muscache.com/im/pictures/hosting/Hosting-1523956559132675863/original/ca026f5c-3f5c-4ece-9f06-79533c94ce6b.jpeg",
      "https://a0.muscache.com/im/pictures/hosting/Hosting-1523956559132675863/original/415d03f0-d2c4-4f6b-bfae-9d73fcfa38a0.jpeg",
      "https://a0.muscache.com/im/pictures/hosting/Hosting-1523956559132675863/original/7c4719fb-9149-4ec9-92dc-9632a2edc7bb.jpeg"
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
    image: "https://a0.muscache.com/im/pictures/hosting/Hosting-1521765380778708080/original/58496a67-ede8-43c0-8024-a27c108907e5.jpeg",
    details: "Large 1BR · Separate Shower · 1 guest",
    capacity: 1,
    rating: 4.89,
    reviewsCount: 9,
    airbnbUrl: "https://airbnb.com/h/22-4-wsc",
    gallery: [
      "https://a0.muscache.com/im/pictures/hosting/Hosting-1521765380778708080/original/58496a67-ede8-43c0-8024-a27c108907e5.jpeg",
      "https://a0.muscache.com/im/pictures/hosting/Hosting-1521765380778708080/original/67c9eebb-45bb-4913-8414-8a45881d4c4f.jpeg",
      "https://a0.muscache.com/im/pictures/hosting/Hosting-1521765380778708080/original/d503c7e8-aeb6-4ae1-8e36-f88751ea4fa8.jpeg",
      "https://a0.muscache.com/im/pictures/hosting/Hosting-1521765380778708080/original/e5b8fc85-fa5e-4ff9-ac8e-f5c030b51bff.jpeg",
      "https://a0.muscache.com/im/pictures/hosting/Hosting-1521765380778708080/original/329b75aa-eceb-4492-9adc-9fadc5ba76f4.jpeg",
      "https://a0.muscache.com/im/pictures/hosting/Hosting-1521765380778708080/original/ed3249b1-00a7-4043-8357-e2eac7733a7d.jpeg",
      "https://a0.muscache.com/im/pictures/hosting/Hosting-1521765380778708080/original/44273479-aedb-41fe-9b78-f8b551940d6e.jpeg",
      "https://a0.muscache.com/im/pictures/hosting/Hosting-1521765380778708080/original/422e2395-2e45-48cc-ba67-f883dd5d7b5f.jpeg"
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
    image: "https://a0.muscache.com/im/pictures/hosting/Hosting-1522455244829831002/original/eba9d77f-a9c7-4112-8927-9ba770d5bcc9.jpeg",
    details: "King 1BR · Private En-Suite · 1 guest",
    capacity: 1,
    rating: 4.86,
    reviewsCount: 7,
    airbnbUrl: "https://airbnb.com/h/22-5-wsc",
    gallery: [
      "https://a0.muscache.com/im/pictures/hosting/Hosting-1522455244829831002/original/eba9d77f-a9c7-4112-8927-9ba770d5bcc9.jpeg",
      "https://a0.muscache.com/im/pictures/hosting/Hosting-1522455244829831002/original/de30f451-c331-422a-9a80-f64a460a3ef5.jpeg",
      "https://a0.muscache.com/im/pictures/hosting/Hosting-1522455244829831002/original/88c7a099-7ea4-4a1b-ba8a-3df93db3be97.jpeg",
      "https://a0.muscache.com/im/pictures/hosting/Hosting-1522455244829831002/original/d497e4f9-a494-47fb-9858-921f836139c4.jpeg",
      "https://a0.muscache.com/im/pictures/hosting/Hosting-1522455244829831002/original/9d670915-f217-4acb-907f-bad610cb1752.jpeg",
      "https://a0.muscache.com/im/pictures/hosting/Hosting-1522455244829831002/original/b4ea0d73-8523-4e2a-99e2-4d38891359ad.jpeg",
      "https://a0.muscache.com/im/pictures/hosting/Hosting-1522455244829831002/original/e482913f-4765-43a2-85ea-28afb5e711d4.jpeg",
      "https://a0.muscache.com/im/pictures/hosting/Hosting-1522455244829831002/original/2b853841-8a38-4d72-a519-9e114636f43c.jpeg"
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
    image: "https://a0.muscache.com/im/pictures/hosting/Hosting-1517332573480357530/original/fe722429-3da6-4a2e-8325-57e9b69ac256.jpeg",
    details: "King 1BR · En-Suite · 1 guest",
    capacity: 1,
    rating: 5,
    reviewsCount: 11,
    airbnbUrl: "https://airbnb.com/h/22-6-wsc",
    gallery: [
      "https://a0.muscache.com/im/pictures/hosting/Hosting-1517332573480357530/original/fe722429-3da6-4a2e-8325-57e9b69ac256.jpeg",
      "https://a0.muscache.com/im/pictures/hosting/Hosting-1517332573480357530/original/0dc3ecf5-1f5f-40d5-9446-8542a7202371.jpeg",
      "https://a0.muscache.com/im/pictures/hosting/Hosting-1517332573480357530/original/30994c0a-30bb-4913-b9d6-1ec50664d8e0.jpeg",
      "https://a0.muscache.com/im/pictures/hosting/Hosting-1517332573480357530/original/f6f26e08-0989-482d-a32c-37f26fd64d95.jpeg",
      "https://a0.muscache.com/im/pictures/hosting/Hosting-1517332573480357530/original/4b0389a3-ced0-4f04-bfdc-96a14ce9da13.jpeg",
      "https://a0.muscache.com/im/pictures/hosting/Hosting-1517332573480357530/original/6b5ef60a-18b7-4568-80ac-25ca912951f1.jpeg",
      "https://a0.muscache.com/im/pictures/hosting/Hosting-1517332573480357530/original/1361fbe0-42cb-41cf-805b-42bdc164029b.jpeg",
      "https://a0.muscache.com/im/pictures/hosting/Hosting-1517332573480357530/original/32edafb4-4b81-47eb-847c-c784a9cb7796.jpeg"
    ],
    features: sharedFeatures,
  }
];
