"use client";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FASTING_PROTOCOLS, type FastingProtocol } from "@/types/fasting";

interface ProtocolSelectorProps {
  selected: FastingProtocol;
  onSelect: (protocol: FastingProtocol) => void;
  customFastingHours: number;
  customEatingHours: number;
  onCustomChange: (fasting: number, eating: number) => void;
}

export function ProtocolSelector({
  selected,
  onSelect,
  customFastingHours,
  customEatingHours,
  onCustomChange,
}: ProtocolSelectorProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-2">
        {FASTING_PROTOCOLS.map((protocol) => (
          <Card
            key={protocol.id}
            className={cn(
              "cursor-pointer p-3 transition-all",
              selected === protocol.id
                ? "border-primary bg-primary/5 ring-1 ring-primary"
                : "hover:border-muted-foreground/30"
            )}
            onClick={() => onSelect(protocol.id)}
          >
            <p className="text-lg font-bold text-foreground">{protocol.label}</p>
            <p className="text-xs text-muted-foreground">
              {protocol.fastingHours}h fast / {protocol.eatingHours}h eat
            </p>
          </Card>
        ))}
      </div>

      {/* Custom option */}
      <Card
        className={cn(
          "cursor-pointer p-3 transition-all",
          selected === "custom"
            ? "border-primary bg-primary/5 ring-1 ring-primary"
            : "hover:border-muted-foreground/30"
        )}
        onClick={() => onSelect("custom")}
      >
        <p className="text-lg font-bold text-foreground">Custom</p>
        <p className="text-xs text-muted-foreground mb-2">
          Set your own fasting and eating windows
        </p>

        {selected === "custom" && (
          <div className="grid grid-cols-2 gap-3 mt-2" onClick={(e) => e.stopPropagation()}>
            <div className="space-y-1">
              <Label className="text-xs">Fasting hours</Label>
              <Input
                type="number"
                min="1"
                max="23"
                value={customFastingHours}
                onChange={(e) =>
                  onCustomChange(parseInt(e.target.value) || 16, customEatingHours)
                }
                className="h-8"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Eating hours</Label>
              <Input
                type="number"
                min="1"
                max="23"
                value={customEatingHours}
                onChange={(e) =>
                  onCustomChange(customFastingHours, parseInt(e.target.value) || 8)
                }
                className="h-8"
              />
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
