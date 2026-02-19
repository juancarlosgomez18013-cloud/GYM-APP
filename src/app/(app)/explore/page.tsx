"use client";

import { useState, useMemo } from "react";
import {
  Globe,
  MapPin,
  Utensils,
  ChefHat,
  Sparkles,
  Search,
} from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import type { CuisineRegion } from "@/types/cuisine";

// ─── Cuisine data ─────────────────────────────────────────────
interface CuisineEntry {
  id: string;
  name: string;
  flag: string;
  region: CuisineRegion;
  sampleDishes: string[];
  description: string;
}

const CUISINES: CuisineEntry[] = [
  {
    id: "mexico",
    name: "Mexico",
    flag: "\u{1F1F2}\u{1F1FD}",
    region: "americas",
    sampleDishes: [
      "Tacos al Pastor",
      "Chilaquiles Verdes",
      "Pozole Rojo",
      "Enchiladas Suizas",
      "Huevos Rancheros",
      "Quesadillas de Pollo",
    ],
    description:
      "Bold flavors with corn, beans, chili peppers, and fresh herbs.",
  },
  {
    id: "colombia",
    name: "Colombia",
    flag: "\u{1F1E8}\u{1F1F4}",
    region: "americas",
    sampleDishes: [
      "Bandeja Paisa",
      "Ajiaco",
      "Arepas con Queso",
      "Sancocho",
      "Empanadas",
      "Arroz con Pollo",
    ],
    description:
      "Hearty comfort food with plantains, beans, rice, and tropical fruits.",
  },
  {
    id: "argentina",
    name: "Argentina",
    flag: "\u{1F1E6}\u{1F1F7}",
    region: "americas",
    sampleDishes: [
      "Asado con Chimichurri",
      "Empanadas Mendocinas",
      "Milanesa Napolitana",
      "Locro",
      "Provoleta",
      "Choripan",
    ],
    description:
      "Premium grilled meats, fresh chimichurri, and Italian-influenced dishes.",
  },
  {
    id: "peru",
    name: "Peru",
    flag: "\u{1F1F5}\u{1F1EA}",
    region: "americas",
    sampleDishes: [
      "Ceviche",
      "Lomo Saltado",
      "Aji de Gallina",
      "Causa Limena",
      "Arroz con Pollo",
      "Papa a la Huancaina",
    ],
    description:
      "Diverse fusion cuisine with fresh seafood, potatoes, and aji peppers.",
  },
  {
    id: "brazil",
    name: "Brazil",
    flag: "\u{1F1E7}\u{1F1F7}",
    region: "americas",
    sampleDishes: [
      "Feijoada",
      "Picanha",
      "Acai Bowl",
      "Pao de Queijo",
      "Moqueca",
      "Coxinha",
    ],
    description:
      "Vibrant tropical flavors with black beans, grilled meats, and acai.",
  },
  {
    id: "usa",
    name: "United States",
    flag: "\u{1F1FA}\u{1F1F8}",
    region: "americas",
    sampleDishes: [
      "Grilled Chicken Caesar",
      "Turkey Burger",
      "Protein Pancakes",
      "BBQ Salmon",
      "Southwest Salad",
      "Poke Bowl",
    ],
    description:
      "Diverse melting pot cuisine with focus on protein-rich preparations.",
  },
  {
    id: "spain",
    name: "Spain",
    flag: "\u{1F1EA}\u{1F1F8}",
    region: "europe",
    sampleDishes: [
      "Paella Valenciana",
      "Tortilla Espanola",
      "Gazpacho",
      "Gambas al Ajillo",
      "Patatas Bravas",
      "Pisto Manchego",
    ],
    description:
      "Mediterranean flavors with olive oil, seafood, and saffron rice.",
  },
  {
    id: "italy",
    name: "Italy",
    flag: "\u{1F1EE}\u{1F1F9}",
    region: "europe",
    sampleDishes: [
      "Chicken Parmigiana",
      "Caprese Salad",
      "Minestrone Soup",
      "Grilled Branzino",
      "Risotto Primavera",
      "Bruschetta",
    ],
    description:
      "Simple, fresh ingredients with olive oil, tomatoes, and herbs.",
  },
  {
    id: "france",
    name: "France",
    flag: "\u{1F1EB}\u{1F1F7}",
    region: "europe",
    sampleDishes: [
      "Ratatouille",
      "Salade Nicoise",
      "Coq au Vin",
      "Quiche Lorraine",
      "Bouillabaisse",
      "Croque Monsieur",
    ],
    description:
      "Refined technique with butter, herbs, wine sauces, and fresh produce.",
  },
  {
    id: "germany",
    name: "Germany",
    flag: "\u{1F1E9}\u{1F1EA}",
    region: "europe",
    sampleDishes: [
      "Schnitzel with Salad",
      "Bratwurst with Sauerkraut",
      "Kartoffelsuppe",
      "Rindergulasch",
      "Maultaschen",
      "Bauernfruhstuck",
    ],
    description:
      "Hearty, protein-rich dishes with potatoes, meat, and fermented vegetables.",
  },
  {
    id: "uk",
    name: "United Kingdom",
    flag: "\u{1F1EC}\u{1F1E7}",
    region: "europe",
    sampleDishes: [
      "Shepherd's Pie",
      "Fish and Chips",
      "Full English Breakfast",
      "Roast Chicken Dinner",
      "Chicken Tikka Masala",
      "Cottage Pie",
    ],
    description:
      "Comforting home cooking with roasts, pies, and multicultural influences.",
  },
  {
    id: "japan",
    name: "Japan",
    flag: "\u{1F1EF}\u{1F1F5}",
    region: "asia",
    sampleDishes: [
      "Salmon Sashimi Bowl",
      "Chicken Teriyaki",
      "Miso Soup with Tofu",
      "Edamame",
      "Yakitori",
      "Gyudon",
    ],
    description:
      "Clean, balanced flavors with fish, rice, soy, and fermented ingredients.",
  },
  {
    id: "china",
    name: "China",
    flag: "\u{1F1E8}\u{1F1F3}",
    region: "asia",
    sampleDishes: [
      "Kung Pao Chicken",
      "Steamed Fish with Ginger",
      "Mapo Tofu",
      "Bok Choy Stir-Fry",
      "Hot & Sour Soup",
      "Egg Drop Soup",
    ],
    description:
      "Diverse regional styles with wok-cooking, steaming, and bold sauces.",
  },
  {
    id: "india",
    name: "India",
    flag: "\u{1F1EE}\u{1F1F3}",
    region: "asia",
    sampleDishes: [
      "Chicken Tikka",
      "Dal Tadka",
      "Palak Paneer",
      "Tandoori Salmon",
      "Chana Masala",
      "Raita",
    ],
    description:
      "Aromatic spices with lentils, yogurt, and diverse vegetarian options.",
  },
  {
    id: "thailand",
    name: "Thailand",
    flag: "\u{1F1F9}\u{1F1ED}",
    region: "asia",
    sampleDishes: [
      "Pad Thai",
      "Tom Yum Soup",
      "Green Curry with Chicken",
      "Som Tum Salad",
      "Larb Gai",
      "Mango Sticky Rice",
    ],
    description:
      "Sweet, sour, salty, and spicy balance with fresh herbs and coconut.",
  },
  {
    id: "korea",
    name: "South Korea",
    flag: "\u{1F1F0}\u{1F1F7}",
    region: "asia",
    sampleDishes: [
      "Bibimbap",
      "Bulgogi",
      "Kimchi Jjigae",
      "Japchae",
      "Tteokbokki",
      "Gimbap",
    ],
    description:
      "Fermented foods, lean proteins, and vegetables with bold gochujang flavors.",
  },
  {
    id: "lebanon",
    name: "Lebanon",
    flag: "\u{1F1F1}\u{1F1E7}",
    region: "middle_east",
    sampleDishes: [
      "Chicken Shawarma",
      "Hummus with Pita",
      "Tabbouleh",
      "Falafel Plate",
      "Fattoush Salad",
      "Kafta Mashwiya",
    ],
    description:
      "Fresh Mediterranean cuisine with olive oil, herbs, and grilled meats.",
  },
  {
    id: "turkey",
    name: "Turkey",
    flag: "\u{1F1F9}\u{1F1F7}",
    region: "middle_east",
    sampleDishes: [
      "Adana Kebab",
      "Mercimek Corbasi",
      "Iskender Kebab",
      "Lahmacun",
      "Menemen",
      "Piyaz Salad",
    ],
    description:
      "Grilled meats, lentils, yogurt, and olive oil-based dishes.",
  },
  {
    id: "morocco",
    name: "Morocco",
    flag: "\u{1F1F2}\u{1F1E6}",
    region: "africa",
    sampleDishes: [
      "Chicken Tagine",
      "Couscous with Vegetables",
      "Harira Soup",
      "Moroccan Lamb Kefta",
      "Zaalouk",
      "Bissara",
    ],
    description:
      "Fragrant spices with preserved lemons, olives, and slow-cooked tagines.",
  },
  {
    id: "nigeria",
    name: "Nigeria",
    flag: "\u{1F1F3}\u{1F1EC}",
    region: "africa",
    sampleDishes: [
      "Jollof Rice with Chicken",
      "Egusi Soup",
      "Suya Skewers",
      "Moi Moi",
      "Pepper Soup",
      "Plantain Porridge",
    ],
    description:
      "Rich stews, grilled meats, and flavorful rice dishes with bold peppers.",
  },
  {
    id: "australia",
    name: "Australia",
    flag: "\u{1F1E6}\u{1F1FA}",
    region: "oceania",
    sampleDishes: [
      "Barramundi with Greens",
      "Kangaroo Steak Salad",
      "Smashed Avo Toast",
      "Lamb Cutlets with Mint",
      "Prawn Linguine",
      "Meat Pie (Lean)",
    ],
    description:
      "Fresh, multicultural cuisine with seafood, lean meats, and superfoods.",
  },
];

