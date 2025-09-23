

// Define the Listing interface
export interface Listing {
  id: number;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  thumbnailUrl: string;
  externalUrl: string;
  city: string;
  price: number;
  ratingAccuracy: number;
  ratingCleanliness: number;
  ratingCommunication: number;
  ratingLocation: number;
  ratingValue: number;
  ratingGuestSatisfaction: number;
  reviews: any[];
  owner: any;
  images: any[];
  amenities: any[];
  instantBook: boolean;
  hostName: string;
  hostAvatar: string;
  maxGuests: number;
  availableDates: any[];
    rating?: number; 
}

function mapToListing(item: any): Listing {
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    latitude: item.latitude,
    longitude: item.longitude,
    thumbnailUrl: item.thumbnail,
    externalUrl: item.url,
    city: item.city,
    price: item.price,

    // Valeurs par défaut (non fournies par ton JSON)
    ratingAccuracy: 0,
    ratingCleanliness: 0,
    ratingCommunication: 0,
    ratingLocation: 0,
    ratingValue: 0,
    ratingGuestSatisfaction: 0,

    reviews: item.reviews ?? [],
    owner: item.owner ?? null,
    images: [],
    amenities: [],
    instantBook: false,
    hostName: "",
    hostAvatar: "",
    maxGuests: 1,
    availableDates: [],
  }
}
