"use client";

import { useState, useMemo } from "react";
import {
  User,
  Scale,
  Ruler,
  Calendar,
  Target,
  Activity,
  Flame,
  Globe,
  Languages,
  Trash2,
  Edit,
  Plus,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { ProgressChart } from "@/components/profile/ProgressChart";
import { useUserStore } from "@/stores/user-store";
import { useMealPlanStore } from "@/stores/meal-plan-store";
import { useDailyLogStore } from "@/stores/daily-log-store";
import { useAppStore } from "@/stores/app-store";
import {
  calculateBMR,
  calculateTDEE,
  calculateMacroTargets,
  getGoalLabel,
  getActivityLabel,
} from "@/lib/nutrition";
import type { FitnessGoal, DietType } from "@/types/user";

const COUNTRIES = [
  { value: "us", label: "United States" },
  { value: "mx", label: "Mexico" },
  { value: "co", label: "Colombia" },
  { value: "ar", label: "Argentina" },
  { value: "br", label: "Brazil" },
  { value: "es", label: "Spain" },
  { value: "it", label: "Italy" },
  { value: "fr", label: "France" },
  { value: "de", label: "Germany" },
  { value: "gb", label: "United Kingdom" },
  { value: "jp", label: "Japan" },
  { value: "cn", label: "China" },
  { value: "in", label: "India" },
  { value: "th", label: "Thailand" },
  { value: "kr", label: "South Korea" },
  { value: "lb", label: "Lebanon" },
  { value: "tr", label: "Turkey" },
  { value: "ma", label: "Morocco" },
  { value: "ng", label: "Nigeria" },
  { value: "au", label: "Australia" },
];

const DIET_TYPES: { value: DietType; label: string }[] = [
  { value: "balanced", label: "Balanced" },
  { value: "high_protein", label: "High Protein" },
  { value: "keto", label: "Keto" },
  { value: "mediterranean", label: "Mediterranean" },
  { value: "iifym", label: "IIFYM" },
];

export default function ProfilePage() {
  const { profile, updateProfile, addWeightEntry, clearProfile } =
    useUserStore();
  const clearPlan = useMealPlanStore((s) => s.clearPlan);
  const locale = useAppStore((s) => s.locale);
  const setLocale = useAppStore((s) => s.setLocale);

  const [weightInput, setWeightInput] = useState("");
  const [showWeightDialog, setShowWeightDialog] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [showEditSheet, setShowEditSheet] = useState(false);

  // Edit form state
  const [editName, setEditName] = useState(profile?.name ?? "");
  const [editAge, setEditAge] = useState(String(profile?.age ?? ""));
  const [editHeightCm, setEditHeightCm] = useState(
    String(profile?.heightCm ?? "")
  );
  const [editCountry, setEditCountry] = useState(profile?.country ?? "us");
  const [editDietType, setEditDietType] = useState<DietType>(
    profile?.dietType ?? "balanced"
  );

  const nutritionData = useMemo(() => {
    if (!profile) return null;
    const bmrResult = calculateBMR(
      profile.sex,
      profile.weightKg,
      profile.heightCm,
      profile.age
    );
    const tdeeResult = calculateTDEE(bmrResult.bmr, profile.activityLevel);
    const macroTargets = calculateMacroTargets(profile);
    return { bmr: bmrResult.bmr, tdee: tdeeResult.tdee, macros: macroTargets };
  }, [profile]);

  if (!profile) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center py-20">
          <User className="mb-4 h-12 w-12 text-muted-foreground" />
          <h2 className="text-lg font-semibold">No Profile</h2>
          <p className="text-sm text-muted-foreground">
            Complete onboarding to set up your profile.
          </p>
        </div>
      </PageContainer>
    );
  }

  const initials = profile.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleLogWeight = () => {
    const weight = parseFloat(weightInput);
    if (isNaN(weight) || weight <= 0) return;
    addWeightEntry(weight);
    setWeightInput("");
    setShowWeightDialog(false);
  };

  const handleSaveProfile = () => {
    const updates: Record<string, unknown> = {};
    if (editName.trim()) updates.name = editName.trim();
    const age = parseInt(editAge, 10);
    if (!isNaN(age) && age > 0 && age <= 150) updates.age = age;
    const height = parseFloat(editHeightCm);
    if (!isNaN(height) && height > 0) updates.heightCm = height;
    if (editCountry) updates.country = editCountry;
    if (editDietType) updates.dietType = editDietType;
    updateProfile(updates);
    setShowEditSheet(false);
  };

  const handleClearData = () => {
    clearProfile();
    clearPlan();
    setShowClearDialog(false);
  };

  const openEditSheet = () => {
    setEditName(profile.name);
    setEditAge(String(profile.age));
    setEditHeightCm(String(profile.heightCm));
    setEditCountry(profile.country);
    setEditDietType(profile.dietType);
    setShowEditSheet(true);
  };

  const weightProgress = useMemo(() => {
    if (!profile.targetWeightKg || profile.weightLog.length === 0) return null;
    const startWeight = profile.weightLog[0].weightKg;
    const currentWeight = profile.weightKg;
    const targetWeight = profile.targetWeightKg;
    const totalChange = Math.abs(targetWeight - startWeight);
    const currentChange = Math.abs(currentWeight - startWeight);
    if (totalChange === 0) return 100;
    return Math.min(100, Math.round((currentChange / totalChange) * 100));
  }, [profile]);

  return (
    <PageContainer>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold">Profile</h1>
        <Button variant="outline" size="sm" className="gap-1.5" onClick={openEditSheet}>
          <Edit className="h-3.5 w-3.5" />
          Edit
        </Button>
      </div>

      {/* Avatar & Name */}
      <div className="mb-6 flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 text-xl font-bold text-primary">
          {initials}
        </div>
        <div>
          <h2 className="text-lg font-semibold">{profile.name}</h2>
          <div className="flex items-center gap-2 mt-0.5">
            <Badge variant="default" className="text-[10px]">
              {getGoalLabel(profile.goal)}
            </Badge>
            <Badge variant="secondary" className="text-[10px] capitalize">
              {profile.dietType.replace("_", " ")}
            </Badge>
          </div>
        </div>
      </div>

      {/* Personal Info */}
      <Card className="mb-4 border-border/50 bg-card/80">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Age</p>
                <p className="text-sm font-medium">{profile.age} years</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Ruler className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Height</p>
                <p className="text-sm font-medium">{profile.heightCm} cm</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Scale className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Weight</p>
                <p className="text-sm font-medium">
                  {profile.weightKg.toFixed(1)} kg
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Activity</p>
                <p className="text-sm font-medium capitalize">
                  {profile.activityLevel.replace("_", " ")}
                </p>
              </div>
            </div>
          </div>

          {profile.targetWeightKg && (
            <>
              <Separator className="my-3" />
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">Target Weight</span>
                </div>
                <span className="font-medium">
                  {profile.targetWeightKg.toFixed(1)} kg
                </span>
              </div>
              {weightProgress !== null && (
                <div className="mt-2">
                  <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                    <span>Progress</span>
                    <span>{weightProgress}%</span>
                  </div>
                  <Progress value={weightProgress} className="h-1.5" />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Nutrition Targets */}
      {nutritionData && (
        <Card className="mb-4 border-border/50 bg-card/80">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Flame className="h-4 w-4 text-primary" />
              Nutrition Targets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="rounded-lg bg-background/50 p-3 text-center">
                <p className="text-[10px] text-muted-foreground">BMR</p>
                <p className="text-lg font-bold">{nutritionData.bmr}</p>
                <p className="text-[10px] text-muted-foreground">kcal/day</p>
              </div>
              <div className="rounded-lg bg-background/50 p-3 text-center">
                <p className="text-[10px] text-muted-foreground">TDEE</p>
                <p className="text-lg font-bold">{nutritionData.tdee}</p>
                <p className="text-[10px] text-muted-foreground">kcal/day</p>
              </div>
            </div>

            <div className="rounded-lg bg-primary/5 border border-primary/20 p-3 mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">
                  Daily Calories
                </span>
                <span className="text-sm font-bold text-primary">
                  {nutritionData.macros.calories} kcal
                </span>
              </div>
              {nutritionData.macros.deficit !== 0 && (
                <p className="text-[10px] text-muted-foreground">
                  {nutritionData.macros.deficit > 0 ? "+" : ""}
                  {nutritionData.macros.deficit} kcal from TDEE
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-blue-400">
                    Protein ({nutritionData.macros.proteinPercent}%)
                  </span>
                  <span className="font-medium">
                    {nutritionData.macros.protein}g
                  </span>
                </div>
                <Progress
                  value={nutritionData.macros.proteinPercent}
                  className="h-1.5 bg-blue-400/20 [&>div]:bg-blue-400"
                />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-amber-400">
                    Carbs ({nutritionData.macros.carbsPercent}%)
                  </span>
                  <span className="font-medium">
                    {nutritionData.macros.carbohydrates}g
                  </span>
                </div>
                <Progress
                  value={nutritionData.macros.carbsPercent}
                  className="h-1.5 bg-amber-400/20 [&>div]:bg-amber-400"
                />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-rose-400">
                    Fat ({nutritionData.macros.fatPercent}%)
                  </span>
                  <span className="font-medium">
                    {nutritionData.macros.fat}g
                  </span>
                </div>
                <Progress
                  value={nutritionData.macros.fatPercent}
                  className="h-1.5 bg-rose-400/20 [&>div]:bg-rose-400"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Weight Progress Chart */}
      <div className="mb-4">
        <ProgressChart weightLog={profile.weightLog} />
      </div>

      {/* Log Weight Button */}
      <Button
        className="mb-4 w-full gap-2"
        onClick={() => setShowWeightDialog(true)}
      >
        <Plus className="h-4 w-4" />
        Log Weight
      </Button>

      {/* Settings Cards */}
      <Card className="mb-4 border-border/50 bg-card/80">
        <CardContent className="divide-y divide-border/30 p-0">
          {/* Language */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Languages className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Language</p>
                <p className="text-[10px] text-muted-foreground">
                  App display language
                </p>
              </div>
            </div>
            <Select value={locale} onValueChange={setLocale}>
              <SelectTrigger className="w-20 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">EN</SelectItem>
                <SelectItem value="es">ES</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Country */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Country</p>
                <p className="text-[10px] text-muted-foreground">
                  {COUNTRIES.find((c) => c.value === profile.country)
                    ?.label ?? profile.country}
                </p>
              </div>
            </div>
            <Select
              value={profile.country}
              onValueChange={(val) => updateProfile({ country: val })}
            >
              <SelectTrigger className="w-28 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Diet Preferences */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Flame className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Diet Type</p>
                <p className="text-[10px] text-muted-foreground capitalize">
                  {profile.dietType.replace("_", " ")}
                </p>
              </div>
            </div>
            <Select
              value={profile.dietType}
              onValueChange={(val) =>
                updateProfile({ dietType: val as DietType })
              }
            >
              <SelectTrigger className="w-32 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DIET_TYPES.map((d) => (
                  <SelectItem key={d.value} value={d.value}>
                    {d.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Dietary Restrictions */}
      {(profile.dietaryRestrictions.length > 0 ||
        profile.allergies.length > 0) && (
        <Card className="mb-4 border-border/50 bg-card/80">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Dietary Info</CardTitle>
          </CardHeader>
          <CardContent>
            {profile.dietaryRestrictions.length > 0 && (
              <div className="mb-2">
                <p className="text-xs text-muted-foreground mb-1">
                  Restrictions
                </p>
                <div className="flex flex-wrap gap-1">
                  {profile.dietaryRestrictions.map((r) => (
                    <Badge key={r} variant="secondary" className="text-[10px]">
                      {r}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {profile.allergies.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">Allergies</p>
                <div className="flex flex-wrap gap-1">
                  {profile.allergies.map((a) => (
                    <Badge
                      key={a}
                      variant="destructive"
                      className="text-[10px]"
                    >
                      {a}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Danger Zone */}
      <Card className="mb-8 border-destructive/30 bg-destructive/5">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <div>
                <p className="text-sm font-medium">Clear All Data</p>
                <p className="text-[10px] text-muted-foreground">
                  Delete profile, meal plans, and all logs
                </p>
              </div>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowClearDialog(true)}
            >
              <Trash2 className="mr-1.5 h-3.5 w-3.5" />
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Log Weight Dialog */}
      <Dialog open={showWeightDialog} onOpenChange={setShowWeightDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log Weight</DialogTitle>
            <DialogDescription>
              Enter your current weight to track progress.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="weight-input">Weight (kg)</Label>
              <Input
                id="weight-input"
                type="number"
                step="0.1"
                min="20"
                max="300"
                placeholder={String(profile.weightKg)}
                value={weightInput}
                onChange={(e) => setWeightInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogWeight()}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Current: {profile.weightKg.toFixed(1)} kg
              {profile.targetWeightKg &&
                ` | Target: ${profile.targetWeightKg.toFixed(1)} kg`}
            </p>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleLogWeight}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Clear Data Confirmation Dialog */}
      <Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Clear All Data
            </DialogTitle>
            <DialogDescription>
              This will permanently delete your profile, meal plans, daily
              logs, and all other data. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleClearData}>
              Delete Everything
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Profile Sheet */}
      <Sheet open={showEditSheet} onOpenChange={setShowEditSheet}>
        <SheetContent side="bottom" className="max-h-[85vh] rounded-t-2xl">
          <SheetHeader>
            <SheetTitle>Edit Profile</SheetTitle>
            <SheetDescription>Update your personal information.</SheetDescription>
          </SheetHeader>

          <div className="space-y-4 px-4 py-4">
            <div className="space-y-1.5">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Your name"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="edit-age">Age</Label>
                <Input
                  id="edit-age"
                  type="number"
                  value={editAge}
                  onChange={(e) => setEditAge(e.target.value)}
                  placeholder="25"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-height">Height (cm)</Label>
                <Input
                  id="edit-height"
                  type="number"
                  value={editHeightCm}
                  onChange={(e) => setEditHeightCm(e.target.value)}
                  placeholder="175"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Country</Label>
              <Select value={editCountry} onValueChange={setEditCountry}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Diet Type</Label>
              <Select
                value={editDietType}
                onValueChange={(v) => setEditDietType(v as DietType)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DIET_TYPES.map((d) => (
                    <SelectItem key={d.value} value={d.value}>
                      {d.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <SheetFooter>
            <Button className="w-full" onClick={handleSaveProfile}>
              Save Changes
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </PageContainer>
  );
}
