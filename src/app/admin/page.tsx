// @/src/app/admin/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import CardReciep from "@/src/components/recipes/CardReciep";
import { recettes, type Recette } from "@/src/data/recette";

const AdminPage = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showStats, setShowStats] = useState(true);
  const [recipes, setRecipes] = useState<Recette[]>(recettes);

  const countries = ["all", ...new Set(recipes.map((r) => r.country))];
  const categories = ["all", ...new Set(recipes.map((r) => r.category))];

  const filteredRecettes = recipes.filter((recette) => {
    const matchesSearch =
      recette.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recette.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCountry =
      selectedCountry === "all" || recette.country === selectedCountry;
    const matchesCategory =
      selectedCategory === "all" || recette.category === selectedCategory;
    return matchesSearch && matchesCountry && matchesCategory;
  });

  // Gestionnaires - TOUS utilisent le slug maintenant
  const handleView = (recette: Recette) => {
    console.log("Voir recette:", recette);
    router.push(`/admin/${recette.slug}?mode=view`);
  };

  const handleEdit = (recette: Recette) => {
    console.log("Modifier recette:", recette);
    // Utiliser le slug avec mode=edit au lieu de l'ID
    router.push(`/admin/${recette.slug}?mode=edit`);
  };

  const handleDelete = async (recette: Recette) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer "${recette.title}" ?`)) {
      const newRecipes = recipes.filter((r) => r.id !== recette.id);
      setRecipes(newRecipes);
      alert(`Recette "${recette.title}" supprimée avec succès !`);
    }
  };

  const handleAdd = () => {
    router.push("/admin/new");
  };

  const getStats = () => {
    const statsByCategory: { [key: string]: number } = {};
    const statsByCountry: { [key: string]: number } = {};

    filteredRecettes.forEach((r) => {
      statsByCategory[r.category] = (statsByCategory[r.category] || 0) + 1;
      statsByCountry[r.country] = (statsByCountry[r.country] || 0) + 1;
    });

    return { statsByCategory, statsByCountry };
  };

  const { statsByCategory, statsByCountry } = getStats();

  const getCategoryLabel = (category: string): string => {
    const labels: { [key: string]: string } = {
      PlatPrincipal: "🍽️ Plat Principal",
      Entree: "🥗 Entrée",
      Dessert: "🍰 Dessert",
      Accompagnement: "🥔 Accompagnement",
      Conserve: "🥫 Conserve",
      Sauce: "🧂 Sauce",
    };
    return labels[category] || category;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                📚 Administration des Recettes
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Gérez votre collection culinaire
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => router.push("/")}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <span>🏠</span> Accueil
              </button>
              <button
                onClick={handleAdd}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <span>➕</span> Ajouter
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistiques */}
        {showStats && (
          <div className="mb-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg p-4 text-white">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold">📊 Statistiques</h2>
              <button
                onClick={() => setShowStats(false)}
                className="text-white/70 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-2xl font-bold">
                  {filteredRecettes.length}
                </div>
                <div className="text-sm opacity-90">Total recettes</div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {Object.keys(statsByCategory).length}
                </div>
                <div className="text-sm opacity-90">Catégories</div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {Object.keys(statsByCountry).length}
                </div>
                <div className="text-sm opacity-90">Pays</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{recipes.length}</div>
                <div className="text-sm opacity-90">Total base</div>
              </div>
            </div>
          </div>
        )}

        {/* Filtres */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-700">🔍 Filtres</h2>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCountry("all");
                setSelectedCategory("all");
              }}
              className="text-sm text-blue-500 hover:text-blue-700"
            >
              Réinitialiser
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rechercher
              </label>
              <input
                type="text"
                placeholder="Titre ou description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pays
              </label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country === "all" ? "🌍 Tous les pays" : country}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catégorie
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === "all"
                      ? "📋 Toutes les catégories"
                      : getCategoryLabel(category)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {(searchTerm ||
            selectedCountry !== "all" ||
            selectedCategory !== "all") && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
              <span className="text-sm text-gray-500">Filtres actifs :</span>
              {searchTerm && (
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                  Recherche: {searchTerm}
                </span>
              )}
              {selectedCountry !== "all" && (
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                  Pays: {selectedCountry}
                </span>
              )}
              {selectedCategory !== "all" && (
                <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs">
                  Catégorie: {getCategoryLabel(selectedCategory)}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Résultats */}
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            📖 Résultats ({filteredRecettes.length})
          </h2>
          <div className="text-sm text-gray-500">
            {filteredRecettes.length === recipes.length
              ? `${recipes.length} recettes au total`
              : `Sur ${recipes.length} recettes`}
          </div>
        </div>

        {/* Grille des cartes */}
        {filteredRecettes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRecettes.map((recette) => (
              <CardReciep
                key={recette.id}
                recette={recette}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Aucune recette trouvée
            </h3>
            <p className="text-gray-500">
              Aucune recette ne correspond à vos critères de recherche.
              <br />
              Essayez de modifier vos filtres.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCountry("all");
                setSelectedCategory("all");
              }}
              className="mt-4 text-blue-500 hover:text-blue-700"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
