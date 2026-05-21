"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus, Upload } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { CategoryRecipe, State } from "@/src/types/recipe";

// Enums
const categoryValues: CategoryRecipe[] = [
  "Entree",
  "PlatPrincipal",
  "Dessert",
  "Apéritif",
  "Boisson",
  "Accompagnement",
  "Sauce",
  "Autre",
];
const countryValues: State[] = [
  "France",
  "Italie",
  "Espagne",
  "Japon",
  "Inde",
  "Chine",
  "Thai",
  "Asie",
  "AmeriqueLatine",
  "Afrique",
  "Magreb",
  "Autre",
];

const categoryEnum = z.enum(categoryValues as [string, ...string[]]);
const countryEnum = z.enum(countryValues as [string, ...string[]]);

// Schémas
const ingredientSchema = z.object({
  name: z.string().min(1, "Nom requis"),
  quantity: z.string().min(1, "Quantité requise"),
  unit: z.string().min(1, "Unité requise"),
});

const stepSchema = z.object({
  instruction: z.string().min(1, "Instruction requise"),
  images: z.array(z.string()).optional(),
});

const tagSchema = z.object({
  name: z.string().min(1, "Nom requis"),
  slug: z.string().min(1, "Slug requis"),
});

const recipeFormSchema = z.object({
  title: z.string().min(1, "Titre requis"),
  slug: z.string().min(1, "Slug requis"),
  description: z.string().min(1, "Description requise"),
  category: categoryEnum,
  country: countryEnum,
  prepTime: z.string().min(1, "Temps préparation requis"),
  cookTime: z.string().min(1, "Temps cuisson requis"),
  servings: z.string().min(1, "Nombre de personnes requis"),
  difficulty: z.string().min(1, "Difficulté requise"),
  tips: z.string().optional(),
  mainImage: z.string().min(1, "Image principale requise"),
  ingredients: z.array(ingredientSchema).min(1),
  steps: z.array(stepSchema).min(1),
  tags: z.array(tagSchema).min(1),
});

export type RecipeFormValues = z.infer<typeof recipeFormSchema>;

type RecipeFormProps = {
  initialData?: Partial<RecipeFormValues>;
  onSubmit: (data: RecipeFormValues) => Promise<void>;
};

// Génération de slug
const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

