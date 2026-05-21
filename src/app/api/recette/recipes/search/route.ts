// app/api/recipes/search/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";
  const recipes = await prisma.recipe.findMany({
    where: {
      OR: [
        { title: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        {
          ingredients: {
            some: {
              ingredient: { name: { contains: q, mode: "insensitive" } },
            },
          },
        },
      ],
    },
    include: { images: true, tags: { include: { tag: true } } },
    take: 20,
  });
  return NextResponse.json(recipes);
}
