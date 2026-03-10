import { createSignal } from "solid-js";

interface Props {
  onSubmit: (path: string) => void;
}

const PRESETS = [
  { name: "~/Pictures/nano-cli", value: "~/Pictures/nano-cli" },
  { name: "./output", value: "./output" },
  { name: "Custom...", value: "custom" },
];

export function PathScreen(props: Props) {
  const [isCustom, setIsCustom] = createSignal(false);
  const [value, setValue] = createSignal("");

  if (isCustom()) {
    return (
      <box
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        flexGrow={1}
        gap={1}
      >
        <ascii_font font="tiny" text="nano-cli" />
        <text>🍌 Step 3 / 4 — Custom save path</text>
        <input
          value={value()}
          onChange={(v: string) => setValue(v)}
          onSubmit={() => props.onSubmit(value())}
          width={50}
          placeholder="e.g. /Users/you/Desktop/images"
        />
        <text color="gray">Enter to confirm</text>
      </box>
    );
  }

  return (
    <box
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      flexGrow={1}
      gap={1}
    >
      <ascii_font font="tiny" text="nano-cli" />
      <text>🍌 Step 3 / 4 — Save path</text>
      <select
        options={PRESETS}
        width={50}
        height={5}
        onSelect={(index: number) => {
          const selected = PRESETS[index];
          if (selected.value === "custom") {
            setIsCustom(true);
          } else {
            props.onSubmit(selected.value);
          }
        }}
      />
      <text color="gray">↑ ↓ to move, Enter to confirm</text>
    </box>
  );
}
