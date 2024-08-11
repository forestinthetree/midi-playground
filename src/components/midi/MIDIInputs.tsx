import { Card } from "@radix-ui/themes";
import { Fragment, type FunctionComponent, type ReactNode } from "react";
import type { MIDIInputs as MIDIInputsType } from "../../utils/useMIDI";
import { Grid } from "../in-tech/Grid";

interface Props {
  midiInputs: MIDIInputsType;
}

type SupportedMIDIInput = keyof typeof MIDI_INPUT_MAP;

const MIDI_INPUT_MAP: Record<
  string,
  (params: { input: MIDIInput }) => ReactNode
> = {
  "Intech Studio: Grid": ({ input }) => <Grid input={input} />,
};

export const MIDIInputs: FunctionComponent<Props> = ({ midiInputs }) => {
  return Object.entries(midiInputs).map(([id, input]) => {
    const midiInputName = input.name as SupportedMIDIInput;
    const InputComponent = MIDI_INPUT_MAP[midiInputName];

    return (
      <Fragment key={id}>
        {InputComponent && <InputComponent input={input} />}
        {!InputComponent && <Card>{input.name} (Unsupported)</Card>}
      </Fragment>
    );
  });
};
