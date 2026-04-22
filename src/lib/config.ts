// src/lib/config.ts
import { homedir } from "os";
import { join } from "path";
import { mkdirSync, existsSync, readFileSync, writeFileSync } from "fs";
import type { Provider } from "./providers";

const CONFIG_DIR = join(homedir(), ".config", "nano-cli");
const CONFIG_PATH = join(CONFIG_DIR, "config.json");

interface Config {
  apiKey?: string; // Gemini
  openaiApiKey?: string; // OpenAI
}

export function getConfig(): Config | null {
  if (!existsSync(CONFIG_PATH)) return null;
  try {
    return JSON.parse(readFileSync(CONFIG_PATH, "utf-8"));
  } catch {
    return null;
  }
}

export function saveConfig(partial: Partial<Config>): void {
  mkdirSync(CONFIG_DIR, { recursive: true });
  const existing = getConfig() ?? {};
  writeFileSync(
    CONFIG_PATH,
    JSON.stringify({ ...existing, ...partial }, null, 2),
  );
}

export function hasApiKey(provider: Provider): boolean {
  const config = getConfig();
  return provider === "gemini"
    ? config?.apiKey != null
    : config?.openaiApiKey != null;
}
