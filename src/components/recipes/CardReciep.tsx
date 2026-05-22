// @/src/components/recipes/CardReciep.tsx

"use client";

import React, { useState } from "react";

export interface Recette {
  id: number;
  title: string;
  slug: string;
  category: string;
  description: string;
  country: string;
  image: string;
}

interface CardReciepProps {
  recette: Recette;
  onView?: (recette: Recette) => void;
  onEdit?: (recette: Recette) => void;
  onDelete?: (recette: Recette) => void;
}

const CardReciep: React.FC<CardReciepProps> = ({
  recette,
  onView,
  onEdit,
  onDelete,
}) => {
  const [imageError, setImageError] = useState(false);

  // Fonction pour obtenir la classe de couleur selon la catégorie
  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Dessert: "bg-pink-100 text-pink-800",
      PlatPrincipal: "bg-green-100 text-green-800",
      Entree: "bg-blue-100 text-blue-800",
      Accompagnement: "bg-yellow-100 text-yellow-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  // Fonction pour obtenir le libellé de catégorie en français
  const getCategoryLabel = (category: string) => {
    const labels: { [key: string]: string } = {
      Dessert: "Dessert",
      PlatPrincipal: "Plat Principal",
      Entree: "Entrée",
      Accompagnement: "Accompagnement",
    };
    return labels[category] || category;
  };

  // Fonction pour obtenir le drapeau selon le pays
  const getCountryFlag = (country: string) => {
    const flags: { [key: string]: string } = {
      France: "🇫🇷",
      Italie: "🇮🇹",
      Espagne: "🇪🇸",
      Asie: "🌏",
      AmeriqueLatine: "🌎",
    };
    return flags[country] || "🏳️";
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Image Section */}
      <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        {!imageError ? (
          <img
            src={recette.image}
            alt={recette.slug}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <span className="text-5xl mb-2">🍽️</span>
            <span className="text-sm text-gray-500">Image non disponible</span>
          </div>
        )}

        {/* Category Badge */}
        <span
          className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold shadow-md ${getCategoryColor(recette.category)}`}
        >
          {getCategoryLabel(recette.category)}
        </span>

        {/* Country Flag Badge */}
        <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
          <span className="text-sm" title={recette.country}>
            {getCountryFlag(recette.country)} {recette.country}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">
          {recette.title}
        </h3>
        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">
          {recette.slug}
        </h3>
        {/* Description */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {recette.description}
        </p>

        {/* Meta Info */}
        <div className="flex items-center gap-3 text-xs text-gray-400 mb-4 pb-3 border-b border-gray-100">
          <span className="font-mono bg-gray-50 px-2 py-1 rounded">
            ID: {recette.id}
          </span>
          <span className="font-mono bg-gray-50 px-2 py-1 rounded truncate">
            {recette.slug}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => onView?.(recette)}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
          >
            Voir
          </button>
          <button
            onClick={() => onEdit?.(recette)}
            className="px-3 py-2 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-lg text-sm font-medium transition-colors duration-200"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete?.(recette)}
            className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-medium transition-colors duration-200"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardReciep;
