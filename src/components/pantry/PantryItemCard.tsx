"use client";

import { useState } from "react";
import { Minus, Plus, Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { PantryItem } from "@/types/pantry";

interface PantryItemCardProps {
  item: PantryItem;
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}

const categoryColors: Record<string, string> = {
  proteins: "bg-red-500/20 text-red-400 border-red-500/30",
  dairy: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  grains: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  fruits: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  vegetables: "bg-green-500/20 text-green-400 border-green-500/30",
  snacks: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  beverages: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  condiments: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  frozen: "bg-sky-500/20 text-sky-400 border-sky-500/30",
  supplements: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  other: "bg-gray-500/20 text-gray-400 border-gray-500/30",
};

function isExpiringSoon(expirationDate?: string): boolean {
  if (!expirationDate) return false;
  const expiry = new Date(expirationDate);
  const now = new Date();
  const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
  return expiry <= threeDaysFromNow;
}

function isExpired(expirationDate?: string): boolean {
  if (!expirationDate) return false;
  const expiry = new Date(expirationDate);
  return expiry < new Date();
}

export function PantryItemCard({
  item,
  onUpdateQuantity,
  onRemove,
}: PantryItemCardProps) {
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = () => {
    if (isRemoving) {
      onRemove(item.id);
    } else {
      setIsRemoving(true);
      // Auto-reset confirmation after 3 seconds
      setTimeout(() => setIsRemoving(false), 3000);
    }
  };

  const expired = isExpired(item.expirationDate);
  const expiringSoon = !expired && isExpiringSoon(item.expirationDate);
  const colorClass = categoryColors[item.category] || categoryColors.other;

  return (
    <Card
      className={`flex flex-col gap-3 p-4 transition-all ${
        expired ? "border-destructive/50 opacity-70" : ""
      } ${expiringSoon ? "border-yellow-500/50" : ""}`}
    >
      {/* Top row: name, category, delete */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-medium text-foreground">{item.name}</h3>
          <Badge
            variant="outline"
            className={`mt-1 text-[10px] capitalize ${colorClass}`}
          >
            {item.category}
          </Badge>
        </div>
        <Button
          variant={isRemoving ? "destructive" : "ghost"}
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={handleRemove}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Expiry warning */}
      {(expired || expiringSoon) && (
        <div
          className={`flex items-center gap-2 rounded-md px-2 py-1 text-xs ${
            expired
              ? "bg-destructive/10 text-destructive"
              : "bg-yellow-500/10 text-yellow-500"
          }`}
        >
          <AlertTriangle className="h-3 w-3 shrink-0" />
          {expired ? "Expired" : "Expiring soon"}
        </div>
      )}

      {/* Bottom row: quantity controls */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {item.quantity} {item.unit}
        </span>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            disabled={item.quantity <= 0}
            onClick={() =>
              onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))
            }
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="w-8 text-center text-sm font-medium text-foreground">
            {item.quantity}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
