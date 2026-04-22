// src/lib/openai.ts
import OpenAI from "openai";
import { join } from "path";
import { mkdirSync } from "fs";
import { homedir } from "os";

export type Model = "gpt-image-2";
export type ImageSize = "1024x1024" | "1536x1024" | "1024x1536" | "auto";

const MODEL_MAP: Record<Model, string> = {
  "gpt-image-2": "gpt-image-2",
};

export interface GenerateOptions {
  prompt: string;
  model: Model;
  imageSize: ImageSize;
  savePath: string;
}

export interface GenerateResult {
  filePaths: string[];
  texts: string[];
}

function extractImageAndText(
  response: Awaited<
    ReturnType<InstanceType<typeof OpenAI>["images"]["generate"]>
  >,
) {
  let imageBase64: string | null = null;
  let mimeType: string | null = null;
  let text: string | null = null;

  if (!("data" in response)) return { imageBase64, mimeType, text };

  const image = response.data?.[0];

  if (!image) return { imageBase64, mimeType, text };

  if (image.b64_json) {
    imageBase64 = image.b64_json;
    mimeType = "image/png";
  }

  if (image.revised_prompt) {
    text = image.revised_prompt;
  }

  return { imageBase64, mimeType, text };
}

function resolvePath(inputPath: string): string {
  if (inputPath.startsWith("~/")) {
    return join(homedir(), inputPath.slice(2));
  }
  return inputPath;
}

export async function generateImages(
  apiKey: string,
  options: GenerateOptions,
): Promise<GenerateResult> {
  const ai = new OpenAI({ apiKey });

  const response = await ai.images.generate({
    model: MODEL_MAP[options.model],
    prompt: options.prompt,
    ...(options.imageSize === "auto" ? {} : { size: options.imageSize }),
  });

  const { imageBase64, mimeType, text } = extractImageAndText(response);

  if (!imageBase64) throw new Error("No image returned from API");

  const outputDir = resolvePath(options.savePath);
  mkdirSync(outputDir, { recursive: true });

  const timestamp = Date.now();
  const ext = mimeType?.includes("jpeg") ? "jpg" : "png";
  const fileName = `${timestamp}.${ext}`;
  const filePath = join(outputDir, fileName);

  await Bun.write(filePath, Buffer.from(imageBase64, "base64"));

  return {
    filePaths: [filePath],
    texts: text ? [text] : [],
  };
}

export async function generateImagesMock(
  options: GenerateOptions,
): Promise<GenerateResult> {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const outputDir = resolvePath(options.savePath);
  mkdirSync(outputDir, { recursive: true });

  const mockImagePath = join(import.meta.dir, "mock-image.jpeg");
  const fileName = `mock-${Date.now()}.png`;
  const filePath = join(outputDir, fileName);

  await Bun.write(filePath, Bun.file(mockImagePath));

  return {
    filePaths: [filePath],
    texts: ["Mock: Here is your generated image!"],
  };
}
