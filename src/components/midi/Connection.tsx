import { Badge, Button, Flex } from "@radix-ui/themes";
import type { FunctionComponent, ReactNode } from "react";
import {
  ReloadIcon,
  LightningBoltIcon,
  ExclamationTriangleIcon,
} from "@radix-ui/react-icons";
import type { ConnectionState } from "../../utils/createMIDIManager";

interface Props {
  connect: () => void;
  connectionState: ConnectionState;
}

function ReconnectButton({
  connect,
  children,
}: {
  connect: () => void;
  children: ReactNode;
}) {
  return (
    <Button
      color="amber"
      size="1"
      variant="soft"
      style={{ cursor: "pointer" }}
      onClick={connect}
    >
      {children}
    </Button>
  );
}

export const Connection: FunctionComponent<Props> = ({
  connect,
  connectionState,
}) => {
  return (
    <Flex gap="1" align="center">
      {connectionState === "connected" && (
        <Badge color="grass" size="3">
          <Flex gap="1" align="center">
            <LightningBoltIcon /> Connected
          </Flex>
        </Badge>
      )}
      {connectionState === "available" && (
        <ReconnectButton connect={connect}>
          <ReloadIcon /> Sync MIDI
        </ReconnectButton>
      )}
      {connectionState === "error" && (
        <Badge color="amber" size="3">
          <Flex gap="1" align="center">
            <ExclamationTriangleIcon /> MIDI Error
          </Flex>
        </Badge>
      )}
      {connectionState === "notSupported" && (
        <Badge color="tomato" size="3">
          <Flex gap="1" align="center">
            <ExclamationTriangleIcon /> MIDI not supported
          </Flex>
        </Badge>
      )}
    </Flex>
  );
};