// Conversion fichier -> base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export function RecipeForm({ initialData, onSubmit }: RecipeFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");

  const form = useForm<RecipeFormValues>({
    resolver: zodResolver(recipeFormSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      category: "PlatPrincipal",
      country: "France",
      prepTime: "30", // valeur par défaut
      cookTime: "20", // valeur par défaut
      servings: "4", // valeur par défaut
      difficulty: "moyenne", // valeur par défaut
      tips: "",
      mainImage: "",
      ingredients: [{ name: "", quantity: "", unit: "" }],
      steps: [{ instruction: "", images: [] }],
      tags: [{ name: "", slug: "" }],
      ...initialData,
    },
  });

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const titleValue = watch("title");
  const slugValue = watch("slug");

  // Auto-slug
  useEffect(() => {
    if (
      titleValue &&
      (!slugValue || slugValue === generateSlug(initialData?.title || ""))
    ) {
      setValue("slug", generateSlug(titleValue), { shouldValidate: true });
    }
  }, [titleValue, slugValue, initialData?.title, setValue]);

  // Prévisualisation
  useEffect(() => {
    if (initialData?.mainImage) setImagePreview(initialData.mainImage);
  }, [initialData]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("L'image ne doit pas dépasser 5 Mo");
      return;
    }
    const base64 = await fileToBase64(file);
    setValue("mainImage", base64, { shouldValidate: true });
    setImagePreview(base64);
  };

  const ingredientFields = useFieldArray({ control, name: "ingredients" });
  const stepFields = useFieldArray({ control, name: "steps" });
  const tagFields = useFieldArray({ control, name: "tags" });

  const submit = async (data: RecipeFormValues) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
      router.push("/admin/recipes");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-8">
      {/* Informations générales */}
      <Card>
        <CardHeader>
          <CardTitle>Informations générales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Titre *</Label>
            <Input id="title" {...register("title")} />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="slug">Slug (URL) *</Label>
            <Input id="slug" {...register("slug")} />
            <p className="text-xs text-muted-foreground">
              Généré automatiquement depuis le titre
            </p>
            {errors.slug && (
              <p className="text-red-500 text-sm">{errors.slug.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea id="description" {...register("description")} />
            {errors.description && (
              <p className="text-red-500 text-sm">
                {errors.description.message}
              </p>
            )}
          </div>

          <div>
            <Label>Image principale *</Label>
            <div className="flex gap-2 items-start">
              <Input
                type="text"
                placeholder="URL de l'image"
                {...register("mainImage")}
                className="flex-1"
              />
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <Button type="button" variant="outline" className="gap-2">
                  <Upload className="w-4 h-4" /> Parcourir
                </Button>
              </div>
            </div>
            {errors.mainImage && (
              <p className="text-red-500 text-sm">{errors.mainImage.message}</p>
            )}
            {imagePreview && (
              <div className="mt-2 relative w-32 h-32">
                <img
                  src={imagePreview}
                  alt="Aperçu"
                  className="object-cover rounded w-full h-full"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="prepTime">Préparation (min) *</Label>
              <Input id="prepTime" type="number" {...register("prepTime")} />
              {errors.prepTime && (
                <p className="text-red-500 text-sm">
                  {errors.prepTime.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="cookTime">Cuisson (min) *</Label>
              <Input id="cookTime" type="number" {...register("cookTime")} />
              {errors.cookTime && (
                <p className="text-red-500 text-sm">
                  {errors.cookTime.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="servings">Nombre de personnes *</Label>
              <Input id="servings" type="number" {...register("servings")} />
              {errors.servings && (
                <p className="text-red-500 text-sm">
                  {errors.servings.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="difficulty">Difficulté *</Label>
              <Input
                id="difficulty"
                placeholder="facile, moyenne, difficile"
                {...register("difficulty")}
              />
              {errors.difficulty && (
                <p className="text-red-500 text-sm">
                  {errors.difficulty.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Catégorie *</Label>
              <Select
                onValueChange={(val) =>
                  setValue("category", val as CategoryRecipe)
                }
                defaultValue={form.getValues("category")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir" />
                </SelectTrigger>
                <SelectContent>
                  {categoryValues.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-red-500 text-sm">
                  {errors.category.message}
                </p>
              )}
            </div>
            <div>
              <Label>Pays *</Label>
              <Select
                onValueChange={(val) => setValue("country", val as State)}
                defaultValue={form.getValues("country")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir" />
                </SelectTrigger>
                <SelectContent>
                  {countryValues.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.country && (
                <p className="text-red-500 text-sm">{errors.country.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="tips">Astuce (optionnel)</Label>
            <Textarea id="tips" {...register("tips")} />
          </div>
        </CardContent>
      </Card>

      {/* Ingrédients */}
      <Card>
        <CardHeader className="flex flex-row justify-between">
          <CardTitle>Ingrédients</CardTitle>
          <Button
            type="button"
            onClick={() =>
              ingredientFields.append({ name: "", quantity: "", unit: "" })
            }
          >
            <Plus className="w-4 h-4 mr-2" /> Ajouter
          </Button>
        </CardHeader>
        <CardContent className="space-y-2">
          {ingredientFields.fields.map((field, idx) => (
            <div key={field.id} className="flex gap-2 items-end">
              <div className="flex-1">
                <Label>Nom</Label>
                <Input
                  {...register(`ingredients.${idx}.name`)}
                  placeholder="Ex: Poulet"
                />
              </div>
              <div className="w-24">
                <Label>Quantité</Label>
                <Input
                  {...register(`ingredients.${idx}.quantity`)}
                  placeholder="1.5"
                />
              </div>
              <div className="w-28">
                <Label>Unité</Label>
                <Input
                  {...register(`ingredients.${idx}.unit`)}
                  placeholder="kg, g, cc"
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                onClick={() => ingredientFields.remove(idx)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Étapes */}
      <Card>
        <CardHeader className="flex justify-between">
          <CardTitle>Étapes</CardTitle>
          <Button
            type="button"
            onClick={() => stepFields.append({ instruction: "", images: [] })}
          >
            <Plus className="w-4 h-4 mr-2" /> Ajouter
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {stepFields.fields.map((field, idx) => (
            <div key={field.id} className="relative border p-4 rounded">
              <Label>Étape {idx + 1}</Label>
              <Textarea
                {...register(`steps.${idx}.instruction`)}
                placeholder="Description de l'étape"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => stepFields.remove(idx)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Tags */}
      <Card>
        <CardHeader className="flex justify-between">
          <CardTitle>Tags</CardTitle>
          <Button
            type="button"
            onClick={() => tagFields.append({ name: "", slug: "" })}
          >
            <Plus className="w-4 h-4 mr-2" /> Ajouter
          </Button>
        </CardHeader>
        <CardContent className="space-y-2">
          {tagFields.fields.map((field, idx) => (
            <div key={field.id} className="flex gap-2 items-end">
              <div className="flex-1">
                <Label>Nom du tag</Label>
                <Input
                  {...register(`tags.${idx}.name`)}
                  placeholder="Ex: Plat principal"
                />
              </div>
              <div className="flex-1">
                <Label>Slug</Label>
                <Input
                  {...register(`tags.${idx}.slug`)}
                  placeholder="plat-principal"
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                onClick={() => tagFields.remove(idx)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Annuler
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading
            ? "Enregistrement..."
            : initialData
              ? "Mettre à jour"
              : "Créer"}
        </Button>
      </div>
    </form>
  );
}
