"use client";

import { useEffect, useState } from "react";
import { Guesthouse } from "@/types";
import apiClient from "@/lib/api";
import ListingCard from "@/components/listing-card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Guesthouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        const data = await apiClient.getFavorites();
        setFavorites(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching favorites:", err);
        setError("Impossible de charger vos favoris. Veuillez réessayer plus tard.");
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const handleRemoveFavorite = async (guesthouseId: string) => {
    try {
      await apiClient.removeFavorite(guesthouseId);
      setFavorites(favorites.filter(item => item.id !== guesthouseId));
    } catch (err) {
      console.error("Error removing favorite:", err);
      setError("Impossible de supprimer ce favori. Veuillez réessayer plus tard.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Réessayer</Button>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <h2 className="text-2xl font-semibold mb-2">Aucun favori</h2>
        <p className="text-muted-foreground mb-4">
          Vous n'avez pas encore ajouté de maisons d'hôtes à vos favoris.
        </p>
        <Button asChild>
          <a href="/listings">Découvrir des maisons d'hôtes</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Mes Favoris</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((guesthouse) => (
          <div key={guesthouse.id} className="relative">
            <ListingCard listing={guesthouse} />
            <Button
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={() => handleRemoveFavorite(guesthouse.id)}
            >
              Retirer
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}