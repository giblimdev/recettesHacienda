// src/app/admin/[slug]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Save, Trash2, Plus, X, ArrowLeft, Eye, Edit } from "lucide-react";
import {
  getRecetteBySlug,
  type Recette,
  type RecipeIngredient,
  type Step,
} from "@/src/data/recette";

const categories = [
  "Dessert",
  "PlatPrincipal",
  "Entree",
  "Accompagnement",
  "Conserve",
  "Sauce",
];
const difficulties = ["facile", "moyenne", "difficile"];

export default function AdminRecipeSlugPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Récupérer le slug - important pour Next.js 15+
  const slug = params?.slug as string;
  const mode = searchParams?.get("mode");

  const isEditMode = mode === "edit";
  const isViewMode = !isEditMode;
  const [recette, setRecette] = useState<Recette | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modified, setModified] = useState(false);

  // Charger la recette par slug
  useEffect(() => {
    const loadRecette = async () => {
      if (!slug) {
        setLoading(false);
        return;
      }
      setLoading(true);
      // Simuler un délai API
      setTimeout(() => {
        const found = getRecetteBySlug(slug);
        if (found) {
          setRecette(JSON.parse(JSON.stringify(found)));
        }
        setLoading(false);
      }, 100);
    };
    loadRecette();
  }, [slug]);

  const markModified = () => isEditMode && setModified(true);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    if (!recette || !isEditMode) return;
    setRecette({ ...recette, [e.target.name]: e.target.value });
    markModified();
  };

  const updateIngredient = (
    index: number,
    field: keyof RecipeIngredient,
    value: string,
  ) => {
    if (!recette || !isEditMode) return;
    const newIngredients = [...recette.ingredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    setRecette({ ...recette, ingredients: newIngredients });
    markModified();
  };

  const addIngredient = () => {
    if (!recette || !isEditMode) return;
    setRecette({
      ...recette,
      ingredients: [
        ...recette.ingredients,
        { name: "", quantity: "", unit: "" },
      ],
    });
    markModified();
  };

  const removeIngredient = (index: number) => {
    if (!recette || !isEditMode) return;
    setRecette({
      ...recette,
      ingredients: recette.ingredients.filter((_, i) => i !== index),
    });
    markModified();
  };

  const updateStep = (
    index: number,
    field: keyof Step,
    value: string | number | undefined,
  ) => {
    if (!recette || !isEditMode) return;
    const newSteps = [...recette.steps];
    if (field === "duration") {
      newSteps[index] = {
        ...newSteps[index],
        duration:
          value === undefined || value === "" ? undefined : Number(value),
      };
    } else {
      newSteps[index] = { ...newSteps[index], [field]: value as string };
    }
    setRecette({ ...recette, steps: newSteps });
    markModified();
  };

  const addStep = () => {
    if (!recette || !isEditMode) return;
    const newOrder = recette.steps.length + 1;
    setRecette({
      ...recette,
      steps: [
        ...recette.steps,
        { order: newOrder, instruction: "", duration: undefined },
      ],
    });
    markModified();
  };

  const removeStep = (index: number) => {
    if (!recette || !isEditMode) return;
    const newSteps = recette.steps.filter((_, i) => i !== index);
    newSteps.forEach((step, idx) => {
      step.order = idx + 1;
    });
    setRecette({ ...recette, steps: newSteps });
    markModified();
  };

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!recette || !isEditMode) return;
    const newTitle = e.target.value;
    const newSlug = generateSlug(newTitle);
    setRecette({ ...recette, title: newTitle, slug: newSlug });
    markModified();
  };

  const handleSave = async () => {
    if (!recette || !isEditMode) return;
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Recette sauvegardée:", recette);
    setSaving(false);
    setModified(false);
    alert("Recette sauvegardée avec succès !");
    router.push(`/admin/${recette.slug}?mode=view`);
  };

  const handleDelete = async () => {
    if (!recette || !isEditMode) return;
    if (!confirm(`Êtes-vous sûr de vouloir supprimer "${recette.title}" ?`))
      return;
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Recette supprimée:", slug);
    setSaving(false);
    router.push("/admin");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Chargement...</div>
      </div>
    );
  }

  if (!recette) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-gray-500 mb-4">
          Recette non trouvée pour le slug: {slug}
        </div>
        <div className="flex gap-4">
          <Link href="/admin" className="text-blue-600 hover:underline">
            Retour à l&apos;administration
          </Link>
          <Link href="/recettes" className="text-emerald-600 hover:underline">
            Voir toutes les recettes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-gray-600 hover:text-gray-900">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditMode
              ? `✏️ Édition : ${recette.title}`
              : `👁️ Aperçu : ${recette.title}`}
          </h1>
        </div>
        <div className="flex gap-3">
          {isViewMode ? (
            <button
              onClick={() => router.push(`/admin/${recette.slug}?mode=edit`)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
            >
              <Edit size={18} />
              Modifier cette recette
            </button>
          ) : (
            <>
              <button
                onClick={() => router.push(`/admin/${recette.slug}?mode=view`)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
              >
                <Eye size={18} />
                Annuler
              </button>
              <button
                onClick={handleDelete}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition disabled:opacity-50"
              >
                <Trash2 size={18} />
                Supprimer
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !modified}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                  saving || !modified
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-emerald-600 text-white hover:bg-emerald-700"
                }`}
              >
                <Save size={18} />
                {saving ? "Sauvegarde..." : "Sauvegarder"}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Badges */}
      {isViewMode && (
        <div className="mb-4 bg-blue-100 text-blue-700 px-4 py-2 rounded-lg flex items-center gap-2">
          <Eye size={18} />
          Mode aperçu - cliquez sur &quot;Modifier cette recette&quot; pour
          éditer
        </div>
      )}
      {isEditMode && (
        <div className="mb-4 bg-yellow-100 text-yellow-700 px-4 py-2 rounded-lg flex items-center gap-2">
          <Edit size={18} />
          Mode édition - n&apos;oubliez pas de sauvegarder vos modifications
        </div>
      )}

      {/* Formulaire - continue avec le reste du JSX */}
      {/* ... (la suite de votre JSX reste identique) ... */}
      <div className="space-y-8">
        {/* Informations générales */}
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Informations générales
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Titre *
              </label>
              <input
                type="text"
                name="title"
                value={recette.title}
                onChange={handleTitleChange}
                disabled={!isEditMode}
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${
                  !isEditMode
                    ? "bg-gray-50"
                    : "focus:ring-2 focus:ring-emerald-500"
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slug
              </label>
              <input
                type="text"
                name="slug"
                value={recette.slug}
                onChange={handleChange}
                disabled={!isEditMode}
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${!isEditMode ? "bg-gray-50" : ""}`}
              />
              <p className="text-xs text-gray-400 mt-1">
                Généré automatiquement à partir du titre
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Catégorie
              </label>
              <select
                name="category"
                value={recette.category}
                onChange={handleChange}
                disabled={!isEditMode}
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${!isEditMode ? "bg-gray-50" : ""}`}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Difficulté
              </label>
              <select
                name="difficulty"
                value={recette.difficulty}
                onChange={handleChange}
                disabled={!isEditMode}
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${!isEditMode ? "bg-gray-50" : ""}`}
              >
                {difficulties.map((diff) => (
                  <option key={diff} value={diff}>
                    {diff.charAt(0).toUpperCase() + diff.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pays
              </label>
              <input
                type="text"
                name="country"
                value={recette.country}
                onChange={handleChange}
                disabled={!isEditMode}
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${!isEditMode ? "bg-gray-50" : ""}`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image (URL)
              </label>
              <input
                type="text"
                name="image"
                value={recette.image}
                onChange={handleChange}
                disabled={!isEditMode}
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${!isEditMode ? "bg-gray-50" : ""}`}
              />
              {recette.image && (
                <div className="mt-2 relative w-24 h-24 rounded-lg overflow-hidden">
                  <Image
                    src={recette.image}
                    alt="Aperçu"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={recette.description}
                onChange={handleChange}
                disabled={!isEditMode}
                rows={3}
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${!isEditMode ? "bg-gray-50" : ""}`}
              />
            </div>
          </div>
        </section>

        {/* Ingrédients */}
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Ingrédients</h2>
            {isEditMode && (
              <button
                type="button"
                onClick={addIngredient}
                className="flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700"
              >
                <Plus size={16} />
                Ajouter
              </button>
            )}
          </div>
          <div className="space-y-3">
            {recette.ingredients.map((ing, idx) => (
              <div key={idx} className="flex gap-3 items-start">
                <input
                  type="text"
                  placeholder="Nom"
                  value={ing.name}
                  onChange={(e) =>
                    updateIngredient(idx, "name", e.target.value)
                  }
                  disabled={!isEditMode}
                  className={`flex-1 px-3 py-2 border border-gray-300 rounded-lg ${!isEditMode ? "bg-gray-50" : ""}`}
                />
                <input
                  type="text"
                  placeholder="Quantité"
                  value={ing.quantity}
                  onChange={(e) =>
                    updateIngredient(idx, "quantity", e.target.value)
                  }
                  disabled={!isEditMode}
                  className={`w-24 px-3 py-2 border border-gray-300 rounded-lg ${!isEditMode ? "bg-gray-50" : ""}`}
                />
                <input
                  type="text"
                  placeholder="Unité"
                  value={ing.unit || ""}
                  onChange={(e) =>
                    updateIngredient(idx, "unit", e.target.value)
                  }
                  disabled={!isEditMode}
                  className={`w-24 px-3 py-2 border border-gray-300 rounded-lg ${!isEditMode ? "bg-gray-50" : ""}`}
                />
                {isEditMode && (
                  <button
                    type="button"
                    onClick={() => removeIngredient(idx)}
                    className="p-2 text-red-500 hover:text-red-700"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            ))}
            {recette.ingredients.length === 0 && (
              <p className="text-gray-400 text-sm italic">Aucun ingrédient</p>
            )}
          </div>
        </section>

        {/* Étapes */}
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Étapes</h2>
            {isEditMode && (
              <button
                type="button"
                onClick={addStep}
                className="flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700"
              >
                <Plus size={16} />
                Ajouter
              </button>
            )}
          </div>
          <div className="space-y-4">
            {recette.steps
              .sort((a, b) => a.order - b.order)
              .map((step, idx) => (
                <div key={idx} className="flex gap-3 items-start">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold">
                    {step.order}
                  </div>
                  <textarea
                    placeholder="Instruction..."
                    value={step.instruction}
                    onChange={(e) =>
                      updateStep(idx, "instruction", e.target.value)
                    }
                    disabled={!isEditMode}
                    rows={2}
                    className={`flex-1 px-3 py-2 border border-gray-300 rounded-lg ${!isEditMode ? "bg-gray-50" : ""}`}
                  />
                  <input
                    type="number"
                    placeholder="Durée (min)"
                    value={step.duration || ""}
                    onChange={(e) =>
                      updateStep(
                        idx,
                        "duration",
                        e.target.value === "" ? undefined : e.target.value,
                      )
                    }
                    disabled={!isEditMode}
                    className={`w-28 px-3 py-2 border border-gray-300 rounded-lg ${!isEditMode ? "bg-gray-50" : ""}`}
                  />
                  {isEditMode && (
                    <button
                      type="button"
                      onClick={() => removeStep(idx)}
                      className="p-2 text-red-500 hover:text-red-700"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              ))}
            {recette.steps.length === 0 && (
              <p className="text-gray-400 text-sm italic">
                Aucune étape de préparation
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
