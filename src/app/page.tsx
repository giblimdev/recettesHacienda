// src/app/page.tsx
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/src/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChefHat, PlusCircle } from "lucide-react";

// Récupération des 6 dernières recettes (avec image principale)
async function getLatestRecipes() {
  const recipes = await prisma.recipe.findMany({
    take: 6,
    orderBy: { createdAt: "desc" },
    include: {
      images: {
        where: { isMain: true },
        take: 1,
      },
    },
  });
  return recipes;
}

export default async function Home() {
  const recipes = await getLatestRecipes();

  return (
    <main className="container max-w-7xl mx-auto px-4 py-12">
      {/* Hero */}
      <section className="text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm mb-4">
          <ChefHat className="w-4 h-4" />
          <span>Partagez vos meilleures recettes</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-amber-900 mb-6">
          Cuisinez & Partagez
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Découvrez des recettes authentiques du monde entier, ou gérez votre
          propre collection.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/recette">Explorer les recettes</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/recette">
              <PlusCircle className="mr-2 h-4 w-4" /> Gérer mes recettes
            </Link>
          </Button>
        </div>
      </section>

      {/* Dernières recettes */}
      <section>
        <h2 className="text-3xl font-semibold text-amber-900 mb-8 text-center">
          Dernières recettes ajoutées
        </h2>
        {recipes.length === 0 ? (
          <p className="text-center text-muted-foreground">
            Aucune recette pour le moment.{" "}
            <Link href="/recette" className="text-amber-600 underline">
              Ajoutez votre première recette
            </Link>
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <Link key={recipe.id} href={`/recette/${recipe.slug}`}>
                <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48 w-full">
                    <Image
                      src={recipe.images[0]?.url || "/placeholder-food.jpg"}
                      alt={recipe.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="line-clamp-1">
                      {recipe.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground line-clamp-2 text-sm">
                      {recipe.description}
                    </p>
                    <div className="mt-4 flex justify-between text-sm">
                      <span>⏱️ {recipe.prepTime + recipe.cookTime} min</span>
                      <span>🍽️ {recipe.servings} pers.</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Section admin rapide */}
      <section className="mt-20 bg-amber-50 rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-semibold text-amber-900 mb-3">
          Vous êtes le chef ?
        </h2>
        <p className="text-muted-foreground mb-6">
          Ajoutez, modifiez ou supprimez vos recettes depuis l’interface
          d’administration.
        </p>
        <Button asChild variant="default">
          <Link href="/recette">Aller à l’administration</Link>
        </Button>
      </section>
    </main>
  );
}
