// @/src/components/recipes/RecipePage.tsx
"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, ChefHat, Users, ArrowLeft, Printer } from "lucide-react";

interface RecipeIngredient {
  id?: number;
  name: string;
  quantity: string;
  unit?: string;
}

interface Step {
  id?: number;
  order: number;
  instruction: string;
  duration?: number;
}

interface Recette {
  id: number;
  title: string;
  slug: string;
  category: string;
  description: string;
  country: string;
  image: string;
  difficulty: "facile" | "moyenne" | "difficile";
  ingredients: RecipeIngredient[];
  steps: Step[];
}

interface RecipePageProps {
  recette: Recette;
}

const difficultyColors = {
  facile: "bg-green-100 text-green-800",
  moyenne: "bg-yellow-100 text-yellow-800",
  difficile: "bg-red-100 text-red-800",
};

const difficultyLabels = {
  facile: "Facile",
  moyenne: "Moyenne",
  difficile: "Difficile",
};

export default function RecipePage({ recette }: RecipePageProps) {
  const handlePrint = () => {
    window.print();
  };

  // Calculer le temps total approximatif
  const totalDuration = recette.steps.reduce(
    (acc, step) => acc + (step.duration || 0),
    0,
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 print:py-4">
      {/* Header avec actions */}
      <div className="flex justify-between items-center mb-6 print:hidden">
        <Link
          href="/recettes"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={20} />
          Retour aux recettes
        </Link>
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition"
        >
          <Printer size={18} />
          Imprimer
        </button>
      </div>

      {/* Image principale */}
      <div className="relative w-full h-96 rounded-xl overflow-hidden mb-8 bg-gray-100">
        {recette.image ? (
          <Image
            src={recette.image}
            alt={recette.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            Pas d&apos;image disponible
          </div>
        )}
      </div>

      {/* Titre et infos */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-3 items-center mb-4">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${difficultyColors[recette.difficulty]}`}
          >
            {difficultyLabels[recette.difficulty]}
          </span>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
            {recette.category}
          </span>
          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
            {recette.country}
          </span>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {recette.title}
        </h1>
        <p className="text-lg text-gray-600">{recette.description}</p>

        {/* Métriques */}
        <div className="flex flex-wrap gap-6 mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 text-gray-500">
            <Clock size={18} />
            <span>
              {totalDuration > 0
                ? `${Math.floor(totalDuration / 60)}h${totalDuration % 60 > 0 ? ` ${totalDuration % 60}min` : ""}`
                : "Durée non spécifiée"}
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <ChefHat size={18} />
            <span>{difficultyLabels[recette.difficulty]}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <Users size={18} />
            <span>{recette.ingredients.length} ingrédients</span>
          </div>
        </div>
      </div>

      {/* Contenu principal en deux colonnes sur desktop */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Colonne de gauche - Ingrédients */}
        <div className="md:col-span-1">
          <div className="bg-gray-50 rounded-xl p-6 sticky top-24">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Ingrédients
            </h2>
            <ul className="space-y-2">
              {recette.ingredients.map((ingredient, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-gray-700"
                >
                  <span className="text-emerald-600">•</span>
                  <span>
                    <span className="font-medium">{ingredient.name}</span>
                    {ingredient.quantity && (
                      <span>
                        {" "}
                        : {ingredient.quantity}
                        {ingredient.unit && ` ${ingredient.unit}`}
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Colonne de droite - Étapes */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Préparation
            </h2>
            <div className="space-y-6">
              {recette.steps
                .sort((a, b) => a.order - b.order)
                .map((step, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold text-lg">
                      {step.order || index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800">{step.instruction}</p>
                      {step.duration && (
                        <span className="text-sm text-gray-400 mt-1 inline-block">
                          ⏱️ {step.duration} min
                        </span>
                      )}
                    </div>
                  </div>
                ))}
            </div>

            {/* Message si aucune étape */}
            {(!recette.steps || recette.steps.length === 0) && (
              <p className="text-gray-500 italic">
                Aucune étape de préparation renseignée.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
