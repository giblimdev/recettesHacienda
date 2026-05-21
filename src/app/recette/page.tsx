// src/app/recette/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Trash2, Eye, Plus } from "lucide-react";

// Importer les types partagés
import type { Recipe, Image } from "@/src/types/recipe";

// Fonction fetch définie en dehors du composant (stable)
async function fetchRecipes(): Promise<Recipe[]> {
  const res = await fetch("/api/recette/recipes");
  if (!res.ok) throw new Error("Erreur chargement");
  return res.json();
}

export default function AdminRecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    fetchRecipes()
      .then((data) => {
        if (isMounted) setRecipes(data);
      })
      .catch((err) => {
        if (isMounted) setError(err.message);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const deleteRecipe = async (id: string) => {
    if (!confirm("Supprimer cette recette ?")) return;
    try {
      await fetch(`/api/recette/recipes/${id}`, { method: "DELETE" });
      const updated = await fetchRecipes();
      setRecipes(updated);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la suppression");
    }
  };

  if (loading) return <div className="p-10 text-center">Chargement...</div>;
  if (error) return <div className="p-10 text-red-500">Erreur : {error}</div>;

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestion des recettes</h1>
        <Link href="/recette/new">
          <Button>
            <Plus className="mr-2" /> Nouvelle recette
          </Button>
        </Link>
      </div>
      <div className="grid gap-4">
        {recipes.map((recipe) => (
          <Card key={recipe.id}>
            <CardHeader>
              <CardTitle>{recipe.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-4">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/recette/${recipe.slug}`} target="_blank">
                  <Eye className="h-4 w-4 mr-1" /> Voir
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/recette/${recipe.slug}/edit`}>
                  <Pencil className="h-4 w-4 mr-1" /> Modifier
                </Link>
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => deleteRecipe(recipe.id)}
              >
                <Trash2 className="h-4 w-4 mr-1" /> Supprimer
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

/*
Quiche aux poireaux et lardons
100 g
de lardons fumés ou nature
poireau
4
poireaux
gruyère râpé
100 g
de gruyère râpé
poivre
poivre
sel
sel
pâte brisée
1
pâte brisée (ou alors 3 bonnes cuillères à soupe de farine que vous ajouterez aux ingrédients suivants si vous n'avez pas de pâte)
oeuf
4
oeufs
crème liquide
20 cl
de crème liquide
lait
25 cl
de lait

Étape 1

Préchauffez votre four à 200°C (thermostat 6-7). Coupez les poireaux en fines rondelles et faites-les cuire à la vapeur 10 minutes.

Étape 2

Faites dorer les lardons à la poêle, ajoutez les poireaux cuits, poursuivez la cuisson à feu moyen durant 5 minutes puis réservez.

Étape 3

Dans un grand saladier, mélangez les oeufs, la crème, le lait, la farine (si vous n'utilisez pas de pâte brisée) et le gruyère.

Étape 4
Beurrez un moule à tarte, recouvrez de la pâte ou tapissez directement le fond avec le mélange poireau-lardons.

Étape 5
Versez par dessus votre appareil fait avec le reste des ingrédients. Enfournez pendant environ 30 minutes tout en surveillant la cuisson.
*/
