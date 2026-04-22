// src/types.ts
import type { Model as GeminiModel, AspectRatio } from "./lib/gemini";
import type { Model as OpenAIModel, ImageSize } from "./lib/openai";
import type { Provider } from "./lib/providers";

export type AppScreen =
  | "provider"
  | "api-key"
  | "model"
  | "aspect"
  | "image-size"
  | "path"
  | "prompt"
  | "result";

export interface AppState {
  screen: AppScreen;
  provider: Provider;
  geminiApiKey: string;
  openaiApiKey: string;
  prompt: string;
  geminiModel: GeminiModel;
  openaiModel: OpenAIModel;
  aspectRatio: AspectRatio;
  imageSize: ImageSize;
  savePath: string;
  isCustomPath: boolean;
  isLoading: boolean;
  result: {
    filePaths: string[];
    texts: string[];
  } | null;
  error: string | null;
}
