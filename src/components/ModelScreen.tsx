import { onMount, onCleanup } from "solid-js";
import type { Model } from "../lib/gemini";

interface Props {
  onSelect: (model: Model) => void;
  selectRef: (el: any) => void;
}

const OPTIONS = [
  {
    name: "Nano Banana",
    description: "gemini-2.0-flash — faster, cheaper",
    value: "nano-banana" as Model,
  },
  {
    name: "Nano Banana Pro",
    description: "gemini-3.1-flash — higher quality",
    value: "nano-banana-pro" as Model,
  },
];

export { OPTIONS as MODEL_OPTIONS };

export function ModelScreen(props: Props) {
  return (
    <box
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      flexGrow={1}
      gap={1}
    >
      <ascii_font font="tiny" text="nano-cli" />
      <text>🍌 Step 1 / 3 — Choose a model</text>
      <select ref={props.selectRef} options={OPTIONS} width={50} height={4} />
      <text color="gray">↑ ↓ to move, Enter to confirm</text>
    </box>
  );
}
