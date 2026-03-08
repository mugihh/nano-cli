import type { AspectRatio } from "../lib/gemini";

interface Props {
  onSelect: (ratio: AspectRatio) => void;
  selectRef: (el: any) => void;
}

const OPTIONS = [
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

export { OPTIONS as ASPECT_OPTIONS };

export function AspectScreen(props: Props) {
  return (
    <box
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      flexGrow={1}
      gap={1}
    >
      <ascii_font font="tiny" text="nano-cli" />
      <text>🍌 Step 2 / 3 — Choose aspect ratio</text>
      <select ref={props.selectRef} options={OPTIONS} width={50} height={7} />
      <text color="gray">↑ ↓ to move, Enter to confirm</text>
    </box>
  );
}
