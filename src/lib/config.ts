// src/lib/config.ts
import { homedir } from "os";
import { join } from "path";
import { mkdirSync, existsSync, readFileSync, writeFileSync } from "fs";

const CONFIG_DIR = join(homedir(), ".config", "nano-cli");
const CONFIG_PATH = join(CONFIG_DIR, "config.json");

interface Config {
  apiKey: string;
}

export function getConfig(): Config | null {
  if (!existsSync(CONFIG_PATH)) return null;
  try {
    return JSON.parse(readFileSync(CONFIG_PATH, "utf-8"));
  } catch {
    return null;
  }
}

export function saveConfig(config: Config): void {
  mkdirSync(CONFIG_DIR, { recursive: true });
  writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
}

export function hasApiKey(): boolean {
  return getConfig()?.apiKey != null;
}
