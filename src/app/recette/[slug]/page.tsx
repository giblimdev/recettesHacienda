//@/src/app/recette/[slug]/page.tsx
// src/app/recette/[slug]/page.tsx
import { notFound } from "next/navigation";
import Image from "next/image";
import { Clock, ChefHat, Users, Flame, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { RecipeWithRelations } from "@/src/types/recipe";

// Récupération de la recette depuis l’API interne
async function getRecipeBySlug(
  slug: string,
): Promise<RecipeWithRelations | null> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/recipes/by-slug/${slug}`,
    {
      next: { revalidate: 3600 }, // cache ISR 1 heure
    },
  );
  if (!res.ok) return null;
  return res.json();
}

export default async function RecipePage({
  params,
}: {
  params: { slug: string };
}) {
  const recipe = await getRecipeBySlug(params.slug);

  if (!recipe) {
    notFound();
  }

  const mainImage =
    recipe.images?.find((img) => img.isMain)?.url || "/placeholder.jpg";
  const avgRating =
    recipe.ratingCount > 0
      ? (recipe.rating / recipe.ratingCount).toFixed(1)
      : "0";

  return (
    <main className="container max-w-4xl mx-auto px-4 py-8">
      <Card className="overflow-hidden shadow-lg">
        {/* Hero avec ordre, auteur, etc. (à adapter selon tes champs) */}
        <div className="bg-gradient-to-r from-amber-700 to-orange-600 text-white p-4 text-sm flex justify-between">
          <div>Ordre : {recipe.order ?? "—"}</div>
          <div>Auteur : {recipe.author ?? "Anonyme"}</div>
          <div>Pays : {recipe.country}</div>
          <div>Date : {new Date(recipe.createdAt).toLocaleDateString()}</div>
        </div>

        {/* Image principale */}
        <div className="relative h-96 w-full">
          <Image
            src={mainImage}
            alt={recipe.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        <CardHeader>
          <div className="flex flex-wrap justify-between items-start gap-2">
            <CardTitle className="text-3xl md:text-4xl font-bold text-amber-900">
              {recipe.title}
            </CardTitle>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i <= parseFloat(avgRating)
                      ? "fill-yellow-500 text-yellow-500"
                      : "text-gray-300"
                  }`}
                />
              ))}
              <span className="ml-1 text-sm text-muted-foreground">
                ({avgRating}/5 – {recipe.ratingCount} avis)
              </span>
            </div>
          </div>
          <p className="text-muted-foreground text-lg italic mt-2">
            {recipe.description}
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Métadonnées */}
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" /> Préparation : {recipe.prepTime} min
            </div>
            <div className="flex items-center gap-1">
              <Flame className="w-4 h-4" /> Cuisson : {recipe.cookTime} min
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" /> Total : {recipe.totalTime} min
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" /> {recipe.servings} personnes
            </div>
            <div className="flex items-center gap-1">
              <ChefHat className="w-4 h-4" /> Difficulté : {recipe.difficulty}
            </div>
          </div>

          <Separator />

          {/* Ingrédients */}
          <div>
            <h2 className="text-2xl font-semibold mb-3 flex items-center gap-2">
              <span className="bg-amber-100 p-1 rounded">🛒</span> Ingrédients
            </h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 list-disc list-inside text-muted-foreground">
              {recipe.ingredients.map((ing, idx) => (
                <li key={idx}>
                  {ing.quantity} {ing.unit} {ing.ingredient.name}
                </li>
              ))}
            </ul>
          </div>

          <Separator />

          {/* Étapes */}
          <div>
            <h2 className="text-2xl font-semibold mb-3 flex items-center gap-2">
              <span className="bg-amber-100 p-1 rounded">👩‍🍳</span> Étapes
            </h2>
            <ol className="space-y-4 list-decimal list-inside">
              {recipe.steps.map((step) => (
                <li key={step.id}>
                  {step.instruction}
                  {step.images && step.images.length > 0 && (
                    <div className="mt-2 flex gap-2">
                      {step.images.map((img) => (
                        <div key={img.id} className="relative w-32 h-32">
                          <Image
                            src={img.url}
                            alt={`Étape ${step.order}`}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ol>
          </div>

          <Separator />

          {/* Tags */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="font-semibold">Tags :</span>
            {recipe.tags.map((t) => (
              <Badge key={t.tag.id} variant="secondary">
                {t.tag.name}
              </Badge>
            ))}
          </div>

          {/* Astuce */}
          {recipe.tips && (
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <h3 className="font-semibold flex items-center gap-2">
                💡 Astuce du chef
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {recipe.tips}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
