import { Card } from "@radix-ui/themes";
import { Fragment, type FunctionComponent } from "react";
import type {
  MIDIInputs as MIDIInputsType,
  MIDIOutputObject,
  MIDIOutputs,
} from "../hooks/useMIDIManager";
import type { MIDIInputMap } from "../types";

interface Props {
  midiInputs: MIDIInputsType;
  midiOutputs?: MIDIOutputs;
  midiInputMap: MIDIInputMap;
}

export const MIDIInputs: FunctionComponent<Props> = ({
  midiInputs,
  midiOutputs,
  midiInputMap,
}) => {
  return Object.entries(midiInputs).map(([id, input]) => {
    const midiInputName = input.name as string;
    const InputComponent = midiInputMap[midiInputName];

    // Simple algorithm to match MIDI input and output based on the
    // order of midiOutputs with the same name as the midi input
    let outputObject: MIDIOutputObject | undefined = undefined;
    const currentOutputIndex = indexes[midiInputName];

    if (outputs[midiInputName]) {
      if (currentOutputIndex === undefined) {
        outputObject = outputs[midiInputName][0];
        indexes[midiInputName] = 0;
      } else {
        outputObject = outputs[midiInputName][currentOutputIndex];
        indexes[midiInputName] = indexes[midiInputName] + 1;
      }
    }

    return (
      <Fragment key={id}>
        {InputComponent && (
          <InputComponent input={input} output={outputObject} />
        )}
        {!InputComponent && <Card>{input.name} (Unsupported)</Card>}
      </Fragment>
    );
  });
};
