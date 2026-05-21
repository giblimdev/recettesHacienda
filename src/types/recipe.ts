// src/types/recipe.ts

// ========================
// ENUMS (basés sur Prisma)
// ========================
export type CategoryRecipe =
  | "Entree"
  | "PlatPrincipal"
  | "Dessert"
  | "Apéritif"
  | "Boisson"
  | "Accompagnement"
  | "Sauce"
  | "Autre";

export type State =
  | "France"
  | "Italie"
  | "Espagne"
  | "Japon"
  | "Inde"
  | "Chine"
  | "Thai"
  | "Asie"
  | "AmeriqueLatine"
  | "Afrique"
  | "Magreb"
  | "Autre";

// ========================
// MODÈLES DE BASE
// ========================

export interface Image {
  id: string;
  url: string;
  isMain: boolean;
  caption?: string | null;
  recipeId: string;
  createdAt: Date;
}

export interface StepImage {
  id: string;
  url: string;
  caption?: string | null;
  stepId: string;
}

export interface Step {
  id: string;
  order: number;
  instruction: string;
  recipeId: string;
  images: StepImage[];
}

export interface Ingredient {
  id: string;
  name: string;
  category?: string | null;
}

export interface RecipeIngredient {
  quantity: number;
  unit: string;
  order?: number | null;
  ingredient: Ingredient;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface TagOnRecipe {
  tag: Tag;
}

// ========================
// RECETTE (avec relations)
// ========================
export interface Recipe {
  id: string;
  order?: number | null;
  title: string;
  slug: string;
  category: CategoryRecipe;
  description: string;
  author?: string | null;
  country: State;
  createdAt: Date;
  updatedAt: Date;
  prepTime: number;
  cookTime: number;
  totalTime: number;
  servings: number;
  difficulty: string;
  rating: number;
  ratingCount: number;
  tips?: string | null;
  searchVector?: string | null;
  // Relations (vides dans ce type de base, on les ajoute dans RecipeWithRelations)
  images?: Image[];
  ingredients?: RecipeIngredient[];
  steps?: Step[];
  tags?: TagOnRecipe[];
}

// ========================
// RECETTE AVEC TOUTES LES RELATIONS (pour les pages détail / admin)
// ========================
export interface RecipeWithRelations extends Recipe {
  images: Image[];
  ingredients: (RecipeIngredient & {
    ingredient: Ingredient;
  })[];
  steps: (Step & {
    images: StepImage[];
  })[];
  tags: {
    tag: Tag;
  }[];
}
