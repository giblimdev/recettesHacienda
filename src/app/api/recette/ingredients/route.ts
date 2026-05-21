// app/api/ingredients/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";
  const ingredients = await prisma.ingredient.findMany({
    where: { name: { contains: q, mode: "insensitive" } },
    take: 10,
    orderBy: { name: "asc" },
  });
  return NextResponse.json(ingredients);
}
