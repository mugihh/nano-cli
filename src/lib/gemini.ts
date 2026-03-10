// src/lib/gemini.ts
import { GoogleGenAI, Modality } from "@google/genai";
import { join } from "path";
import { mkdirSync } from "fs";
import { homedir } from "os";

export type Model = "nano-banana" | "nano-banana-pro";
export type AspectRatio = "1:1" | "16:9" | "9:16" | "4:3" | "3:4";

const MODEL_MAP: Record<Model, string> = {
  "nano-banana": "gemini-2.0-flash-preview-image-generation",
  "nano-banana-pro": "gemini-3.1-flash-image-preview",
};

export interface GenerateOptions {
  prompt: string;
  model: Model;
  aspectRatio: AspectRatio;
  savePath: string;
}

export interface GenerateResult {
  filePaths: string[];
  texts: string[];
}

function extractImageAndText(
  response: Awaited<
    ReturnType<InstanceType<typeof GoogleGenAI>["models"]["generateContent"]>
  >,
) {
  const parts = response.candidates?.[0]?.content?.parts;
  let imageBase64: string | null = null;
  let mimeType: string | null = null;
  let text: string | null = null;

  if (!parts) return { imageBase64, mimeType, text };

  for (const part of parts) {
    if (part.text) text = (text ?? "") + part.text;
    if (part.inlineData?.data && !imageBase64) {
      imageBase64 = part.inlineData.data;
      mimeType = part.inlineData.mimeType ?? "image/png";
    }
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
  const ai = new GoogleGenAI({ apiKey });

  const response = await ai.models.generateContent({
    model: MODEL_MAP[options.model],
    contents: options.prompt,
    config: {
      responseModalities: [Modality.TEXT, Modality.IMAGE],
      imageConfig: {
        aspectRatio: options.aspectRatio,
      },
    },
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
  // if (Math.random() > 0.7) throw new Error("Mock API error");

  return {
    filePaths: [`${resolvePath(options.savePath)}/mock-image-1234567890.png`],
    texts: ["Mock: Here is your generated image!"],
  };
}
