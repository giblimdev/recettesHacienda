// src/app/api/recette/recipes/by-slug/[slug]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma"; // correction du double slash

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  const recipe = await prisma.recipe.findUnique({
    where: { slug },
    include: {
      images: true,
      ingredients: { include: { ingredient: true }, orderBy: { order: "asc" } },
      steps: { include: { images: true }, orderBy: { order: "asc" } },
      tags: { include: { tag: true } },
    },
  });

  if (!recipe) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(recipe);
}
