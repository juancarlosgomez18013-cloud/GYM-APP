"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  BookOpen,
  Clock,
  Flame,
  Dumbbell,
  Wheat,
  Zap,
  Filter,
} from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

// ─── Recipe type for this page ────────────────────────────────
interface Recipe {
  id: string;
  name: string;
  description: string;
  cuisineFlag: string;
  cuisineName: string;
  category: string;
  prepTimeMin: number;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  tags: string[];
}

// ─── Fallback recipe data ─────────────────────────────────────
const FALLBACK_RECIPES: Recipe[] = [
  {
    id: "r-1",
    name: "Greek Yogurt Protein Bowl",
    description:
      "Creamy Greek yogurt with berries, granola, and a drizzle of honey.",
    cuisineFlag: "\u{1F1FA}\u{1F1F8}",
    cuisineName: "American",
    category: "breakfast",
    prepTimeMin: 5,
    calories: 320,
    protein: 28,
    carbohydrates: 38,
    fat: 8,
    tags: ["quick", "high_protein", "breakfast"],
  },
  {
    id: "r-2",
    name: "Scrambled Eggs with Avocado Toast",
    description: "Fluffy scrambled eggs on whole-grain toast with mashed avocado.",
    cuisineFlag: "\u{1F1FA}\u{1F1F8}",
    cuisineName: "American",
    category: "breakfast",
    prepTimeMin: 10,
    calories: 420,
    protein: 22,
    carbohydrates: 30,
    fat: 24,
    tags: ["breakfast", "high_protein"],
  },
  {
    id: "r-3",
    name: "Overnight Protein Oats",
    description: "Oats soaked overnight with protein powder, chia seeds, and almond milk.",
    cuisineFlag: "\u{1F1FA}\u{1F1F8}",
    cuisineName: "American",
    category: "breakfast",
    prepTimeMin: 5,
    calories: 350,
    protein: 30,
    carbohydrates: 42,
    fat: 8,
    tags: ["quick", "high_protein", "breakfast"],
  },
  {
    id: "r-4",
    name: "Grilled Chicken Caesar Salad",
    description: "Crisp romaine with grilled chicken breast, parmesan, and light Caesar dressing.",
    cuisineFlag: "\u{1F1EE}\u{1F1F9}",
    cuisineName: "Italian",
    category: "lunch",
    prepTimeMin: 15,
    calories: 450,
    protein: 42,
    carbohydrates: 18,
    fat: 22,
    tags: ["lunch", "high_protein", "low_carb"],
  },
  {
    id: "r-5",
    name: "Quinoa Buddha Bowl",
    description: "Fluffy quinoa with roasted veggies, chickpeas, and tahini dressing.",
    cuisineFlag: "\u{1F1FA}\u{1F1F8}",
    cuisineName: "American",
    category: "lunch",
    prepTimeMin: 25,
    calories: 480,
    protein: 22,
    carbohydrates: 58,
    fat: 16,
    tags: ["lunch"],
  },
  {
    id: "r-6",
    name: "Salmon Poke Bowl",
    description: "Fresh salmon cubes with sushi rice, edamame, avocado, and ponzu sauce.",
    cuisineFlag: "\u{1F1EF}\u{1F1F5}",
    cuisineName: "Japanese",
    category: "lunch",
    prepTimeMin: 15,
    calories: 520,
    protein: 35,
    carbohydrates: 48,
    fat: 18,
    tags: ["lunch", "high_protein"],
  },
  {
    id: "r-7",
    name: "Turkey Lettuce Wraps",
    description: "Seasoned ground turkey in crisp lettuce cups with Asian-inspired sauce.",
    cuisineFlag: "\u{1F1F9}\u{1F1ED}",
    cuisineName: "Thai",
    category: "lunch",
    prepTimeMin: 15,
    calories: 340,
    protein: 32,
    carbohydrates: 12,
    fat: 18,
    tags: ["lunch", "low_carb", "quick", "high_protein"],
  },
  {
    id: "r-8",
    name: "Grilled Salmon with Asparagus",
    description: "Herb-crusted salmon fillet with roasted asparagus and lemon.",
    cuisineFlag: "\u{1F1F3}\u{1F1F4}",
    cuisineName: "Scandinavian",
    category: "dinner",
    prepTimeMin: 20,
    calories: 480,
    protein: 42,
    carbohydrates: 12,
    fat: 28,
    tags: ["dinner", "high_protein", "low_carb"],
  },
  {
    id: "r-9",
    name: "Chicken Stir-Fry",
    description: "Tender chicken with colorful vegetables in a light soy-ginger sauce over rice.",
    cuisineFlag: "\u{1F1E8}\u{1F1F3}",
    cuisineName: "Chinese",
    category: "dinner",
    prepTimeMin: 20,
    calories: 460,
    protein: 35,
    carbohydrates: 48,
    fat: 14,
    tags: ["dinner", "high_protein"],
  },
  {
    id: "r-10",
    name: "Lean Beef Tacos",
    description: "Seasoned lean ground beef in corn tortillas with fresh salsa and guacamole.",
    cuisineFlag: "\u{1F1F2}\u{1F1FD}",
    cuisineName: "Mexican",
    category: "dinner",
    prepTimeMin: 20,
    calories: 500,
    protein: 38,
    carbohydrates: 35,
    fat: 22,
    tags: ["dinner", "high_protein"],
  },
  {
    id: "r-11",
    name: "Shrimp and Vegetable Curry",
    description: "Coconut milk curry with shrimp, bell peppers, and spinach over basmati rice.",
    cuisineFlag: "\u{1F1EE}\u{1F1F3}",
    cuisineName: "Indian",
    category: "dinner",
    prepTimeMin: 25,
    calories: 460,
    protein: 30,
    carbohydrates: 42,
    fat: 18,
    tags: ["dinner"],
  },
  {
    id: "r-12",
    name: "Baked Cod with Sweet Potato",
    description: "Lemon-herb baked cod fillet with roasted sweet potato wedges.",
    cuisineFlag: "\u{1F1EC}\u{1F1E7}",
    cuisineName: "British",
    category: "dinner",
    prepTimeMin: 30,
    calories: 420,
    protein: 36,
    carbohydrates: 40,
    fat: 10,
    tags: ["dinner", "high_protein"],
  },
  {
    id: "r-13",
    name: "Protein Bar (Homemade)",
    description: "No-bake protein bars with oats, protein powder, peanut butter, and dark chocolate.",
    cuisineFlag: "\u{1F1FA}\u{1F1F8}",
    cuisineName: "American",
    category: "snack",
    prepTimeMin: 15,
    calories: 220,
    protein: 20,
    carbohydrates: 22,
    fat: 8,
    tags: ["snack", "high_protein", "quick"],
  },
  {
    id: "r-14",
    name: "Cottage Cheese with Berries",
    description: "Fresh cottage cheese topped with mixed berries and a sprinkle of cinnamon.",
    cuisineFlag: "\u{1F1FA}\u{1F1F8}",
    cuisineName: "American",
    category: "snack",
    prepTimeMin: 3,
    calories: 160,
    protein: 18,
    carbohydrates: 14,
    fat: 4,
    tags: ["snack", "quick", "high_protein", "low_carb"],
  },
  {
    id: "r-15",
    name: "Energy Balls",
    description: "Date and nut energy balls rolled in coconut with a hint of cocoa.",
    cuisineFlag: "\u{1F1E6}\u{1F1FA}",
    cuisineName: "Australian",
    category: "snack",
    prepTimeMin: 10,
    calories: 180,
    protein: 6,
    carbohydrates: 22,
    fat: 10,
    tags: ["snack", "quick"],
  },
  {
    id: "r-16",
    name: "Chicken Tikka Masala",
    description: "Tender chicken in a rich, creamy tomato-spice sauce served with basmati rice.",
    cuisineFlag: "\u{1F1EE}\u{1F1F3}",
    cuisineName: "Indian",
    category: "dinner",
    prepTimeMin: 35,
    calories: 540,
    protein: 38,
    carbohydrates: 48,
    fat: 20,
    tags: ["dinner", "high_protein"],
  },
  {
    id: "r-17",
    name: "Bibimbap",
    description: "Korean rice bowl with sauteed vegetables, beef, egg, and gochujang sauce.",
    cuisineFlag: "\u{1F1F0}\u{1F1F7}",
    cuisineName: "Korean",
    category: "lunch",
    prepTimeMin: 25,
    calories: 510,
    protein: 30,
    carbohydrates: 55,
    fat: 16,
    tags: ["lunch", "high_protein"],
  },
  {
    id: "r-18",
    name: "Acai Smoothie Bowl",
    description: "Thick acai blend topped with granola, banana slices, and coconut flakes.",
    cuisineFlag: "\u{1F1E7}\u{1F1F7}",
    cuisineName: "Brazilian",
    category: "breakfast",
    prepTimeMin: 5,
    calories: 310,
    protein: 10,
    carbohydrates: 52,
    fat: 8,
    tags: ["breakfast", "quick"],
  },
];

