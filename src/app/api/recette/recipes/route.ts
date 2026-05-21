// app/api/recipes/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import type { RecipeFormValues } from "@/src/components/recipes/RecipeForm";
import type {
  CategoryRecipe,
  State,
} from "../../../../generated/prisma/client";

// Fonction utilitaire pour générer un slug unique
async function generateUniqueSlug(baseSlug: string): Promise<string> {
  let slug = baseSlug;
  let counter = 1;
  while (await prisma.recipe.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter++}`;
  }
  return slug;
}

// GET /api/recipes
export async function GET() {
  try {
    const recipes = await prisma.recipe.findMany({
      include: {
        images: true,
        ingredients: {
          include: { ingredient: true },
          orderBy: { order: "asc" },
        },
        steps: { include: { images: true }, orderBy: { order: "asc" } },
        tags: { include: { tag: true } },
      },
      orderBy: { order: "asc" },
    });
    return NextResponse.json(recipes);
  } catch (error) {
    console.error("GET /api/recipes error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// POST /api/recipes
export async function POST(request: Request) {
  try {
    const body: RecipeFormValues = await request.json();
    let {
      // eslint-disable-next-line prefer-const
      title,
      slug,
      // eslint-disable-next-line prefer-const
      description,
      // eslint-disable-next-line prefer-const
      category,
      // eslint-disable-next-line prefer-const
      country,
      // eslint-disable-next-line prefer-const
      prepTime,
      // eslint-disable-next-line prefer-const
      cookTime,
      // eslint-disable-next-line prefer-const
      servings,
      // eslint-disable-next-line prefer-const
      difficulty,
      // eslint-disable-next-line prefer-const
      tips,
      // eslint-disable-next-line prefer-const
      mainImage,
      // eslint-disable-next-line prefer-const
      ingredients,
      // eslint-disable-next-line prefer-const
      steps,
      // eslint-disable-next-line prefer-const
      tags,
    } = body;

    // Vérifier l'unicité du slug et le rendre unique si nécessaire
    const existing = await prisma.recipe.findUnique({ where: { slug } });
    if (existing) {
      slug = await generateUniqueSlug(slug);
    }

    const totalTime = parseInt(prepTime) + parseInt(cookTime);

    const recipe = await prisma.$transaction(async (tx) => {
      const newRecipe = await tx.recipe.create({
        data: {
          title,
          slug,
          description,
          category: category as CategoryRecipe,
          country: country as State,
          prepTime: parseInt(prepTime),
          cookTime: parseInt(cookTime),
          totalTime,
          servings: parseInt(servings),
          difficulty,
          tips: tips || null,
        },
      });

      // Image principale
      await tx.image.create({
        data: { url: mainImage, isMain: true, recipeId: newRecipe.id },
      });

      // Ingrédients
      for (let idx = 0; idx < ingredients.length; idx++) {
        const ing = ingredients[idx];
        let ingredient = await tx.ingredient.findUnique({
          where: { name: ing.name },
        });
        if (!ingredient) {
          ingredient = await tx.ingredient.create({ data: { name: ing.name } });
        }
        await tx.recipeIngredient.create({
          data: {
            recipeId: newRecipe.id,
            ingredientId: ingredient.id,
            quantity: parseFloat(ing.quantity),
            unit: ing.unit,
            order: idx,
          },
        });
      }

      // Étapes
      for (let idx = 0; idx < steps.length; idx++) {
        const step = steps[idx];
        const newStep = await tx.step.create({
          data: {
            order: idx + 1,
            instruction: step.instruction,
            recipeId: newRecipe.id,
          },
        });
        if (step.images?.length) {
          await tx.stepImage.createMany({
            data: step.images.map((url: string) => ({
              url,
              stepId: newStep.id,
            })),
          });
        }
      }

      // Tags
      for (const tag of tags) {
        let existingTag = await tx.tag.findUnique({
          where: { slug: tag.slug },
        });
        if (!existingTag) {
          existingTag = await tx.tag.create({
            data: { name: tag.name, slug: tag.slug },
          });
        }
        await tx.tagOnRecipe.create({
          data: { recipeId: newRecipe.id, tagId: existingTag.id },
        });
      }

      return newRecipe;
    });

    return NextResponse.json(recipe, { status: 201 });
  } catch (error) {
    console.error("POST /api/recipes error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création" },
      { status: 500 },
    );
  }
}
