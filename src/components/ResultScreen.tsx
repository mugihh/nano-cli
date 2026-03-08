// src/components/ResultScreen.tsx
interface Props {
  filePaths: string[];
  texts: string[];
  onBack: () => void;
}

export function ResultScreen(props: Props) {
  return (
    <box
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      flexGrow={1}
      gap={1}
    >
      <ascii_font font="tiny" text="Done!" />

      <box flexDirection="column" gap={1} width={60}>
        <text color="green">✅ Image generated successfully!</text>

        {props.filePaths.map((path) => (
          <box flexDirection="column">
            <text color="gray">Saved to:</text>
            <text color="cyan">{path}</text>
          </box>
        ))}

        {props.texts.length > 0 && (
          <box flexDirection="column">
            <text color="gray">Model response:</text>
            <text>{props.texts.join(" ")}</text>
          </box>
        )}

        <text color="gray" marginTop={1}>
          Press Enter or Q to go back
        </text>
      </box>
    </box>
  );
}