const REGIONS: { label: string; value: CuisineRegion | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Americas", value: "americas" },
  { label: "Europe", value: "europe" },
  { label: "Asia", value: "asia" },
  { label: "Africa", value: "africa" },
  { label: "Middle East", value: "middle_east" },
  { label: "Oceania", value: "oceania" },
];

export default function ExploreCuisinesPage() {
  const [selectedRegion, setSelectedRegion] = useState<
    CuisineRegion | "all"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState<CuisineEntry | null>(
    null
  );
  const [sheetOpen, setSheetOpen] = useState(false);

  const filteredCuisines = useMemo(() => {
    let result = CUISINES;
    if (selectedRegion !== "all") {
      result = result.filter((c) => c.region === selectedRegion);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.sampleDishes.some((d) => d.toLowerCase().includes(q))
      );
    }
    return result;
  }, [selectedRegion, searchQuery]);

  const handleCuisineClick = (cuisine: CuisineEntry) => {
    setSelectedCuisine(cuisine);
    setSheetOpen(true);
  };

  const regionCounts = useMemo(() => {
    const counts: Record<string, number> = { all: CUISINES.length };
    CUISINES.forEach((c) => {
      counts[c.region] = (counts[c.region] || 0) + 1;
    });
    return counts;
  }, []);

  return (
    <PageContainer>
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Explore Cuisines</h1>
            <p className="text-xs text-muted-foreground">
              Discover meals from around the world
            </p>
          </div>
          <Globe className="h-6 w-6 text-primary" />
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search cuisines or dishes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 bg-card/80 border-border/50"
        />
      </div>

      {/* Region Filters */}
      <div className="mb-4">
        <ScrollArea className="w-full">
          <div className="flex gap-2 pb-2">
            {REGIONS.map((region) => (
              <Button
                key={region.value}
                variant={
                  selectedRegion === region.value ? "default" : "outline"
                }
                size="sm"
                className="shrink-0 gap-1 text-xs"
                onClick={() => setSelectedRegion(region.value)}
              >
                {region.label}
                <span className="text-[10px] opacity-70">
                  ({regionCounts[region.value] ?? 0})
                </span>
              </Button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* Cuisine Grid */}
      {filteredCuisines.length === 0 ? (
        <Card className="border-dashed border-border/50 bg-card/50">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MapPin className="mb-3 h-10 w-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              No cuisines found matching your search.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {filteredCuisines.map((cuisine) => (
            <Card
              key={cuisine.id}
              className="cursor-pointer border-border/50 bg-card/80 transition-all hover:border-primary/30 hover:bg-card active:scale-[0.98]"
              onClick={() => handleCuisineClick(cuisine)}
            >
              <CardContent className="flex flex-col items-center p-4">
                <span className="text-4xl mb-2">{cuisine.flag}</span>
                <p className="text-sm font-medium text-center">
                  {cuisine.name}
                </p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  {cuisine.sampleDishes.length} dishes
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Cuisine Detail Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="bottom" className="max-h-[85vh] rounded-t-2xl">
          {selectedCuisine && (
            <>
              <SheetHeader className="text-left">
                <div className="flex items-center gap-3">
                  <span className="text-5xl">{selectedCuisine.flag}</span>
                  <div>
                    <SheetTitle className="text-lg">
                      {selectedCuisine.name}
                    </SheetTitle>
                    <SheetDescription>
                      {selectedCuisine.description}
                    </SheetDescription>
                  </div>
                </div>
              </SheetHeader>

              <Separator className="my-3" />

              <div className="px-4">
                <div className="flex items-center gap-2 mb-3">
                  <ChefHat className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-semibold">Popular Dishes</h3>
                </div>
                <div className="space-y-2">
                  {selectedCuisine.sampleDishes.map((dish) => (
                    <div
                      key={dish}
                      className="flex items-center gap-3 rounded-lg border border-border/30 bg-background/50 p-3"
                    >
                      <Utensils className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="text-sm">{dish}</span>
                    </div>
                  ))}
                </div>
              </div>

              <SheetFooter className="mt-4">
                <Button className="w-full gap-2" size="lg">
                  <Sparkles className="h-4 w-4" />
                  Try This Cuisine
                </Button>
                <p className="text-center text-[10px] text-muted-foreground">
                  Generate a day plan using {selectedCuisine.name}n dishes
                </p>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>
    </PageContainer>
  );
}
