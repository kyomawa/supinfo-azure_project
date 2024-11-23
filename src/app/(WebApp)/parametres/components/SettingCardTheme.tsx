"use client";

import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

// ==================================================================================================================================

export default function SettingCardTheme() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const themeTranslations = {
    light: "Clair",
    dark: "Sombre",
    system: "Système",
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  const themeValue = mounted ? themeTranslations[theme as "light" | "dark" | "system"] : "Chargement...";

  return (
    <div className="flex flex-col gap-y-3">
      <Label className="text-sm font-medium text-neutral-500 dark:text-white/40">Thème</Label>
      <Select onValueChange={(value) => setTheme(value as "light" | "dark" | "system")}>
        <SelectTrigger>
          <SelectValue placeholder={themeValue} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">Clair</SelectItem>
          <SelectItem value="dark">Sombre</SelectItem>
          <SelectItem value="system">Système</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

// ==================================================================================================================================
