// "use client";

// import { useEffect, useState } from "react";
// import { Guesthouse } from "@/types";
// import apiClient from "@/lib/api";
// import ListingCard from "@/components/listing-card";
// import { Button } from "@/components/ui/button";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Loader2 } from "lucide-react";
// import type { Listing } from "@/components/types/listing";

// // Fonction pour convertir Guesthouse en Listing
// const guesthouseToListing = (guesthouse: Guesthouse): Listing => {
//   return {
//     id: parseInt(guesthouse.id) || 0,
//     title: guesthouse.title || "",
//     description: guesthouse.description || "",
//     latitude: guesthouse.latitude || 0,
//     longitude: guesthouse.longitude || 0,
//     thumbnailUrl: guesthouse.thumbnail || "/placeholder.svg",
//     externalUrl: "",
//     city: guesthouse.city || "",
//     price: parseFloat(guesthouse.price) || 0,
//     ratingAccuracy: 0,
//     ratingCleanliness: 0,
//     ratingCommunication: 0,
//     ratingLocation: 0,
//     ratingValue: 0,
//     ratingGuestSatisfaction: 0,
//     reviews: [],
//     owner: { id: guesthouse.ownerId },
//     images: [],
//     amenities: guesthouse.amenities || [],
//     instantBook: false,
//     hostName: "",
//     hostAvatar: "",
//     maxGuests: 2,
//     availableDates: []
//   };
// };

// export default function RecommendationsPage() {
//   const [recommendations, setRecommendations] = useState<Guesthouse[]>([]);
//   const [personalizedRecommendations, setPersonalizedRecommendations] = useState<Guesthouse[]>([]);
//   const [locationRecommendations, setLocationRecommendations] = useState<Guesthouse[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchRecommendations = async () => {
//       try {
//         setLoading(true);
//         const [general, personalized] = await Promise.all([
//           apiClient.getRecommendations(),
//           apiClient.getPersonalizedRecommendations()
//         ]);
        
//         setRecommendations(general);
//         setPersonalizedRecommendations(personalized);
        
//         // Get location-based recommendations if geolocation is available
//         if (navigator.geolocation) {
//           navigator.geolocation.getCurrentPosition(
//             async (position) => {
//               try {
//                 const locationBased = await apiClient.getLocationBasedRecommendations(
//                   position.coords.latitude,
//                   position.coords.longitude
//                 );
//                 setLocationRecommendations(locationBased);
//               } catch (err) {
//                 console.error("Error fetching location recommendations:", err);
//               }
//             },
//             (err) => {
//               console.error("Geolocation error:", err);
//             }
//           );
//         }
        
//         setError(null);
//       } catch (err) {
//         console.error("Error fetching recommendations:", err);
//         setError("Impossible de charger les recommandations. Veuillez réessayer plus tard.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRecommendations();
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-[60vh]">
//         <Loader2 className="h-8 w-8 animate-spin text-primary" />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
//         <p className="text-red-500 mb-4">{error}</p>
//         <Button onClick={() => window.location.reload()}>Réessayer</Button>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto py-8">
//       <h1 className="text-3xl font-bold mb-6">Recommandations</h1>
      
//       <Tabs defaultValue="general" className="w-full">
//         <TabsList className="mb-6 w-full">
//           <TabsTrigger value="general">Populaires</TabsTrigger>
//           <TabsTrigger value="personalized">Pour vous</TabsTrigger>
//           <TabsTrigger value="location" disabled={locationRecommendations.length === 0}>
//             À proximité
//           </TabsTrigger>
//         </TabsList>
        
//         <TabsContent value="general">
//           {recommendations.length === 0 ? (
//             <p className="text-center text-muted-foreground">Aucune recommandation disponible.</p>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {recommendations.map((guesthouse) => (
//                 <ListingCard key={guesthouse.id} listing={guesthouseToListing(guesthouse)} />
//               ))}
//             </div>
//           )}
//         </TabsContent>
        
//         <TabsContent value="personalized">
//           {personalizedRecommendations.length === 0 ? (
//             <p className="text-center text-muted-foreground">
//               Aucune recommandation personnalisée disponible. Explorez plus de maisons d'hôtes pour obtenir des recommandations adaptées à vos préférences.
//             </p>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {personalizedRecommendations.map((guesthouse) => (
//                 <ListingCard key={guesthouse.id} listing={guesthouseToListing(guesthouse)} />
//               ))}
//             </div>
//           )}
//         </TabsContent>
        
//         <TabsContent value="location">
//           {locationRecommendations.length > 0 ? (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {locationRecommendations.map((guesthouse) => (
//                 <ListingCard key={guesthouse.id} listing={guesthouseToListing(guesthouse)} />
//               ))}
//             </div>
//           ) : (
//             <p className="text-center text-muted-foreground">
//               Aucune maison d'hôte à proximité trouvée. Veuillez activer la géolocalisation pour voir les recommandations à proximité.
//             </p>
//           )}
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// }