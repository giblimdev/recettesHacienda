// @/src/app/recette/[id]/edit/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  RecipeForm,
  type RecipeFormValues,
} from "@/src/components/recipes/RecipeForm";
import type { RecipeWithRelations } from "@/src/types/recipe";

export default function EditRecipePage() {
  const { id } = useParams();
  const router = useRouter();
  const [initialData, setInitialData] = useState<RecipeFormValues | undefined>(
    undefined,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/recipes/${id}`)
      .then((res) => res.json())
      .then((data: RecipeWithRelations) => {
        const formData: RecipeFormValues = {
          title: data.title,
          slug: data.slug,
          description: data.description,
          category: data.category,
          country: data.country,
          prepTime: data.prepTime.toString(),
          cookTime: data.cookTime.toString(),
          servings: data.servings.toString(),
          difficulty: data.difficulty,
          tips: data.tips ?? "",
          mainImage: data.images?.find((img) => img.isMain)?.url ?? "",
          ingredients: data.ingredients.map((ing) => ({
            name: ing.ingredient.name,
            quantity: ing.quantity.toString(),
            unit: ing.unit,
          })),
          steps: data.steps.map((step) => ({
            instruction: step.instruction,
            images: step.images?.map((img) => img.url) ?? [],
          })),
          tags: data.tags.map((t) => ({ name: t.tag.name, slug: t.tag.slug })),
        };
        setInitialData(formData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (data: RecipeFormValues) => {
    const res = await fetch(`/api/recipes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Erreur mise à jour");
    router.push("/admin/recipes");
  };

  if (loading) return <div>Chargement...</div>;
  if (!initialData) return <div>Recette non trouvée</div>;

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Modifier la recette</h1>
      <RecipeForm initialData={initialData} onSubmit={handleSubmit} />
    </div>
  );
}
