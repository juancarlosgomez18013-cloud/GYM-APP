"use client";

import { useState, useCallback, useEffect } from "react";
import { Search, Clock, TrendingUp, X, PlusCircle, User } from "lucide-react";
import Link from "next/link";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FoodSearchBar } from "@/components/food/FoodSearchBar";
import { FoodCard } from "@/components/food/FoodCard";
import { FoodDetailModal } from "@/components/food/FoodDetailModal";
import { useCustomFoodsStore } from "@/stores/custom-foods-store";
import type { FoodItem } from "@/types/food";

// Mock food database for demo purposes
const MOCK_FOODS: FoodItem[] = [
  {
    id: "1",
    name: "Chicken Breast (Grilled)",
    brand: "Generic",
    source: "usda",
    nutrients: { calories: 165, protein: 31, carbohydrates: 0, fat: 3.6, fiber: 0, sugar: 0 },
    servingSize: 100,
    servingSizeUnit: "g",
    servingDescription: "100g cooked",
    foodCategory: "Poultry",
  },
  {
    id: "2",
    name: "Brown Rice (Cooked)",
    brand: "Generic",
    source: "usda",
    nutrients: { calories: 123, protein: 2.7, carbohydrates: 25.6, fat: 1, fiber: 1.6, sugar: 0.4 },
    servingSize: 100,
    servingSizeUnit: "g",
    servingDescription: "100g cooked",
    foodCategory: "Grains",
  },
  {
    id: "3",
    name: "Banana",
    source: "usda",
    nutrients: { calories: 89, protein: 1.1, carbohydrates: 22.8, fat: 0.3, fiber: 2.6, sugar: 12.2 },
    servingSize: 118,
    servingSizeUnit: "g",
    servingDescription: "1 medium (118g)",
    foodCategory: "Fruits",
  },
  {
    id: "4",
    name: "Greek Yogurt (Non-Fat)",
    brand: "Fage",
    source: "open_food_facts",
    nutrients: { calories: 59, protein: 10, carbohydrates: 3.6, fat: 0.7, fiber: 0, sugar: 3.2 },
    servingSize: 100,
    servingSizeUnit: "g",
    servingDescription: "100g",
    foodCategory: "Dairy",
  },
  {
    id: "5",
    name: "Salmon (Atlantic, Cooked)",
    brand: "Generic",
    source: "usda",
    nutrients: { calories: 208, protein: 20, carbohydrates: 0, fat: 13.4, fiber: 0, sugar: 0 },
    servingSize: 100,
    servingSizeUnit: "g",
    servingDescription: "100g cooked",
    foodCategory: "Seafood",
  },
  {
    id: "6",
    name: "Oatmeal (Instant)",
    brand: "Quaker",
    source: "open_food_facts",
    nutrients: { calories: 158, protein: 5.5, carbohydrates: 27, fat: 3.2, fiber: 4, sugar: 1.1 },
    servingSize: 40,
    servingSizeUnit: "g",
    servingDescription: "1 packet (40g dry)",
    foodCategory: "Grains",
  },
  {
    id: "7",
    name: "Eggs (Whole, Large)",
    source: "usda",
    nutrients: { calories: 143, protein: 12.6, carbohydrates: 0.7, fat: 9.5, fiber: 0, sugar: 0.4 },
    servingSize: 100,
    servingSizeUnit: "g",
    servingDescription: "2 large eggs (100g)",
    foodCategory: "Eggs",
  },
  {
    id: "8",
    name: "Sweet Potato (Baked)",
    source: "usda",
    nutrients: { calories: 90, protein: 2, carbohydrates: 20.7, fat: 0.1, fiber: 3.3, sugar: 6.5 },
    servingSize: 100,
    servingSizeUnit: "g",
    servingDescription: "100g baked",
    foodCategory: "Vegetables",
  },
  {
    id: "9",
    name: "Almonds (Raw)",
    brand: "Blue Diamond",
    source: "open_food_facts",
    nutrients: { calories: 579, protein: 21.2, carbohydrates: 21.7, fat: 49.9, fiber: 12.5, sugar: 4.4 },
    servingSize: 28,
    servingSizeUnit: "g",
    servingDescription: "1 oz (28g)",
    foodCategory: "Nuts",
  },
  {
    id: "10",
    name: "Whey Protein Isolate",
    brand: "Optimum Nutrition",
    source: "open_food_facts",
    nutrients: { calories: 120, protein: 24, carbohydrates: 3, fat: 1, fiber: 0, sugar: 1 },
    servingSize: 31,
    servingSizeUnit: "g",
    servingDescription: "1 scoop (31g)",
    foodCategory: "Supplements",
  },
  {
    id: "11",
    name: "Broccoli (Steamed)",
    source: "usda",
    nutrients: { calories: 35, protein: 2.4, carbohydrates: 7.2, fat: 0.4, fiber: 3.3, sugar: 1.4 },
    servingSize: 100,
    servingSizeUnit: "g",
    servingDescription: "100g steamed",
    foodCategory: "Vegetables",
  },
  {
    id: "12",
    name: "Avocado",
    source: "usda",
    nutrients: { calories: 160, protein: 2, carbohydrates: 8.5, fat: 14.7, fiber: 6.7, sugar: 0.7 },
    servingSize: 100,
    servingSizeUnit: "g",
    servingDescription: "100g (about 2/3 avocado)",
    foodCategory: "Fruits",
  },
  {
    id: "13",
    name: "Cottage Cheese (Low-Fat)",
    brand: "Daisy",
    source: "open_food_facts",
    nutrients: { calories: 72, protein: 12, carbohydrates: 2.7, fat: 1, fiber: 0, sugar: 2.7 },
    servingSize: 100,
    servingSizeUnit: "g",
    servingDescription: "1/2 cup (113g)",
    foodCategory: "Dairy",
  },
  {
    id: "14",
    name: "Ground Turkey (93% Lean)",
    brand: "Butterball",
    source: "open_food_facts",
    nutrients: { calories: 170, protein: 21, carbohydrates: 0, fat: 9, fiber: 0, sugar: 0 },
    servingSize: 112,
    servingSizeUnit: "g",
    servingDescription: "4 oz (112g) cooked",
    foodCategory: "Poultry",
  },
  {
    id: "15",
    name: "Peanut Butter (Natural)",
    brand: "Smucker's",
    source: "open_food_facts",
    nutrients: { calories: 190, protein: 7, carbohydrates: 7, fat: 16, fiber: 2, sugar: 3 },
    servingSize: 32,
    servingSizeUnit: "g",
    servingDescription: "2 tbsp (32g)",
    foodCategory: "Nut Butters",
  },
];

