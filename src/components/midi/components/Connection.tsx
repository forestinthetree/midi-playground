import { CheckIcon, ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Badge, Flex } from "@radix-ui/themes";
import type { FunctionComponent } from "react";
import type { MIDIState } from "../utils/createMIDIManager";

interface Props {
  midiState: MIDIState;
}

export const Connection: FunctionComponent<Props> = ({ midiState }) => {
  return (
    <Flex gap="1" align="center">
      {midiState === "available" && (
        <Badge color="gray" size="3">
          <Flex gap="1" align="center">
            <CheckIcon /> MIDI Available
          </Flex>
        </Badge>
      )}
      {midiState === "error" && (
        <Badge color="amber" size="3">
          <Flex gap="1" align="center">
            <ExclamationTriangleIcon /> MIDI Error
          </Flex>
        </Badge>
      )}
      {midiState === "notSupported" && (
        <Badge color="tomato" size="3">
          <Flex gap="1" align="center">
            <ExclamationTriangleIcon /> MIDI not supported
          </Flex>
        </Badge>
      )}
    </Flex>
  );
};
