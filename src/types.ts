// src/types.ts
import type { Model, AspectRatio } from "./lib/gemini";

export type AppScreen = "api-key" | "generate" | "result";

export interface AppState {
  screen: AppScreen;
  apiKey: string;
  prompt: string;
  model: Model;
  aspectRatio: AspectRatio;
  isLoading: boolean;
  result: {
    filePaths: string[];
    texts: string[];
  } | null;
  error: string | null;
}
