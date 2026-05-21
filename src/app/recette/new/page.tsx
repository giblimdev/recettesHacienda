// src/app/recette/new/page.tsx
"use client";

import { useRouter } from "next/navigation";
import {
  RecipeForm,
  type RecipeFormValues,
} from "@/src/components/recipes/RecipeForm";

export default function NewRecipePage() {
  const router = useRouter();

  const handleSubmit = async (data: RecipeFormValues) => {
    const res = await fetch("/api/recette/recipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(`Erreur création: ${error}`);
    }

    // Redirige vers la liste des recettes après succès
    router.push("/recette");
    router.refresh();
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Créer une recette</h1>
      <RecipeForm onSubmit={handleSubmit} />
    </div>
  );
}
