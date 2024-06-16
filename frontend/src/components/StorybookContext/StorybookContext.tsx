import { createContext } from "react";

export interface StorybookContextSchema {
  didJoinGame?: boolean;
}

export const StorybookContext = createContext<StorybookContextSchema | null>(null);
