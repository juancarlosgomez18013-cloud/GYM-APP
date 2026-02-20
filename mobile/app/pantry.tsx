import { useState } from "react";
import { View, Text, Pressable, TextInput, FlatList, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { nanoid } from "nanoid";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { COLORS } from "@/constants/theme";
import { usePantryStore } from "@/stores/pantry-store";
import type { PantryCategory, PantryItem } from "@/types/pantry";

const CATEGORIES: { id: PantryCategory; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: "proteins", label: "Proteins", icon: "fish-outline" },
  { id: "dairy", label: "Dairy", icon: "water-outline" },
  { id: "grains", label: "Grains", icon: "leaf-outline" },
  { id: "fruits", label: "Fruits", icon: "nutrition-outline" },
  { id: "vegetables", label: "Veggies", icon: "flower-outline" },
  { id: "snacks", label: "Snacks", icon: "pizza-outline" },
  { id: "other", label: "Other", icon: "cube-outline" },
];

export default function PantryScreen() {
  const router = useRouter();
  const items = usePantryStore((s) => s.items);
  const addItem = usePantryStore((s) => s.addItem);
  const removeItem = usePantryStore((s) => s.removeItem);
  const [filter, setFilter] = useState<PantryCategory | "all">("all");
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCat, setNewCat] = useState<PantryCategory>("other");
  const [newQty, setNewQty] = useState("1");

  const filtered = filter === "all" ? items : items.filter((i) => i.category === filter);

  const handleAdd = () => {
    if (!newName.trim()) return;
    addItem({ id: nanoid(), name: newName.trim(), category: newCat, quantity: Number(newQty) || 1, unit: "pcs", addedAt: new Date().toISOString() });
    setNewName(""); setNewQty("1"); setShowAdd(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <View className="flex-1 px-4 pt-4">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center gap-3">
            <Pressable onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color={COLORS.foreground} /></Pressable>
            <Text className="text-xl font-bold text-foreground">Pantry</Text>
            <Badge variant="secondary">{String(items.length)}</Badge>
          </View>
          <Pressable onPress={() => setShowAdd(!showAdd)} className="w-9 h-9 rounded-full bg-primary items-center justify-center">
            <Ionicons name={showAdd ? "close" : "add"} size={20} color={COLORS.primaryForeground} />
          </Pressable>
        </View>

        {/* Add form */}
        {showAdd && (
          <Card className="mb-4">
            <CardContent className="gap-3">
              <TextInput value={newName} onChangeText={setNewName} placeholder="Item name" placeholderTextColor={COLORS.mutedForeground} className="bg-accent border border-border rounded-xl px-4 py-3 text-foreground text-sm" />
              <View className="flex-row flex-wrap gap-2">
                {CATEGORIES.map((c) => (
                  <Pressable key={c.id} onPress={() => setNewCat(c.id)} className={`px-3 py-1.5 rounded-full border ${newCat === c.id ? "border-primary bg-primary/10" : "border-border"}`}>
                    <Text className={`text-xs ${newCat === c.id ? "text-primary" : "text-muted-foreground"}`}>{c.label}</Text>
                  </Pressable>
                ))}
              </View>
              <View className="flex-row gap-3">
                <TextInput value={newQty} onChangeText={setNewQty} keyboardType="numeric" placeholder="Qty" placeholderTextColor={COLORS.mutedForeground} className="flex-1 bg-accent border border-border rounded-xl px-4 py-3 text-foreground text-sm" />
                <Button onPress={handleAdd}><Text className="text-sm font-semibold text-primary-foreground">Add</Text></Button>
              </View>
            </CardContent>
          </Card>
        )}

        {/* Category filter */}
        <FlatList
          horizontal showsHorizontalScrollIndicator={false} className="mb-4" style={{ maxHeight: 40 }}
          data={[{ id: "all" as const, label: "All", icon: "grid-outline" as const }, ...CATEGORIES]}
          keyExtractor={(c) => c.id}
          renderItem={({ item: c }) => (
            <Pressable onPress={() => setFilter(c.id)} className={`px-3 py-1.5 rounded-full mr-2 ${filter === c.id ? "bg-primary" : "bg-card border border-border"}`}>
              <Text className={`text-xs ${filter === c.id ? "text-primary-foreground font-medium" : "text-muted-foreground"}`}>{c.label}</Text>
            </Pressable>
          )}
        />

        {/* Items */}
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 80 }}
          ListEmptyComponent={<View className="items-center py-16"><Ionicons name="basket-outline" size={40} color={COLORS.mutedForeground} style={{ opacity: 0.5 }} /><Text className="text-sm text-muted-foreground mt-3">Your pantry is empty</Text></View>}
          renderItem={({ item }) => (
            <View className="bg-card border border-border rounded-xl px-4 py-3 mb-2 flex-row items-center justify-between">
              <View>
                <Text className="text-sm font-medium text-foreground">{item.name}</Text>
                <Text className="text-xs text-muted-foreground capitalize">{item.category} - Qty: {item.quantity}</Text>
              </View>
              <Pressable onPress={() => removeItem(item.id)} hitSlop={10}>
                <Ionicons name="trash-outline" size={18} color={COLORS.destructive} />
              </Pressable>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}
