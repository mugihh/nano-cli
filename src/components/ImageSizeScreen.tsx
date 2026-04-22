// src/components/ImageSizeScreen.tsx
import type { ImageSize } from "../lib/openai";

interface Props {
  onSelect: (value: ImageSize) => void;
  selectRef: (el: any) => void;
  step?: string;
}

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

export function ImageSizeScreen(props: Props) {
  return (
    <box
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      flexGrow={1}
      gap={1}
    >
      <ascii_font font="tiny" text="nano-cli" />
      <text>🍌 {props.step ?? "Step 2 / 4"} — Choose image size</text>
      <select
        ref={props.selectRef}
        options={SIZE_OPTIONS}
        width={50}
        height={6}
      />
      <text style={{ fg: "gray" }}>↑ ↓ to move, Enter to confirm</text>
    </box>
  );
}
