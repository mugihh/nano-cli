import { createSignal } from "solid-js";
import { render, useKeyboard } from "@opentui/solid";
import { ApiKeyScreen } from "./components/ApiKeyScreen";
import {
  ProviderScreen,
  PROVIDER_OPTIONS,
} from "./components/ProviderScreen";
import {
  ModelScreen,
  GEMINI_MODEL_OPTIONS,
  OPENAI_MODEL_OPTIONS,
} from "./components/ModelScreen";
import { AspectScreen, ASPECT_OPTIONS } from "./components/AspectScreen";
import {
  ImageSizeScreen,
  SIZE_OPTIONS,
} from "./components/ImageSizeScreen";
import { PathScreen, PATH_PRESETS } from "./components/PathScreen";
import { GenerateScreen } from "./components/GenerateScreen";
import { ResultScreen } from "./components/ResultScreen";
import { getConfig, hasApiKey, saveConfig } from "./lib/config";
import {
  generateImages as generateGeminiImages,
  generateImagesMock as generateGeminiImagesMock,
} from "./lib/gemini";
import {
  generateImages as generateOpenAIImages,
  generateImagesMock as generateOpenAIImagesMock,
} from "./lib/openai";
import { IS_MOCK } from "./lib/dev";
import type { Model as GeminiModel, AspectRatio } from "./lib/gemini";
import type { Model as OpenAIModel, ImageSize } from "./lib/openai";
import type { Provider } from "./lib/providers";

type Screen =
  | "provider"
  | "api-key"
  | "model"
  | "aspect"
  | "image-size"
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
  const [geminiModel, setGeminiModel] =
    createSignal<GeminiModel>("nano-banana");
  const [openaiModel, setOpenaiModel] =
    createSignal<OpenAIModel>("gpt-image-2");
  const [aspectRatio, setAspectRatio] = createSignal<AspectRatio>("1:1");
  const [imageSize, setImageSize] = createSignal<ImageSize>("auto");
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
  let imageSizeRef: any;
  let pathRef: any;

  function goBack() {
    const currentScreen = screen();

    if (currentScreen === "provider") return;

    if (currentScreen === "api-key") {
      setError(null);
      setScreen("provider");
      return;
    }

    if (currentScreen === "model") {
      setError(null);
      setScreen("provider");
      return;
    }

    if (currentScreen === "aspect" || currentScreen === "image-size") {
      setError(null);
      setScreen("model");
      return;
    }

    if (currentScreen === "path") {
      setError(null);
      if (isCustomPath()) {
        setIsCustomPath(false);
        return;
      }

      setScreen(provider() === "gemini" ? "aspect" : "image-size");
      return;
    }

    if (currentScreen === "prompt") {
      setError(null);
      setScreen("path");
      return;
    }

    if (currentScreen === "result") {
      setError(null);
      setScreen("prompt");
    }
  }

  useKeyboard((key) => {
    const s = screen();
    if (key.name === "escape") {
      goBack();
      return;
    }

    if (s === "provider" && providerRef) {
      if (key.name === "return") providerRef.selectCurrent();
    } else if (s === "model" && modelRef) {
      if (key.name === "return") modelRef.selectCurrent();
    } else if (s === "aspect" && aspectRef) {
      if (key.name === "return") aspectRef.selectCurrent();
    } else if (s === "image-size" && imageSizeRef) {
      if (key.name === "return") imageSizeRef.selectCurrent();
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
        const selected =
          provider() === "gemini"
            ? GEMINI_MODEL_OPTIONS[index]
            : OPENAI_MODEL_OPTIONS[index];
        if (!selected) return;

        modelRef = null;
        if (provider() === "gemini") {
          setGeminiModel(selected.value as GeminiModel);
          setScreen("aspect");
        } else {
          setOpenaiModel(selected.value as OpenAIModel);
          setScreen("image-size");
        }
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

  const handleImageSizeRef = (el: any) => {
    imageSizeRef = el;
    el?.focus();
    setTimeout(() => {
      el?.on("itemSelected", (index: number) => {
        const selected = SIZE_OPTIONS[index];
        if (!selected) return;

        imageSizeRef = null;
        setImageSize(selected.value);
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
        ? provider() === "gemini"
          ? await generateGeminiImagesMock({
              prompt,
              model: geminiModel(),
              aspectRatio: aspectRatio(),
              savePath: savePath(),
            })
          : await generateOpenAIImagesMock({
              prompt,
              model: openaiModel(),
              imageSize: imageSize(),
              savePath: savePath(),
            })
        : provider() === "gemini"
          ? await generateGeminiImages(geminiApiKey(), {
              prompt,
              model: geminiModel(),
              aspectRatio: aspectRatio(),
              savePath: savePath(),
            })
          : await generateOpenAIImages(openaiApiKey(), {
              prompt,
              model: openaiModel(),
              imageSize: imageSize(),
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
          options={
            provider() === "gemini"
              ? GEMINI_MODEL_OPTIONS
              : OPENAI_MODEL_OPTIONS
          }
          selectRef={handleModelRef}
          step="Step 2 / 5"
        />
      )}
      {screen() === "aspect" && provider() === "gemini" && (
        <AspectScreen
          onSelect={(r) => setAspectRatio(r)}
          selectRef={handleAspectRef}
          step="Step 3 / 5"
        />
      )}
      {screen() === "image-size" && provider() === "openai" && (
        <ImageSizeScreen
          onSelect={(size) => setImageSize(size)}
          selectRef={handleImageSizeRef}
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
