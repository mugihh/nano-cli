import { createSignal } from "solid-js";
import { render, useKeyboard } from "@opentui/solid";
import { ApiKeyScreen } from "./components/ApiKeyScreen";
import {
  ProviderScreen,
  PROVIDER_OPTIONS,
} from "./components/ProviderScreen";
import { ModelScreen, MODEL_OPTIONS } from "./components/ModelScreen";
import { AspectScreen, ASPECT_OPTIONS } from "./components/AspectScreen";
import { PathScreen, PATH_PRESETS } from "./components/PathScreen";
import { GenerateScreen } from "./components/GenerateScreen";
import { ResultScreen } from "./components/ResultScreen";
import { getConfig, hasApiKey, saveConfig } from "./lib/config";
import { generateImages, generateImagesMock } from "./lib/gemini";
import { IS_MOCK } from "./lib/dev";
import type { Model, AspectRatio } from "./lib/gemini";
import type { Provider } from "./lib/providers";

type Screen =
  | "provider"
  | "api-key"
  | "model"
  | "aspect"
  | "path"
  | "prompt"
  | "result";

render(() => {
  const config = getConfig();
  const initialProvider: Provider = config?.apiKey
    ? "gemini"
    : config?.openaiApiKey
      ? "openai"
      : "gemini";

  const [screen, setScreen] = createSignal<Screen>("provider");
  const [provider, setProvider] = createSignal<Provider>(initialProvider);
  const [geminiApiKey, setGeminiApiKey] = createSignal(config?.apiKey ?? "");
  const [openaiApiKey, setOpenaiApiKey] = createSignal(
    config?.openaiApiKey ?? "",
  );
  const [model, setModel] = createSignal<Model>("nano-banana");
  const [aspectRatio, setAspectRatio] = createSignal<AspectRatio>("1:1");
  const [savePath, setSavePath] = createSignal("./output");
  const [isCustomPath, setIsCustomPath] = createSignal(false);
  const [isLoading, setIsLoading] = createSignal(false);
  const [result, setResult] = createSignal<{
    filePaths: string[];
    texts: string[];
  } | null>(null);
  const [error, setError] = createSignal<string | null>(null);

  let providerRef: any;
  let modelRef: any;
  let aspectRef: any;
  let pathRef: any;

  useKeyboard((key) => {
    const s = screen();
    if (s === "provider" && providerRef) {
      if (key.name === "return") providerRef.selectCurrent();
    } else if (s === "model" && modelRef) {
      if (key.name === "return") modelRef.selectCurrent();
    } else if (s === "aspect" && aspectRef) {
      if (key.name === "return") aspectRef.selectCurrent();
    } else if (s === "path") {
      if (pathRef && key.name === "return") pathRef.selectCurrent();
    } else if (s === "result") {
      if (key.name === "return" || key.name === "q") {
        setScreen("model");
      }
    }
  });

  const handleProviderRef = (el: any) => {
    providerRef = el;
    el?.focus();
    setTimeout(() => {
      el?.on("itemSelected", (index: number) => {
        const selected = PROVIDER_OPTIONS[index];
        if (!selected) return;

        providerRef = null;
        setProvider(selected.value);

        if (selected.value === "openai") {
          setError(
            "OpenAI provider is selected, but the OpenAI model/settings flow will be wired in the next step.",
          );
          return;
        }

        setError(null);
        setScreen(IS_MOCK || hasApiKey(selected.value) ? "model" : "api-key");
      });
    }, 100);
  };

  const handleModelRef = (el: any) => {
    modelRef = el;
    el?.focus();
    setTimeout(() => {
      el?.on("itemSelected", (index: number) => {
        const selected = MODEL_OPTIONS[index];
        if (!selected) return;

        modelRef = null;
        setModel(selected.value);
        setScreen("aspect");
      });
    }, 100);
  };

  const handleAspectRef = (el: any) => {
    aspectRef = el;
    el?.focus();
    setTimeout(() => {
      el?.on("itemSelected", (index: number) => {
        const selected = ASPECT_OPTIONS[index];
        if (!selected) return;

        aspectRef = null;
        setAspectRatio(selected.value);
        setScreen("path");
      });
    }, 100);
  };

  const handlePathRef = (el: any) => {
    pathRef = el;
    el?.focus();
    setTimeout(() => {
      el?.on("itemSelected", (index: number) => {
        const selected = PATH_PRESETS[index];
        if (!selected) return;

        if (selected.value === "custom") {
          pathRef = null;
          setIsCustomPath(true);
        } else {
          pathRef = null;
          setSavePath(selected.value);
          setScreen("prompt");
        }
      });
    }, 100);
  };

  async function handleGenerate(prompt: string) {
    setIsLoading(true);
    setError(null);
    try {
      const res = IS_MOCK
        ? await generateImagesMock({
            prompt,
            model: model(),
            aspectRatio: aspectRatio(),
            savePath: savePath(),
          })
        : await generateImages(geminiApiKey(), {
            prompt,
            model: model(),
            aspectRatio: aspectRatio(),
            savePath: savePath(),
          });
      setResult(res);
      setScreen("result");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <box flexGrow={1} flexDirection="column">
      {screen() === "provider" && (
        <ProviderScreen selectRef={handleProviderRef} />
      )}
      {screen() === "api-key" && (
        <ApiKeyScreen
          provider={provider()}
          initialValue={
            provider() === "gemini" ? geminiApiKey() : openaiApiKey()
          }
          onSubmit={(key) => {
            if (provider() === "gemini") {
              saveConfig({ apiKey: key });
              setGeminiApiKey(key);
            } else {
              saveConfig({ openaiApiKey: key });
              setOpenaiApiKey(key);
            }
            setScreen("model");
          }}
        />
      )}
      {screen() === "model" && (
        <ModelScreen
          onSelect={(m) => setModel(m)}
          selectRef={handleModelRef}
          step="Step 2 / 5"
        />
      )}
      {screen() === "aspect" && (
        <AspectScreen
          onSelect={(r) => setAspectRatio(r)}
          selectRef={handleAspectRef}
          step="Step 3 / 5"
        />
      )}
      {screen() === "path" && (
        <PathScreen
          isCustom={isCustomPath()}
          selectRef={handlePathRef}
          step="Step 4 / 5"
          onCustomSubmit={(path) => {
            setSavePath(path);
            setIsCustomPath(false); // reset
            setScreen("prompt");
          }}
        />
      )}
      {screen() === "prompt" && (
        <GenerateScreen
          onSubmit={handleGenerate}
          isLoading={isLoading()}
          step="Step 5 / 5"
        />
      )}
      {screen() === "result" && result() && (
        <ResultScreen
          filePaths={result()!.filePaths}
          texts={result()!.texts}
          onBack={() => setScreen("model")}
        />
      )}
      {error() && (
        <box justifyContent="center" marginTop={1}>
          <text style={{ fg: "red" }}>❌ {error()}</text>
        </box>
      )}
    </box>
  );
});