const CATEGORIES = [
  { label: "All", value: "all", icon: BookOpen },
  { label: "Breakfast", value: "breakfast", icon: Flame },
  { label: "Lunch", value: "lunch", icon: Flame },
  { label: "Dinner", value: "dinner", icon: Flame },
  { label: "Snack", value: "snack", icon: Flame },
  { label: "Quick", value: "quick", icon: Zap },
  { label: "High Protein", value: "high_protein", icon: Dumbbell },
  { label: "Low Carb", value: "low_carb", icon: Wheat },
];

export default function RecipesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const recipes = FALLBACK_RECIPES;

  const filteredRecipes = useMemo(() => {
    let result = recipes;

    if (selectedCategory !== "all") {
      result = result.filter(
        (r) =>
          r.category === selectedCategory ||
          r.tags.includes(selectedCategory)
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.cuisineName.toLowerCase().includes(q)
      );
    }

    return result;
  }, [recipes, selectedCategory, searchQuery]);

  return (
    <PageContainer>
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Recipes</h1>
          <p className="text-xs text-muted-foreground">
            {recipes.length} healthy recipes to explore
          </p>
        </div>
        <BookOpen className="h-6 w-6 text-primary" />
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search recipes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 bg-card/80 border-border/50"
        />
      </div>

      {/* Category Filter Chips */}
      <div className="mb-4">
        <ScrollArea className="w-full">
          <div className="flex gap-2 pb-2">
            {CATEGORIES.map((cat) => (
              <Button
                key={cat.value}
                variant={
                  selectedCategory === cat.value ? "default" : "outline"
                }
                size="sm"
                className="shrink-0 gap-1 text-xs"
                onClick={() => setSelectedCategory(cat.value)}
              >
                <cat.icon className="h-3 w-3" />
                {cat.label}
              </Button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* Results count */}
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {filteredRecipes.length} recipe
          {filteredRecipes.length !== 1 ? "s" : ""} found
        </p>
        <Filter className="h-3.5 w-3.5 text-muted-foreground" />
      </div>

      {/* Recipe Grid */}
      {filteredRecipes.length === 0 ? (
        <Card className="border-dashed border-border/50 bg-card/50">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="mb-3 h-10 w-10 text-muted-foreground" />
            <p className="text-sm font-medium">No recipes found</p>
            <p className="text-xs text-muted-foreground mt-1">
              Try adjusting your search or filters
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {filteredRecipes.map((recipe) => (
            <Link
              key={recipe.id}
              href={`/recipes/${recipe.id}`}
              className="block"
            >
              <Card className="h-full border-border/50 bg-card/80 transition-all hover:border-primary/30 hover:bg-card active:scale-[0.98]">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{recipe.cuisineFlag}</span>
                      <div>
                        <p className="text-sm font-medium leading-tight">
                          {recipe.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {recipe.cuisineName}
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                    {recipe.description}
                  </p>

                  <div className="flex items-center gap-3 text-[10px] text-muted-foreground mb-2">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {recipe.prepTimeMin}m
                    </span>
                    <span className="flex items-center gap-1">
                      <Flame className="h-3 w-3 text-orange-400" />
                      {recipe.calories} cal
                    </span>
                  </div>

                  <div className="flex gap-3 text-[10px]">
                    <span className="text-blue-400">
                      P: {recipe.protein}g
                    </span>
                    <span className="text-amber-400">
                      C: {recipe.carbohydrates}g
                    </span>
                    <span className="text-rose-400">
                      F: {recipe.fat}g
                    </span>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-1">
                    {recipe.tags
                      .filter(
                        (t) =>
                          t !== recipe.category &&
                          ["quick", "high_protein", "low_carb"].includes(t)
                      )
                      .map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-[9px] px-1.5 py-0"
                        >
                          {tag.replace("_", " ")}
                        </Badge>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
