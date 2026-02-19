"use client";

import { useState } from "react";
import { nanoid } from "nanoid";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PantryItem, PantryCategory } from "@/types/pantry";

interface AddPantryItemFormProps {
  onAdd: (item: PantryItem) => void;
  onClose: () => void;
}

const CATEGORIES: { value: PantryCategory; label: string }[] = [
  { value: "proteins", label: "Proteins" },
  { value: "dairy", label: "Dairy" },
  { value: "grains", label: "Grains" },
  { value: "fruits", label: "Fruits" },
  { value: "vegetables", label: "Vegetables" },
  { value: "snacks", label: "Snacks" },
  { value: "beverages", label: "Beverages" },
  { value: "condiments", label: "Condiments" },
  { value: "frozen", label: "Frozen" },
  { value: "supplements", label: "Supplements" },
  { value: "other", label: "Other" },
];

const COMMON_UNITS = ["unit", "oz", "lb", "g", "kg", "ml", "L", "cup", "tbsp", "tsp", "ct", "bunch", "bag", "bottle", "can"];

export function AddPantryItemForm({ onAdd, onClose }: AddPantryItemFormProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<PantryCategory>("other");
  const [quantity, setQuantity] = useState("1");
  const [unit, setUnit] = useState("unit");
  const [expirationDate, setExpirationDate] = useState("");

  const isValid = name.trim().length > 0 && parseFloat(quantity) > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    const item: PantryItem = {
      id: nanoid(),
      name: name.trim(),
      category,
      quantity: parseFloat(quantity),
      unit,
      addedAt: new Date().toISOString(),
      ...(expirationDate ? { expirationDate } : {}),
    };

    onAdd(item);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Food Name */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="food-name">Food Name</Label>
        <Input
          id="food-name"
          placeholder="e.g., Chicken Breast"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />
      </div>

      {/* Category */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="category">Category</Label>
        <Select value={category} onValueChange={(v) => setCategory(v as PantryCategory)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Quantity and Unit */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            type="number"
            min="0"
            step="0.1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="unit">Unit</Label>
          <Select value={unit} onValueChange={setUnit}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select unit" />
            </SelectTrigger>
            <SelectContent>
              {COMMON_UNITS.map((u) => (
                <SelectItem key={u} value={u}>
                  {u}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Expiry Date (optional) */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="expiry">
          Expiration Date{" "}
          <span className="text-muted-foreground font-normal">(optional)</span>
        </Label>
        <Input
          id="expiry"
          type="date"
          value={expirationDate}
          onChange={(e) => setExpirationDate(e.target.value)}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button type="submit" className="flex-1" disabled={!isValid}>
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </div>
    </form>
  );
}
