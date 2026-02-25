export type Amenity =
  | "WiFi"
  | "Pool"
  | "Hot Tub"
  | "Pet Friendly"
  | "Kitchen"
  | "Parking"
  | "Fireplace"
  | "Air Conditioning"
  | "Beachfront"
  | "Mountain View"
  | "BBQ Grill"
  | "EV Charger"
  | "Washer/Dryer"
  | "Gym"
  | "Ski-in/Ski-out";

export const ALL_AMENITIES: Amenity[] = [
  "WiFi",
  "Pool",
  "Hot Tub",
  "Pet Friendly",
  "Kitchen",
  "Parking",
  "Fireplace",
  "Air Conditioning",
  "Beachfront",
  "Mountain View",
  "BBQ Grill",
  "EV Charger",
  "Washer/Dryer",
  "Gym",
  "Ski-in/Ski-out",
];

export interface TripOffer {
  id: string;
  hostName: string;
  hostAvatar: string;
  hostRating: number;
  hostReviews: number;
  propertyName: string;
  propertyImages: string[];
  pricePerNight: number;
  totalPrice: number;
  message: string;
  amenities: Amenity[];
  createdAt: string;
  bedrooms: number;
  bathrooms: number;
}

export interface TripRequest {
  id: string;
  destination: string;
  region: string;
  startDate: string;
  endDate: string;
  numGuests: number;
  amenities: Amenity[];
  description: string;
  budget: number;
  status: "open" | "closed";
  offerCount: number;
  createdAt: string;
  travelerName: string;
  travelerAvatar: string;
}

export const POPULAR_DESTINATIONS = [
  { name: "Lake Tahoe, CA", emoji: "🏔️" },
  { name: "Miami Beach, FL", emoji: "🌴" },
  { name: "Smoky Mountains, TN", emoji: "🌲" },
  { name: "Outer Banks, NC", emoji: "🌊" },
  { name: "Sedona, AZ", emoji: "🏜️" },
  { name: "Big Sur, CA", emoji: "🌅" },
  { name: "Park City, UT", emoji: "⛷️" },
  { name: "Hilton Head, SC", emoji: "⛳" },
];

export const MOCK_TRIP_REQUESTS: TripRequest[] = [
  {
    id: "trip-001",
    destination: "Lake Tahoe, CA",
    region: "California",
    startDate: "2026-03-14",
    endDate: "2026-03-21",
    numGuests: 8,
    amenities: ["Hot Tub", "Fireplace", "Ski-in/Ski-out", "WiFi", "Kitchen"],
    description:
      "Planning a ski trip with family! Looking for a cozy cabin near the slopes. We love après-ski evenings by the fire. Would love a hot tub to relax after long days on the mountain.",
    budget: 4500,
    status: "open",
    offerCount: 4,
    createdAt: "2026-02-22",
    travelerName: "Marcus R.",
    travelerAvatar: "M",
  },
  {
    id: "trip-002",
    destination: "Outer Banks, NC",
    region: "North Carolina",
    startDate: "2026-07-04",
    endDate: "2026-07-11",
    numGuests: 12,
    amenities: ["Beachfront", "Pool", "BBQ Grill", "Pet Friendly", "Parking"],
    description:
      "Annual family reunion at the beach! We need a big house with lots of space. Dogs are coming too. Would love direct beach access and a pool for the kids.",
    budget: 7000,
    status: "open",
    offerCount: 7,
    createdAt: "2026-02-23",
    travelerName: "The Johnson Family",
    travelerAvatar: "J",
  },
  {
    id: "trip-003",
    destination: "Sedona, AZ",
    region: "Arizona",
    startDate: "2026-04-10",
    endDate: "2026-04-14",
    numGuests: 2,
    amenities: ["Hot Tub", "Mountain View", "WiFi", "Kitchen", "Air Conditioning"],
    description:
      "Honeymoon trip! Looking for something romantic and secluded with incredible red rock views. Private hot tub is a must. We want to disconnect and enjoy nature.",
    budget: 2200,
    status: "open",
    offerCount: 11,
    createdAt: "2026-02-20",
    travelerName: "Priya & Dev",
    travelerAvatar: "P",
  },
  {
    id: "trip-004",
    destination: "Smoky Mountains, TN",
    region: "Tennessee",
    startDate: "2026-10-08",
    endDate: "2026-10-12",
    numGuests: 4,
    amenities: ["Fireplace", "Mountain View", "Hot Tub", "WiFi"],
    description:
      "Fall foliage trip with friends. We want to hike during the day and unwind in the evenings. A fireplace and hot tub would be perfect for the cool mountain nights.",
    budget: 1800,
    status: "open",
    offerCount: 6,
    createdAt: "2026-02-24",
    travelerName: "Sarah T.",
    travelerAvatar: "S",
  },
  {
    id: "trip-005",
    destination: "Miami Beach, FL",
    region: "Florida",
    startDate: "2026-03-27",
    endDate: "2026-03-31",
    numGuests: 6,
    amenities: ["Pool", "Beachfront", "Air Conditioning", "WiFi", "Parking"],
    description:
      "Spring break with college friends. We're looking for a place close to the beach and nightlife. Pool is a must. Flexible on exact location within Miami Beach.",
    budget: 3000,
    status: "open",
    offerCount: 9,
    createdAt: "2026-02-21",
    travelerName: "Tyler G.",
    travelerAvatar: "T",
  },
  {
    id: "trip-006",
    destination: "Park City, UT",
    region: "Utah",
    startDate: "2026-02-13",
    endDate: "2026-02-17",
    numGuests: 4,
    amenities: ["Ski-in/Ski-out", "Hot Tub", "Fireplace", "Kitchen", "Parking"],
    description:
      "Presidents' Day ski weekend. Two couples who love skiing and good food. Ski-in/ski-out preferred but not required. Great views and cozy vibes are a priority.",
    budget: 2800,
    status: "closed",
    offerCount: 15,
    createdAt: "2026-01-30",
    travelerName: "Alex & Jordan",
    travelerAvatar: "A",
  },
];

