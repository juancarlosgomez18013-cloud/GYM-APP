"use client";

import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { nanoid } from "nanoid";
import {
  ArrowLeft,
  Clock,
  Users,
  Flame,
  ChefHat,
  Plus,
  BookmarkPlus,
  CheckCircle2,
} from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useDailyLogStore } from "@/stores/daily-log-store";
import type { MealEntry, MealType } from "@/types/meal";
import type { FoodItem } from "@/types/food";

// ─── Full recipe detail type ──────────────────────────────────
interface RecipeDetail {
  id: string;
  name: string;
  description: string;
  cuisineFlag: string;
  cuisineName: string;
  category: MealType;
  prepTimeMin: number;
  servings: number;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber: number;
  sugar: number;
  ingredients: string[];
  instructions: string[];
  tags: string[];
}

// ─── Fallback recipe detail data ──────────────────────────────
const RECIPE_DETAILS: Record<string, RecipeDetail> = {
  "r-1": {
    id: "r-1",
    name: "Greek Yogurt Protein Bowl",
    description:
      "Creamy Greek yogurt with berries, granola, and a drizzle of honey. Packed with protein to fuel your morning workout.",
    cuisineFlag: "\u{1F1FA}\u{1F1F8}",
    cuisineName: "American",
    category: "breakfast",
    prepTimeMin: 5,
    servings: 1,
    calories: 320,
    protein: 28,
    carbohydrates: 38,
    fat: 8,
    fiber: 4,
    sugar: 18,
    ingredients: [
      "200g Greek yogurt (0% fat)",
      "1 scoop vanilla protein powder",
      "80g mixed berries (blueberries, strawberries, raspberries)",
      "30g granola",
      "1 tbsp honey",
      "1 tbsp chia seeds",
    ],
    instructions: [
      "Add Greek yogurt to a bowl and mix in the protein powder until smooth.",
      "Top with mixed berries, spreading them evenly.",
      "Sprinkle granola and chia seeds over the yogurt.",
      "Drizzle honey on top.",
      "Serve immediately and enjoy.",
    ],
    tags: ["quick", "high_protein", "breakfast"],
  },
  "r-2": {
    id: "r-2",
    name: "Scrambled Eggs with Avocado Toast",
    description:
      "Fluffy scrambled eggs on whole-grain toast with mashed avocado. A classic protein-packed breakfast.",
    cuisineFlag: "\u{1F1FA}\u{1F1F8}",
    cuisineName: "American",
    category: "breakfast",
    prepTimeMin: 10,
    servings: 1,
    calories: 420,
    protein: 22,
    carbohydrates: 30,
    fat: 24,
    fiber: 6,
    sugar: 3,
    ingredients: [
      "3 large eggs",
      "1 ripe avocado (half)",
      "2 slices whole-grain bread",
      "1 tbsp butter",
      "Salt and pepper to taste",
      "Pinch of red pepper flakes",
      "Fresh chives for garnish",
    ],
    instructions: [
      "Toast the bread slices until golden brown.",
      "Mash half an avocado with a fork, adding salt and pepper.",
      "Spread mashed avocado on each toast slice.",
      "Whisk eggs in a bowl with a pinch of salt.",
      "Heat butter in a non-stick pan over medium-low heat.",
      "Pour in eggs, gently stirring with a spatula until softly set.",
      "Place scrambled eggs on top of avocado toast.",
      "Garnish with red pepper flakes and chives.",
    ],
    tags: ["breakfast", "high_protein"],
  },
  "r-3": {
    id: "r-3",
    name: "Overnight Protein Oats",
    description:
      "Oats soaked overnight with protein powder, chia seeds, and almond milk. Grab and go in the morning.",
    cuisineFlag: "\u{1F1FA}\u{1F1F8}",
    cuisineName: "American",
    category: "breakfast",
    prepTimeMin: 5,
    servings: 1,
    calories: 350,
    protein: 30,
    carbohydrates: 42,
    fat: 8,
    fiber: 7,
    sugar: 12,
    ingredients: [
      "60g rolled oats",
      "1 scoop chocolate protein powder",
      "200ml almond milk (unsweetened)",
      "1 tbsp chia seeds",
      "1 tbsp peanut butter",
      "Half a banana, sliced",
    ],
    instructions: [
      "Combine oats, protein powder, and chia seeds in a jar.",
      "Pour in almond milk and stir well to combine.",
      "Add peanut butter and stir once more.",
      "Cover and refrigerate overnight (at least 6 hours).",
      "In the morning, top with sliced banana.",
      "Eat cold or microwave for 1-2 minutes if desired.",
    ],
    tags: ["quick", "high_protein", "breakfast"],
  },
  "r-4": {
    id: "r-4",
    name: "Grilled Chicken Caesar Salad",
    description:
      "Crisp romaine with grilled chicken breast, parmesan, and light Caesar dressing. A fitness staple.",
    cuisineFlag: "\u{1F1EE}\u{1F1F9}",
    cuisineName: "Italian",
    category: "lunch",
    prepTimeMin: 15,
    servings: 1,
    calories: 450,
    protein: 42,
    carbohydrates: 18,
    fat: 22,
    fiber: 3,
    sugar: 4,
    ingredients: [
      "200g chicken breast",
      "3 cups romaine lettuce, chopped",
      "2 tbsp light Caesar dressing",
      "20g shaved parmesan",
      "1/2 cup whole-grain croutons",
      "1 tbsp olive oil",
      "Juice of half a lemon",
      "Salt and pepper to taste",
    ],
    instructions: [
      "Season chicken breast with salt, pepper, and a squeeze of lemon.",
      "Heat olive oil in a grill pan over medium-high heat.",
      "Grill chicken for 5-6 minutes per side until cooked through.",
      "Let chicken rest for 3 minutes, then slice into strips.",
      "Toss romaine lettuce with Caesar dressing in a large bowl.",
      "Top with sliced chicken, parmesan, and croutons.",
      "Squeeze remaining lemon over the salad and serve.",
    ],
    tags: ["lunch", "high_protein", "low_carb"],
  },
  "r-5": {
    id: "r-5",
    name: "Quinoa Buddha Bowl",
    description:
      "Fluffy quinoa with roasted veggies, chickpeas, and tahini dressing. Nutrient-dense and satisfying.",
    cuisineFlag: "\u{1F1FA}\u{1F1F8}",
    cuisineName: "American",
    category: "lunch",
    prepTimeMin: 25,
    servings: 1,
    calories: 480,
    protein: 22,
    carbohydrates: 58,
    fat: 16,
    fiber: 10,
    sugar: 6,
    ingredients: [
      "100g quinoa (dry)",
      "100g canned chickpeas, drained",
      "1 cup mixed roasted vegetables (sweet potato, broccoli, bell pepper)",
      "1/2 avocado, sliced",
      "2 tbsp tahini",
      "1 tbsp lemon juice",
      "1 tbsp olive oil",
      "Salt, pepper, and paprika to taste",
    ],
    instructions: [
      "Rinse quinoa and cook according to package instructions.",
      "Toss vegetables with olive oil, salt, pepper, and paprika.",
      "Roast vegetables at 200C (400F) for 20 minutes.",
      "Season chickpeas with paprika and warm in a dry pan.",
      "Whisk tahini with lemon juice and a splash of water for dressing.",
      "Assemble bowl with quinoa as the base.",
      "Arrange roasted veggies, chickpeas, and avocado on top.",
      "Drizzle with tahini dressing and serve.",
    ],
    tags: ["lunch"],
  },
  "r-6": {
    id: "r-6",
    name: "Salmon Poke Bowl",
    description:
      "Fresh salmon cubes with sushi rice, edamame, avocado, and ponzu sauce.",
    cuisineFlag: "\u{1F1EF}\u{1F1F5}",
    cuisineName: "Japanese",
    category: "lunch",
    prepTimeMin: 15,
    servings: 1,
    calories: 520,
    protein: 35,
    carbohydrates: 48,
    fat: 18,
    fiber: 5,
    sugar: 8,
    ingredients: [
      "150g sushi-grade salmon, cubed",
      "150g sushi rice (cooked)",
      "50g edamame (shelled)",
      "1/2 avocado, sliced",
      "2 tbsp soy sauce",
      "1 tbsp rice vinegar",
      "1 tsp sesame oil",
      "1 tsp sesame seeds",
      "Pickled ginger and wasabi (optional)",
    ],
    instructions: [
      "Cook sushi rice and let it cool slightly. Season with rice vinegar.",
      "Cube the salmon into bite-size pieces.",
      "Toss salmon with soy sauce and sesame oil in a bowl.",
      "Place rice in a serving bowl.",
      "Arrange salmon, edamame, and avocado on top of the rice.",
      "Sprinkle with sesame seeds.",
      "Serve with pickled ginger and wasabi on the side.",
    ],
    tags: ["lunch", "high_protein"],
  },
  "r-7": {
    id: "r-7",
    name: "Turkey Lettuce Wraps",
    description:
      "Seasoned ground turkey in crisp lettuce cups with Asian-inspired sauce.",
    cuisineFlag: "\u{1F1F9}\u{1F1ED}",
    cuisineName: "Thai",
    category: "lunch",
    prepTimeMin: 15,
    servings: 2,
    calories: 340,
    protein: 32,
    carbohydrates: 12,
    fat: 18,
    fiber: 2,
    sugar: 5,
    ingredients: [
      "300g lean ground turkey",
      "8 large butter lettuce leaves",
      "2 tbsp soy sauce",
      "1 tbsp hoisin sauce",
      "1 tbsp rice vinegar",
      "1 tsp sesame oil",
      "2 cloves garlic, minced",
      "1 tsp ginger, grated",
      "2 green onions, sliced",
      "1/4 cup water chestnuts, diced",
    ],
    instructions: [
      "Heat a non-stick pan over medium-high heat.",
      "Cook ground turkey, breaking it apart, until no longer pink.",
      "Add garlic and ginger, stir for 30 seconds.",
      "Add water chestnuts, soy sauce, hoisin sauce, and rice vinegar.",
      "Stir and cook for 2-3 more minutes until sauce reduces.",
      "Drizzle with sesame oil and toss.",
      "Spoon the turkey mixture into lettuce cups.",
      "Garnish with sliced green onions and serve.",
    ],
    tags: ["lunch", "low_carb", "quick", "high_protein"],
  },
  "r-8": {
    id: "r-8",
    name: "Grilled Salmon with Asparagus",
    description:
      "Herb-crusted salmon fillet with roasted asparagus and lemon. Simple, elegant, and protein-rich.",
    cuisineFlag: "\u{1F1F3}\u{1F1F4}",
    cuisineName: "Scandinavian",
    category: "dinner",
    prepTimeMin: 20,
    servings: 1,
    calories: 480,
    protein: 42,
    carbohydrates: 12,
    fat: 28,
    fiber: 4,
    sugar: 3,
    ingredients: [
      "200g salmon fillet",
      "200g asparagus, trimmed",
      "1 tbsp olive oil",
      "1 lemon",
      "2 cloves garlic, minced",
      "1 tsp dried dill",
      "Salt and pepper to taste",
      "Fresh parsley for garnish",
    ],
    instructions: [
      "Preheat oven to 200C (400F).",
      "Place salmon and asparagus on a lined baking sheet.",
      "Drizzle everything with olive oil.",
      "Season salmon with garlic, dill, salt, and pepper.",
      "Squeeze half the lemon over the salmon and asparagus.",
      "Bake for 15-18 minutes until salmon flakes easily.",
      "Garnish with fresh parsley and remaining lemon slices.",
      "Serve immediately.",
    ],
    tags: ["dinner", "high_protein", "low_carb"],
  },
  "r-9": {
    id: "r-9",
    name: "Chicken Stir-Fry",
    description:
      "Tender chicken with colorful vegetables in a light soy-ginger sauce over rice.",
    cuisineFlag: "\u{1F1E8}\u{1F1F3}",
    cuisineName: "Chinese",
    category: "dinner",
    prepTimeMin: 20,
    servings: 2,
    calories: 460,
    protein: 35,
    carbohydrates: 48,
    fat: 14,
    fiber: 4,
    sugar: 8,
    ingredients: [
      "300g chicken breast, sliced thin",
      "200g jasmine rice (cooked)",
      "1 red bell pepper, sliced",
      "1 cup broccoli florets",
      "1 carrot, julienned",
      "3 tbsp soy sauce",
      "1 tbsp oyster sauce",
      "1 tsp cornstarch",
      "2 cloves garlic, minced",
      "1 tsp fresh ginger, grated",
      "1 tbsp vegetable oil",
      "Sesame seeds for garnish",
    ],
    instructions: [
      "Mix soy sauce, oyster sauce, and cornstarch in a small bowl.",
      "Heat oil in a wok or large pan over high heat.",
      "Stir-fry chicken for 4-5 minutes until golden. Remove and set aside.",
      "Add garlic and ginger to the wok, stir for 15 seconds.",
      "Add bell pepper, broccoli, and carrot. Stir-fry for 3 minutes.",
      "Return chicken to the wok.",
      "Pour sauce mixture over and toss everything together.",
      "Cook for 1-2 minutes until sauce thickens.",
      "Serve over jasmine rice and garnish with sesame seeds.",
    ],
    tags: ["dinner", "high_protein"],
  },
  "r-10": {
    id: "r-10",
    name: "Lean Beef Tacos",
    description:
      "Seasoned lean ground beef in corn tortillas with fresh salsa and guacamole.",
    cuisineFlag: "\u{1F1F2}\u{1F1FD}",
    cuisineName: "Mexican",
    category: "dinner",
    prepTimeMin: 20,
    servings: 2,
    calories: 500,
    protein: 38,
    carbohydrates: 35,
    fat: 22,
    fiber: 6,
    sugar: 4,
    ingredients: [
      "300g lean ground beef (95% lean)",
      "6 small corn tortillas",
      "1 tsp cumin",
      "1 tsp chili powder",
      "1/2 tsp garlic powder",
      "1 avocado, mashed",
      "1 tomato, diced",
      "1/4 onion, diced",
      "Juice of 1 lime",
      "Fresh cilantro",
      "Salt and pepper to taste",
    ],
    instructions: [
      "Brown the ground beef in a skillet over medium-high heat.",
      "Season with cumin, chili powder, garlic powder, salt, and pepper.",
      "Cook for 6-8 minutes, breaking apart until fully cooked.",
      "Make quick guacamole: mash avocado with lime juice and salt.",
      "Make fresh salsa: mix diced tomato, onion, cilantro, and lime.",
      "Warm corn tortillas in a dry pan or microwave.",
      "Fill tortillas with seasoned beef.",
      "Top with guacamole and fresh salsa.",
    ],
    tags: ["dinner", "high_protein"],
  },
  "r-11": {
    id: "r-11",
    name: "Shrimp and Vegetable Curry",
    description:
      "Coconut milk curry with shrimp, bell peppers, and spinach over basmati rice.",
    cuisineFlag: "\u{1F1EE}\u{1F1F3}",
    cuisineName: "Indian",
    category: "dinner",
    prepTimeMin: 25,
    servings: 2,
    calories: 460,
    protein: 30,
    carbohydrates: 42,
    fat: 18,
    fiber: 4,
    sugar: 6,
    ingredients: [
      "300g shrimp, peeled and deveined",
      "200ml light coconut milk",
      "200g basmati rice (cooked)",
      "1 red bell pepper, sliced",
      "2 cups baby spinach",
      "2 tbsp curry paste (red or yellow)",
      "1 tbsp coconut oil",
      "2 cloves garlic, minced",
      "1 tsp ginger, grated",
      "Juice of half a lime",
      "Fresh basil for garnish",
    ],
    instructions: [
      "Cook basmati rice according to package instructions.",
      "Heat coconut oil in a large pan over medium heat.",
      "Saute garlic and ginger for 30 seconds.",
      "Add curry paste and stir for 1 minute.",
      "Add bell pepper and cook for 2 minutes.",
      "Pour in coconut milk and bring to a simmer.",
      "Add shrimp and cook for 3-4 minutes until pink.",
      "Stir in spinach until just wilted.",
      "Squeeze lime juice over the curry.",
      "Serve over basmati rice and garnish with fresh basil.",
    ],
    tags: ["dinner"],
  },
  "r-12": {
    id: "r-12",
    name: "Baked Cod with Sweet Potato",
    description:
      "Lemon-herb baked cod fillet with roasted sweet potato wedges.",
    cuisineFlag: "\u{1F1EC}\u{1F1E7}",
    cuisineName: "British",
    category: "dinner",
    prepTimeMin: 30,
    servings: 1,
    calories: 420,
    protein: 36,
    carbohydrates: 40,
    fat: 10,
    fiber: 5,
    sugar: 8,
    ingredients: [
      "200g cod fillet",
      "1 medium sweet potato, cut into wedges",
      "1 tbsp olive oil",
      "1 lemon",
      "2 cloves garlic, minced",
      "1 tsp dried thyme",
      "1 tsp smoked paprika",
      "100g green beans",
      "Salt and pepper to taste",
    ],
    instructions: [
      "Preheat oven to 200C (400F).",
      "Toss sweet potato wedges with half the olive oil, paprika, salt, and pepper.",
      "Spread wedges on a baking sheet and roast for 15 minutes.",
      "Season cod with garlic, thyme, salt, pepper, and lemon juice.",
      "After 15 minutes, add cod and green beans to the baking sheet.",
      "Drizzle remaining olive oil over the cod and beans.",
      "Bake for another 12-15 minutes until cod flakes easily.",
      "Serve with lemon wedges on the side.",
    ],
    tags: ["dinner", "high_protein"],
  },
  "r-13": {
    id: "r-13",
    name: "Protein Bar (Homemade)",
    description:
      "No-bake protein bars with oats, protein powder, peanut butter, and dark chocolate.",
    cuisineFlag: "\u{1F1FA}\u{1F1F8}",
    cuisineName: "American",
    category: "snack",
    prepTimeMin: 15,
    servings: 8,
    calories: 220,
    protein: 20,
    carbohydrates: 22,
    fat: 8,
    fiber: 3,
    sugar: 6,
    ingredients: [
      "2 cups rolled oats",
      "2 scoops chocolate protein powder",
      "1/2 cup peanut butter",
      "1/3 cup honey",
      "1/4 cup dark chocolate chips",
      "1/4 cup almond milk",
      "1 tsp vanilla extract",
      "Pinch of salt",
    ],
    instructions: [
      "Mix oats and protein powder in a large bowl.",
      "In a saucepan, gently warm peanut butter and honey until smooth.",
      "Pour the warm mixture over the dry ingredients.",
      "Add almond milk and vanilla extract. Mix until well combined.",
      "Fold in dark chocolate chips.",
      "Press mixture firmly into a lined 8x8 inch baking dish.",
      "Refrigerate for at least 2 hours until firm.",
      "Cut into 8 bars and store in the fridge for up to 1 week.",
    ],
    tags: ["snack", "high_protein", "quick"],
  },
  "r-14": {
    id: "r-14",
    name: "Cottage Cheese with Berries",
    description:
      "Fresh cottage cheese topped with mixed berries and a sprinkle of cinnamon.",
    cuisineFlag: "\u{1F1FA}\u{1F1F8}",
    cuisineName: "American",
    category: "snack",
    prepTimeMin: 3,
    servings: 1,
    calories: 160,
    protein: 18,
    carbohydrates: 14,
    fat: 4,
    fiber: 2,
    sugar: 10,
    ingredients: [
      "150g low-fat cottage cheese",
      "80g mixed berries",
      "1/2 tsp cinnamon",
      "1 tsp honey (optional)",
      "Mint leaves for garnish",
    ],
    instructions: [
      "Scoop cottage cheese into a bowl.",
      "Top with mixed berries.",
      "Sprinkle with cinnamon.",
      "Drizzle honey if desired.",
      "Garnish with mint and serve immediately.",
    ],
    tags: ["snack", "quick", "high_protein", "low_carb"],
  },
  "r-15": {
    id: "r-15",
    name: "Energy Balls",
    description:
      "Date and nut energy balls rolled in coconut with a hint of cocoa.",
    cuisineFlag: "\u{1F1E6}\u{1F1FA}",
    cuisineName: "Australian",
    category: "snack",
    prepTimeMin: 10,
    servings: 12,
    calories: 180,
    protein: 6,
    carbohydrates: 22,
    fat: 10,
    fiber: 3,
    sugar: 14,
    ingredients: [
      "1 cup pitted dates",
      "1/2 cup almonds",
      "1/4 cup cashews",
      "2 tbsp cocoa powder",
      "1 tbsp coconut oil",
      "2 tbsp shredded coconut (for rolling)",
      "Pinch of sea salt",
    ],
    instructions: [
      "Add dates, almonds, and cashews to a food processor.",
      "Pulse until a sticky dough forms.",
      "Add cocoa powder, coconut oil, and salt. Process until combined.",
      "Roll tablespoon-sized portions into balls with your hands.",
      "Roll each ball in shredded coconut.",
      "Place on a lined tray and refrigerate for 30 minutes.",
      "Store in an airtight container in the fridge for up to 1 week.",
    ],
    tags: ["snack", "quick"],
  },
  "r-16": {
    id: "r-16",
    name: "Chicken Tikka Masala",
    description:
      "Tender chicken in a rich, creamy tomato-spice sauce served with basmati rice.",
    cuisineFlag: "\u{1F1EE}\u{1F1F3}",
    cuisineName: "Indian",
    category: "dinner",
    prepTimeMin: 35,
    servings: 3,
    calories: 540,
    protein: 38,
    carbohydrates: 48,
    fat: 20,
    fiber: 4,
    sugar: 8,
    ingredients: [
      "500g chicken breast, cubed",
      "200g basmati rice (dry)",
      "400ml canned crushed tomatoes",
      "100ml light coconut cream",
      "2 tbsp tikka masala paste",
      "1 onion, diced",
      "3 cloves garlic, minced",
      "1 tsp ginger, grated",
      "1 tbsp olive oil",
      "Fresh cilantro for garnish",
      "Salt to taste",
    ],
    instructions: [
      "Cook basmati rice according to package instructions.",
      "Heat olive oil in a large pan over medium-high heat.",
      "Add onion and saute until softened, about 3-4 minutes.",
      "Add garlic and ginger, cook for 30 seconds.",
      "Add tikka masala paste and stir for 1 minute.",
      "Add chicken cubes and cook until lightly browned on all sides.",
      "Pour in crushed tomatoes and bring to a simmer.",
      "Cook for 15 minutes, stirring occasionally.",
      "Stir in coconut cream and cook for 3 more minutes.",
      "Season with salt and garnish with fresh cilantro.",
      "Serve over basmati rice.",
    ],
    tags: ["dinner", "high_protein"],
  },
  "r-17": {
    id: "r-17",
    name: "Bibimbap",
    description:
      "Korean rice bowl with sauteed vegetables, beef, egg, and gochujang sauce.",
    cuisineFlag: "\u{1F1F0}\u{1F1F7}",
    cuisineName: "Korean",
    category: "lunch",
    prepTimeMin: 25,
    servings: 1,
    calories: 510,
    protein: 30,
    carbohydrates: 55,
    fat: 16,
    fiber: 5,
    sugar: 6,
    ingredients: [
      "200g cooked white rice",
      "100g lean beef (sirloin), sliced thin",
      "1 egg",
      "1 carrot, julienned",
      "1 cup spinach",
      "1/2 zucchini, sliced",
      "50g bean sprouts",
      "2 tbsp gochujang sauce",
      "1 tbsp soy sauce",
      "1 tbsp sesame oil",
      "1 tsp sesame seeds",
    ],
    instructions: [
      "Marinate beef slices in soy sauce and half the sesame oil for 10 minutes.",
      "Saute each vegetable separately in a hot pan: carrot, spinach, zucchini, and bean sprouts. Season lightly with salt.",
      "Cook the marinated beef in the same pan until browned.",
      "Fry the egg sunny-side up.",
      "Place rice in a large bowl.",
      "Arrange vegetables and beef on top of the rice in sections.",
      "Place the fried egg in the center.",
      "Drizzle with remaining sesame oil and gochujang.",
      "Sprinkle sesame seeds and mix everything before eating.",
    ],
    tags: ["lunch", "high_protein"],
  },
  "r-18": {
    id: "r-18",
    name: "Acai Smoothie Bowl",
    description:
      "Thick acai blend topped with granola, banana slices, and coconut flakes.",
    cuisineFlag: "\u{1F1E7}\u{1F1F7}",
    cuisineName: "Brazilian",
    category: "breakfast",
    prepTimeMin: 5,
    servings: 1,
    calories: 310,
    protein: 10,
    carbohydrates: 52,
    fat: 8,
    fiber: 6,
    sugar: 28,
    ingredients: [
      "1 pack frozen acai puree (100g)",
      "1 frozen banana",
      "60ml almond milk",
      "30g granola",
      "1/2 banana, sliced (for topping)",
      "1 tbsp coconut flakes",
      "1 tbsp honey",
      "Fresh berries for topping",
    ],
    instructions: [
      "Blend frozen acai, frozen banana, and almond milk until thick and smooth.",
      "Pour into a bowl (it should be thick like soft-serve).",
      "Top with granola, sliced banana, and coconut flakes.",
      "Add fresh berries on top.",
      "Drizzle with honey and serve immediately.",
    ],
    tags: ["breakfast", "quick"],
  },
};

