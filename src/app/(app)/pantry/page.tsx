"use client";

import { useState, useMemo } from "react";
import {
  ShoppingBasket,
  Plus,
  Search,
  PackageOpen,
} from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { usePantryStore } from "@/stores/pantry-store";
import { PantryItemCard } from "@/components/pantry/PantryItemCard";
import { AddPantryItemForm } from "@/components/pantry/AddPantryItemForm";
import type { PantryCategory } from "@/types/pantry";

type FilterCategory = "all" | PantryCategory;

const FILTER_TABS: { value: FilterCategory; label: string }[] = [
  { value: "all", label: "All" },
  { value: "proteins", label: "Proteins" },
  { value: "vegetables", label: "Vegetables" },
  { value: "fruits", label: "Fruits" },
  { value: "dairy", label: "Dairy" },
  { value: "grains", label: "Grains" },
  { value: "snacks", label: "Snacks" },
  { value: "beverages", label: "Beverages" },
  { value: "other", label: "Other" },
];

export default function PantryPage() {
  const items = usePantryStore((s) => s.items);
  const addItem = usePantryStore((s) => s.addItem);
  const removeItem = usePantryStore((s) => s.removeItem);
  const updateQuantity = usePantryStore((s) => s.updateQuantity);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<FilterCategory>("all");
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);

  const filteredItems = useMemo(() => {
    let result = items;

    // Filter by category
    if (activeCategory !== "all") {
      result = result.filter((item) => item.category === activeCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((item) =>
        item.name.toLowerCase().includes(query)
      );
    }

    // Sort: expiring items first, then alphabetically
    return result.sort((a, b) => {
      // Items with expiration dates come first
      if (a.expirationDate && !b.expirationDate) return -1;
      if (!a.expirationDate && b.expirationDate) return 1;
      if (a.expirationDate && b.expirationDate) {
        return a.expirationDate.localeCompare(b.expirationDate);
      }
      return a.name.localeCompare(b.name);
    });
  }, [items, activeCategory, searchQuery]);

  return (
    <PageContainer>
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <ShoppingBasket className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">My Pantry</h1>
            <p className="text-sm text-muted-foreground">
              {items.length} item{items.length !== 1 ? "s" : ""} stored
            </p>
          </div>
        </div>
        <Button size="sm" onClick={() => setIsAddSheetOpen(true)}>
          <Plus className="mr-1 h-4 w-4" />
          Add
        </Button>
      </div>

      {/* Search bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search pantry items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Category filter tabs */}
      <div className="mb-4 -mx-4 px-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveCategory(tab.value)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                activeCategory === tab.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Pantry items grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {filteredItems.map((item) => (
            <PantryItemCard
              key={item.id}
              item={item}
              onUpdateQuantity={updateQuantity}
              onRemove={removeItem}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted/50">
            <PackageOpen className="h-10 w-10 text-muted-foreground/50" />
          </div>
          <h3 className="mt-4 font-medium text-foreground">
            {items.length === 0 ? "Pantry is empty" : "No items found"}
          </h3>
          <p className="mt-1 text-center text-sm text-muted-foreground">
            {items.length === 0
              ? "Add items manually or scan a receipt to get started"
              : "Try a different search term or category filter"}
          </p>
          {items.length === 0 && (
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setIsAddSheetOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add First Item
            </Button>
          )}
        </div>
      )}

      {/* Add Item Sheet */}
      <Sheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen}>
        <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto rounded-t-2xl">
          <SheetHeader>
            <SheetTitle>Add Pantry Item</SheetTitle>
            <SheetDescription>
              Manually add a food item to your pantry
            </SheetDescription>
          </SheetHeader>
          <div className="px-4 pb-6">
            <AddPantryItemForm
              onAdd={addItem}
              onClose={() => setIsAddSheetOpen(false)}
            />
          </div>
        </SheetContent>
      </Sheet>
    </PageContainer>
  );
}
