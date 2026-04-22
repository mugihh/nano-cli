// PathScreen.tsx
import { createSignal } from "solid-js";
import { Show } from "solid-js";

interface Props {
  isCustom: boolean;
  selectRef: (el: any) => void;
  onCustomSubmit: (path: string) => void;
  step?: string;
}

export const PATH_PRESETS = [
  {
    name: "~/Pictures/nano-cli",
    description: "Save to your Pictures folder",
    value: "~/Pictures/nano-cli",
  },
  {
    name: "./output",
    description: "Save to a local output folder",
    value: "./output",
  },
  {
    name: "Custom...",
    description: "Enter a custom save path",
    value: "custom",
  },
];

export function PathScreen(props: Props) {
  const [value, setValue] = createSignal("");

  return (
    <box
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      flexGrow={1}
      gap={1}
    >
      <ascii_font font="tiny" text="nano-cli" />
      <Show
        when={props.isCustom}
        fallback={
          <>
            <text>🍌 {props.step ?? "Step 3 / 4"} — Save path</text>
            <select
              ref={props.selectRef}
              options={PATH_PRESETS}
              width={50}
              height={5}
            />
            <text style={{ fg: "gray" }}>↑ ↓ to move, Enter to confirm</text>
          </>
        }
      >
        <text>🍌 {props.step ?? "Step 3 / 4"} — Custom save path</text>
        <input
          value={value()}
          onChange={(v: string) => setValue(v)}
          onSubmit={() => props.onCustomSubmit(value())}
          width={50}
          placeholder="e.g. /Users/you/Desktop/images"
        />
        <text style={{ fg: "gray" }}>Enter to confirm</text>
      </Show>
    </box>
  );
}