const RECENT_SEARCHES_KEY = "gymfuel-recent-searches";

function getRecentSearches(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveRecentSearch(query: string) {
  if (typeof window === "undefined" || !query.trim()) return;
  try {
    const searches = getRecentSearches();
    const filtered = searches.filter(
      (s) => s.toLowerCase() !== query.toLowerCase()
    );
    const updated = [query, ...filtered].slice(0, 8);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  } catch {
    // Silently ignore localStorage errors
  }
}

function removeRecentSearch(query: string) {
  if (typeof window === "undefined") return;
  try {
    const searches = getRecentSearches();
    const updated = searches.filter(
      (s) => s.toLowerCase() !== query.toLowerCase()
    );
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  } catch {
    // Silently ignore
  }
}

export default function FoodSearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FoodItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const customFoods = useCustomFoodsStore((s) => s.foods);

  // Load recent searches on mount
  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

  const handleSearch = useCallback((searchQuery: string) => {
    setQuery(searchQuery);

    if (!searchQuery.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    // Simulate API delay then search mock data + custom foods
    const timer = setTimeout(() => {
      const q = searchQuery.toLowerCase();

      // Search both mock DB and custom foods
      const customFoodsNow = useCustomFoodsStore.getState().foods;
      const allFoods = [...customFoodsNow, ...MOCK_FOODS];

      const filtered = allFoods.filter(
        (food) =>
          food.name.toLowerCase().includes(q) ||
          food.brand?.toLowerCase().includes(q) ||
          food.foodCategory?.toLowerCase().includes(q)
      );
      setResults(filtered);
      setIsLoading(false);

      // Save to recent searches
      saveRecentSearch(searchQuery);
      setRecentSearches(getRecentSearches());
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  const handleSelectFood = useCallback((food: FoodItem) => {
    setSelectedFood(food);
    setIsDetailOpen(true);
  }, []);

  const handleRecentSearchClick = (search: string) => {
    handleSearch(search);
  };

  const handleRemoveRecent = (search: string) => {
    removeRecentSearch(search);
    setRecentSearches(getRecentSearches());
  };

  return (
    <PageContainer>
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Search className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Food Search</h1>
            <p className="text-sm text-muted-foreground">
              Find nutrition info for any food
            </p>
          </div>
        </div>
        <Link href="/food-search/add">
          <Button variant="outline" size="sm">
            <PlusCircle className="mr-1.5 h-4 w-4" />
            Custom
          </Button>
        </Link>
      </div>

      {/* Search bar */}
      <div className="mb-4">
        <FoodSearchBar onSearch={handleSearch} isLoading={isLoading} />
      </div>

      {/* My Foods section (when custom foods exist and no search) */}
      {!query && customFoods.length > 0 && (
        <div className="mb-6">
          <div className="mb-2 flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">
              My Custom Foods
            </span>
            <Badge variant="secondary" className="text-[10px]">
              {customFoods.length}
            </Badge>
          </div>
          <div className="flex flex-col gap-2">
            {customFoods.slice(0, 5).map((food) => (
              <FoodCard key={food.id} food={food} onSelect={handleSelectFood} />
            ))}
            {customFoods.length > 5 && (
              <p className="text-center text-xs text-muted-foreground">
                Search to see all {customFoods.length} custom foods
              </p>
            )}
          </div>
        </div>
      )}

      {/* Recent searches (shown when no query) */}
      {!query && recentSearches.length > 0 && (
        <div className="mb-6">
          <div className="mb-2 flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">
              Recent Searches
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((search) => (
              <div
                key={search}
                className="flex items-center gap-1 rounded-full bg-muted px-3 py-1.5"
              >
                <button
                  className="text-xs text-foreground hover:text-primary transition-colors"
                  onClick={() => handleRecentSearchClick(search)}
                >
                  {search}
                </button>
                <button
                  className="ml-1 text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => handleRemoveRecent(search)}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Popular suggestions when no query */}
      {!query && !hasSearched && (
        <div>
          <div className="mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">
              Popular Foods
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {MOCK_FOODS.slice(0, 5).map((food) => (
              <FoodCard key={food.id} food={food} onSelect={handleSelectFood} />
            ))}
          </div>
        </div>
      )}

      {/* Search results */}
      {hasSearched && !isLoading && (
        <div>
          {results.length > 0 ? (
            <div className="flex flex-col gap-2">
              <p className="mb-1 text-xs text-muted-foreground">
                {results.length} result{results.length !== 1 ? "s" : ""} for
                &quot;{query}&quot;
              </p>
              {results.map((food) => (
                <FoodCard
                  key={food.id}
                  food={food}
                  onSelect={handleSelectFood}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted/50">
                <Search className="h-8 w-8 text-muted-foreground/50" />
              </div>
              <h3 className="mt-4 font-medium text-foreground">
                No results found
              </h3>
              <p className="mt-1 text-center text-sm text-muted-foreground">
                Try a different search term or add it manually
              </p>
              <Link href="/food-search/add" className="mt-4">
                <Button variant="outline" size="sm">
                  <PlusCircle className="mr-1.5 h-4 w-4" />
                  Add Custom Food
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Loading skeleton */}
      {isLoading && (
        <div className="flex flex-col gap-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
            >
              <div className="h-12 w-12 animate-pulse rounded-full bg-muted" />
              <div className="flex-1">
                <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                <div className="mt-2 h-3 w-1/2 animate-pulse rounded bg-muted" />
              </div>
              <div className="flex gap-2">
                <div className="h-8 w-8 animate-pulse rounded bg-muted" />
                <div className="h-8 w-8 animate-pulse rounded bg-muted" />
                <div className="h-8 w-8 animate-pulse rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Food detail modal */}
      <FoodDetailModal
        food={selectedFood}
        open={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />
    </PageContainer>
  );
}
