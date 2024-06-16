import { createContext } from "react";

export interface MatchSettingsModalContextSchema {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

export const MatchSettingsModalContext = createContext<MatchSettingsModalContextSchema | null>(null);