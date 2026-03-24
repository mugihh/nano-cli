// src/components/AspectScreen.tsx
import type { AspectRatio } from "../lib/gemini";
import type { ImageSize } from "../lib/openai";

type AnyRatio = AspectRatio | ImageSize;

interface Props<T extends AnyRatio> {
  onSelect: (value: T) => void;
  selectRef: (el: any) => void;
  options: { name: string; description: string; value: T }[];
  step?: string;
}

// Gemini presets
export const ASPECT_OPTIONS = [
  { name: "1:1", description: "Square", value: "1:1" as AspectRatio },
  { name: "16:9", description: "Landscape", value: "16:9" as AspectRatio },
  { name: "9:16", description: "Portrait", value: "9:16" as AspectRatio },
  { name: "4:3", description: "Standard", value: "4:3" as AspectRatio },
  {
    name: "3:4",
    description: "Portrait standard",
    value: "3:4" as AspectRatio,
  },
];

// OpenAI presets
export const SIZE_OPTIONS = [
  { name: "1024×1024", description: "Square", value: "1024x1024" as ImageSize },
  {
    name: "1024×1536",
    description: "Portrait",
    value: "1024x1536" as ImageSize,
  },
  {
    name: "1536×1024",
    description: "Landscape",
    value: "1536x1024" as ImageSize,
  },
  {
    name: "Auto",
    description: "Let the model decide",
    value: "auto" as ImageSize,
  },
];

export function AspectScreen<T extends AnyRatio>(props: Props<T>) {
  return (
    <box
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      flexGrow={1}
      gap={1}
    >
      <ascii_font font="tiny" text="nano-cli" />
      <text>🍌 {props.step ?? "Step 2 / 4"} — Choose size / ratio</text>
      <select
        ref={props.selectRef}
        options={props.options}
        width={50}
        height={7}
      />
      <text color="gray">↑ ↓ to move, Enter to confirm</text>
    </box>
  );
}