export default function RecipeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const addMealEntry = useDailyLogStore((s) => s.addMealEntry);
  const [logged, setLogged] = useState(false);

  const recipeId = params.id as string;
  const recipe = RECIPE_DETAILS[recipeId] ?? null;

  if (!recipe) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center py-20">
          <BookmarkPlus className="mb-4 h-12 w-12 text-muted-foreground" />
          <h2 className="text-lg font-semibold">Recipe Not Found</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            This recipe does not exist or has been removed.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => router.push("/recipes")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Recipes
          </Button>
        </div>
      </PageContainer>
    );
  }

  const maxMacroCalories = Math.max(
    recipe.protein * 4,
    recipe.carbohydrates * 4,
    recipe.fat * 9
  );
  const proteinPercent =
    maxMacroCalories > 0
      ? ((recipe.protein * 4) / recipe.calories) * 100
      : 0;
  const carbsPercent =
    maxMacroCalories > 0
      ? ((recipe.carbohydrates * 4) / recipe.calories) * 100
      : 0;
  const fatPercent =
    maxMacroCalories > 0
      ? ((recipe.fat * 9) / recipe.calories) * 100
      : 0;

  const handleLogMeal = () => {
    const foodItem: FoodItem = {
      id: recipe.id,
      name: recipe.name,
      source: "manual",
      nutrients: {
        calories: recipe.calories,
        protein: recipe.protein,
        carbohydrates: recipe.carbohydrates,
        fat: recipe.fat,
        fiber: recipe.fiber,
        sugar: recipe.sugar,
      },
      servingSize: 1,
      servingSizeUnit: "serving",
      foodCategory: recipe.category,
    };

    const entry: MealEntry = {
      id: nanoid(),
      foodItem,
      quantity: 1,
      mealType: recipe.category,
      timestamp: new Date().toISOString(),
    };

    const today = new Date().toISOString().split("T")[0];
    addMealEntry(today, entry);
    setLogged(true);
    setTimeout(() => setLogged(false), 3000);
  };

  return (
    <PageContainer>
      {/* Back button */}
      <Button
        variant="ghost"
        size="sm"
        className="mb-3 gap-1 -ml-2"
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      {/* Recipe Header */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl">{recipe.cuisineFlag}</span>
          <Badge variant="secondary" className="text-[10px]">
            {recipe.cuisineName}
          </Badge>
          <Badge variant="outline" className="text-[10px] capitalize">
            {recipe.category}
          </Badge>
        </div>
        <h1 className="text-xl font-bold">{recipe.name}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {recipe.description}
        </p>
      </div>

      {/* Quick Info */}
      <div className="mb-4 flex gap-4">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{recipe.prepTimeMin} min</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>
            {recipe.servings} serving{recipe.servings > 1 ? "s" : ""}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Flame className="h-4 w-4 text-orange-400" />
          <span>{recipe.calories} cal</span>
        </div>
      </div>

      {/* Nutrition Breakdown */}
      <Card className="mb-4 border-border/50 bg-card/80">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Nutrition per Serving</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-4 gap-3 text-center">
            <div>
              <p className="text-lg font-bold text-primary">
                {recipe.calories}
              </p>
              <p className="text-[10px] text-muted-foreground">Calories</p>
            </div>
            <div>
              <p className="text-lg font-bold text-blue-400">
                {recipe.protein}g
              </p>
              <p className="text-[10px] text-muted-foreground">Protein</p>
            </div>
            <div>
              <p className="text-lg font-bold text-amber-400">
                {recipe.carbohydrates}g
              </p>
              <p className="text-[10px] text-muted-foreground">Carbs</p>
            </div>
            <div>
              <p className="text-lg font-bold text-rose-400">
                {recipe.fat}g
              </p>
              <p className="text-[10px] text-muted-foreground">Fat</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-blue-400">Protein</span>
              <span className="text-muted-foreground">
                {Math.round(proteinPercent)}%
              </span>
            </div>
            <Progress value={proteinPercent} className="h-1.5 bg-blue-400/20 [&>div]:bg-blue-400" />

            <div className="flex items-center justify-between text-xs">
              <span className="text-amber-400">Carbs</span>
              <span className="text-muted-foreground">
                {Math.round(carbsPercent)}%
              </span>
            </div>
            <Progress value={carbsPercent} className="h-1.5 bg-amber-400/20 [&>div]:bg-amber-400" />

            <div className="flex items-center justify-between text-xs">
              <span className="text-rose-400">Fat</span>
              <span className="text-muted-foreground">
                {Math.round(fatPercent)}%
              </span>
            </div>
            <Progress value={fatPercent} className="h-1.5 bg-rose-400/20 [&>div]:bg-rose-400" />
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span>Fiber</span>
              <span>{recipe.fiber}g</span>
            </div>
            <div className="flex justify-between">
              <span>Sugar</span>
              <span>{recipe.sugar}g</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ingredients */}
      <Card className="mb-4 border-border/50 bg-card/80">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            <ChefHat className="h-4 w-4 text-primary" />
            Ingredients
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {recipe.ingredients.map((ingredient, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>{ingredient}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="mb-4 border-border/50 bg-card/80">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3">
            {recipe.instructions.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  {i + 1}
                </span>
                <span className="pt-0.5 text-muted-foreground">{step}</span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3 mb-6">
        <Button
          variant="outline"
          className="flex-1 gap-2"
          onClick={() => router.push("/meal-plan")}
        >
          <Plus className="h-4 w-4" />
          Add to Meal Plan
        </Button>
        <Button
          className="flex-1 gap-2"
          onClick={handleLogMeal}
          disabled={logged}
        >
          {logged ? (
            <>
              <CheckCircle2 className="h-4 w-4" />
              Logged!
            </>
          ) : (
            <>
              <Flame className="h-4 w-4" />
              Log This Meal
            </>
          )}
        </Button>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {recipe.tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="text-xs capitalize">
            {tag.replace("_", " ")}
          </Badge>
        ))}
      </div>
    </PageContainer>
  );
}
