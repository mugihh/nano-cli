import { createSignal, onMount } from "solid-js";
import { render, useKeyboard } from "@opentui/solid";
import { ApiKeyScreen } from "./components/ApiKeyScreen";
import { ModelScreen, MODEL_OPTIONS } from "./components/ModelScreen";
import { AspectScreen, ASPECT_OPTIONS } from "./components/AspectScreen";
import { PathScreen, PATH_PRESETS } from "./components/PathScreen";
import { GenerateScreen } from "./components/GenerateScreen";
import { ResultScreen } from "./components/ResultScreen";
import { getConfig, saveConfig } from "./lib/config";
import { generateImages, generateImagesMock } from "./lib/gemini";
import { IS_MOCK } from "./lib/dev";
import type { Model, AspectRatio } from "./lib/gemini";

type Screen = "api-key" | "model" | "aspect" | "path" | "prompt" | "result";

render(() => {
  const config = getConfig();

  const [screen, setScreen] = createSignal<Screen>(
    IS_MOCK || config?.apiKey ? "model" : "api-key",
  );
  const [apiKey, setApiKey] = createSignal(config?.apiKey ?? "");
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

  let modelRef: any;
  let aspectRef: any;
  let pathRef: any;

  useKeyboard((key) => {
    const s = screen();
    if (s === "model" && modelRef) {
      if (key.name === "return") modelRef.selectCurrent();
    } else if (s === "aspect" && aspectRef) {
      if (key.name === "return") aspectRef.selectCurrent();
    } else if (s === "path") {
      console.log("path key", key.name, "pathRef", pathRef);
      if (pathRef && key.name === "return") pathRef.selectCurrent();
    } else if (s === "result") {
      if (key.name === "return" || key.name === "q") {
        setScreen("model");
      }
    }
  });

  const handleModelRef = (el: any) => {
    modelRef = el;
    el?.focus();
    setTimeout(() => {
      el?.on("itemSelected", (index: number) => {
        modelRef = null;
        setModel(MODEL_OPTIONS[index].value);
        setScreen("aspect");
      });
    }, 100);
  };

  const handleAspectRef = (el: any) => {
    aspectRef = el;
    el?.focus();
    setTimeout(() => {
      el?.on("itemSelected", (index: number) => {
        aspectRef = null;
        setAspectRatio(ASPECT_OPTIONS[index].value);
        setScreen("path");
      });
    }, 100);
  };

  const handlePathRef = (el: any) => {
    console.log("pathRef set", el);
    pathRef = el;
    el?.focus();
    setTimeout(() => {
      el?.on("itemSelected", (index: number) => {
        console.log("itemSelected", index);
        const selected = PATH_PRESETS[index];
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
        : await generateImages(apiKey(), {
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
      {screen() === "api-key" && (
        <ApiKeyScreen
          onSubmit={(key) => {
            saveConfig({ apiKey: key });
            setApiKey(key);
            setScreen("model");
          }}
        />
      )}
      {screen() === "model" && (
        <ModelScreen onSelect={(m) => setModel(m)} selectRef={handleModelRef} />
      )}
      {screen() === "aspect" && (
        <AspectScreen
          onSelect={(r) => setAspectRatio(r)}
          selectRef={handleAspectRef}
        />
      )}
      {screen() === "path" && (
        <PathScreen
          isCustom={isCustomPath()}
          selectRef={handlePathRef}
          onCustomSubmit={(path) => {
            setSavePath(path);
            setIsCustomPath(false); // reset
            setScreen("prompt");
          }}
        />
      )}
      {screen() === "prompt" && (
        <GenerateScreen onSubmit={handleGenerate} isLoading={isLoading()} />
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
          <text color="red">❌ {error()}</text>
        </box>
      )}
    </box>
  );
});
