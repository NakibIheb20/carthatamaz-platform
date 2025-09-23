"use client"

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface AddPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newProperty: any) => void;
}

export default function AddPropertyModal({ isOpen, onClose, onAdd }: AddPropertyModalProps) {
  const [formData, setFormData] = useState({
    thumbnailFile: null as File | null,
    thumbnailPreview: "",
    title: "",
    description: "",
    reviewsCount: 0,
    price: "",
    priceLabel: "",
    latitude: 0,
    longitude: 0,
    url: "",
    city: "",
    bookings: 0,
  });

  // Reset form à chaque ouverture
  useEffect(() => {
    if (isOpen) {
      setFormData({
        thumbnailFile: null,
        thumbnailPreview: "",
        title: "",
        description: "",
        reviewsCount: 0,
        price: "",
        priceLabel: "",
        latitude: 0,
        longitude: 0,
        url: "",
        city: "",
        bookings: 0// 👈 ajoutez ceci
      });
    }
  }, [isOpen]);

  // Gestion du changement du fichier image
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      setFormData((prev) => ({ ...prev, thumbnailFile: null, thumbnailPreview: "" }));
      return;
    }
    const file = e.target.files[0];
    const previewUrl = URL.createObjectURL(file);
    setFormData((prev) => ({
      ...prev,
      thumbnailFile: file,
      thumbnailPreview: previewUrl,
    }));
  };

  // Gestion des autres champs du formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

const handleSubmit = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Vous devez être connecté pour ajouter une propriété.");
    return;
  }

  try {
    const response = await fetch("http://localhost:8080/api/guest/guesthouses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      alert("Erreur lors de l'ajout : " + errorText);
      return;
    }

    const result = await response.json();
    onAdd(result); // callback pour mettre à jour la liste
    onClose(); // fermer la modal
  } catch (error) {
    alert("Erreur réseau : " + error);
    console.error(error);
  }
};


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Ajouter une nouvelle maison d'hôtes</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Image upload */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="thumbnail">Image</Label>
            <div className="col-span-3">
              <Input
                type="file"
                id="thumbnail"
                accept="image/*"
                onChange={handleFileChange}
              />
              {formData.thumbnailPreview && (
                <img
                  src={formData.thumbnailPreview}
                  alt="Aperçu de l'image"
                  className="mt-2 max-h-40 object-contain rounded-md"
                />
              )}
            </div>
          </div>

          {/* Titre */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title">Titre</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="col-span-3"
              placeholder="Nom de la maison d'hôtes"
            />
          </div>

          {/* Description */}
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="col-span-3"
              placeholder="Décrivez la propriété"
            />
          </div>

          {/* Nombre de commentaires */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="reviewsCount">Nombre de commentaires</Label>
            <Input
              id="reviewsCount"
              name="reviewsCount"
              type="number"
              value={formData.reviewsCount}
              onChange={handleChange}
              className="col-span-3"
              placeholder="0"
            />
          </div>

          {/* Prix */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price">Prix</Label>
            <Input
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="col-span-3"
              placeholder="100 TND"
            />
          </div>

          {/* Libellé prix */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="priceLabel">Libellé de prix</Label>
            <Input
              id="priceLabel"
              name="priceLabel"
              value={formData.priceLabel}
              onChange={handleChange}
              className="col-span-3"
              placeholder="Par nuit"
            />
          </div>

          {/* Latitude */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="latitude">Latitude</Label>
            <Input
              id="latitude"
              name="latitude"
              type="number"
              value={formData.latitude}
              onChange={handleChange}
              className="col-span-3"
              placeholder="36.8065"
            />
          </div>

          {/* Longitude */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="longitude">Longitude</Label>
            <Input
              id="longitude"
              name="longitude"
              type="number"
              value={formData.longitude}
              onChange={handleChange}
              className="col-span-3"
              placeholder="10.1815"
            />
          </div>

          {/* URL */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="url">Lien externe</Label>
            <Input
              id="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
              className="col-span-3"
              placeholder="https://example.com/property"
            />
          </div>

          {/* Ville */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="city">Ville</Label>
            <Input
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="col-span-3"
              placeholder="Tunis, Sousse, etc."
            />
          </div>

          {/* Bouton Ajouter */}
          <div className="flex justify-end">
            <Button onClick={handleSubmit}>Ajouter</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
