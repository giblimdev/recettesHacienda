// @/api/recipes/by-slug/[slug]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/src//lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } },
) {
  const recipe = await prisma.recipe.findUnique({
    where: { slug: params.slug },
    include: {
      images: true,
      ingredients: { include: { ingredient: true }, orderBy: { order: "asc" } },
      steps: { include: { images: true }, orderBy: { order: "asc" } },
      tags: { include: { tag: true } },
    },
  });
  if (!recipe)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(recipe);
}
