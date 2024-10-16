import { Flex, Heading, Separator } from "@radix-ui/themes";
import type { FunctionComponent } from "react";
import { Connection } from "../midi/components/Connection";
import type { MIDIState } from "../midi/utils/createMIDIManager";

interface Props {
  title: string;
  midiState?: MIDIState;
}

export const Header: FunctionComponent<Props> = ({ title, midiState }) => {
  return (
    <>
      <Flex gap="3" justify="between" align="center" width="100%" p="4">
        <Heading as="h1">{title}</Heading>
        {midiState && <Connection midiState={midiState} />}
      </Flex>
      <Separator orientation="horizontal" size="4" decorative />
    </>
  );
};
