"use client";

import {
  createContext,
  useContext,
  type ReactNode,
} from "react";

import type { RestaurantSettings } from "@/types/settings";

type SettingsContextType = {
  settings: RestaurantSettings;
};

const SettingsContext =
  createContext<SettingsContextType | null>(null);

type Props = {
  settings: RestaurantSettings;
  children: ReactNode;
};

export function SettingsProvider({
  settings,
  children,
}: Props) {
  return (
    <SettingsContext.Provider
      value={{ settings }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error(
      "useSettings debe usarse dentro de SettingsProvider"
    );
  }

  return context;
}