export const MOCK_OFFERS: Record<string, TripOffer[]> = {
  "trip-001": [
    {
      id: "offer-001-a",
      hostName: "Diane & Bob",
      hostAvatar: "D",
      hostRating: 4.95,
      hostReviews: 134,
      propertyName: "Tahoe Pines Retreat",
      propertyImages: [
        "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800",
        "https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?w=800",
      ],
      pricePerNight: 580,
      totalPrice: 4060,
      message:
        "Your crew would love our place! We're 3 mins from the Heavenly gondola with a private hot tub and two fireplaces. Fits 10 comfortably. Happy to offer 10% off the listed price for your dates.",
      amenities: ["Hot Tub", "Fireplace", "Ski-in/Ski-out", "WiFi", "Kitchen", "Parking"],
      createdAt: "2026-02-23",
      bedrooms: 4,
      bathrooms: 3,
    },
    {
      id: "offer-001-b",
      hostName: "Kevin M.",
      hostAvatar: "K",
      hostRating: 4.88,
      hostReviews: 87,
      propertyName: "The Lakeview Lodge",
      propertyImages: [
        "https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=800",
      ],
      pricePerNight: 620,
      totalPrice: 4340,
      message:
        "Stunning views of Lake Tahoe from the deck. Ski shuttle stop right outside. Hot tub seats 8 and we have two full kitchens. Perfect for your group!",
      amenities: ["Hot Tub", "Fireplace", "WiFi", "Kitchen", "Mountain View", "Parking"],
      createdAt: "2026-02-23",
      bedrooms: 5,
      bathrooms: 4,
    },
  ],
  "trip-002": [
    {
      id: "offer-002-a",
      hostName: "Southern Shores Rentals",
      hostAvatar: "S",
      hostRating: 4.92,
      hostReviews: 210,
      propertyName: "OBX Grand Family Estate",
      propertyImages: [
        "https://images.unsplash.com/photo-1505916349660-8d91a99f1338?w=800",
      ],
      pricePerNight: 950,
      totalPrice: 6650,
      message:
        "Perfect for your family reunion! Oceanfront, private pool, and pet-friendly. We can accommodate up to 16 guests. Hot tub and game room included.",
      amenities: ["Beachfront", "Pool", "BBQ Grill", "Pet Friendly", "Parking", "WiFi", "Kitchen"],
      createdAt: "2026-02-24",
      bedrooms: 7,
      bathrooms: 6,
    },
  ],
  "trip-003": [
    {
      id: "offer-003-a",
      hostName: "Luna & Rafael",
      hostAvatar: "L",
      hostRating: 5.0,
      hostReviews: 62,
      propertyName: "Red Rock Sanctuary",
      propertyImages: [
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
      ],
      pricePerNight: 495,
      totalPrice: 1980,
      message:
        "Congratulations on your wedding! Our secluded adobe casita has 360° red rock views and a private outdoor hot tub. Champagne and chocolates on arrival. Made for romance. ❤️",
      amenities: ["Hot Tub", "Mountain View", "WiFi", "Kitchen", "Air Conditioning", "Fireplace"],
      createdAt: "2026-02-21",
      bedrooms: 1,
      bathrooms: 1,
    },
    {
      id: "offer-003-b",
      hostName: "Canyon Properties",
      hostAvatar: "C",
      hostRating: 4.97,
      hostReviews: 198,
      propertyName: "Cathedral Rock Vista Suite",
      propertyImages: [
        "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800",
      ],
      pricePerNight: 520,
      totalPrice: 2080,
      message:
        "Our suite sits above the canyon with direct views of Cathedral Rock. Private infinity plunge pool, outdoor fireplace, and a luxurious king suite.",
      amenities: ["Hot Tub", "Mountain View", "WiFi", "Kitchen", "Air Conditioning", "Pool"],
      createdAt: "2026-02-22",
      bedrooms: 1,
      bathrooms: 2,
    },
  ],
  "trip-004": [],
  "trip-005": [],
  "trip-006": [],
};

export function getTripById(id: string): TripRequest | undefined {
  return MOCK_TRIP_REQUESTS.find((t) => t.id === id);
}

export function getOffersForTrip(tripId: string): TripOffer[] {
  return MOCK_OFFERS[tripId] || [];
}

export function formatDateRange(start: string, end: string): string {
  const s = new Date(start);
  const e = new Date(end);
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  return `${s.toLocaleDateString("en-US", opts)} – ${e.toLocaleDateString("en-US", { ...opts, year: "numeric" })}`;
}

export function nightsBetween(start: string, end: string): number {
  const ms = new Date(end).getTime() - new Date(start).getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}
