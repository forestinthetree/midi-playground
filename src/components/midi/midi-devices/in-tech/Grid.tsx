import {
  ExclamationTriangleIcon,
  LightningBoltIcon,
} from "@radix-ui/react-icons";
import {
  Badge,
  Box,
  Card,
  Flex,
  Heading,
  Grid as RadixGrid,
  Tooltip,
} from "@radix-ui/themes";
import {
  type CSSProperties,
  type FunctionComponent,
  useEffect,
  useState,
} from "react";
import { getInitialArray } from "../../../../utils/array";
import { clamp } from "../../../../utils/numbers";
import type { MIDIOutputObject, MIDIOutputSend } from "../../hooks/useMIDI";
import { useOutputState } from "../../hooks/useMIDIOutputState";
import { Element } from "./Element";

interface Props {
  input: MIDIInput;
  outputObject?: MIDIOutputObject;
  onGridStateChange?: OnGridStateChange;
  onConnectionStateChange?: OnConnectionStateChange;
}

export type OnGridStateChange = (params: {
  update: GridUpdateData;
  state: GridState;
  outputSend?: MIDIOutputSend;
}) => void;
export type OnConnectionStateChange = (params: {
  state: MIDIPortDeviceState;
  outputSend?: MIDIOutputSend;
}) => void;
export type EventType = "Button" | "Encoder";

export interface GridUpdateData {
  type: EventType;
  index: number;
  value: number;
  raw: number;
}

export type SendLayerType = "1" | "2" | "both" | "split";

export interface InputState {
  buttonValue?: number;
  buttonRaw?: number;
  encoderValue?: number;
  encoderRaw?: number;
}
export type GridState = InputState[];

const EVENT_TYPE_MAP: Record<number, EventType> = {
  144: "Button",
  176: "Encoder",
};

const NUM_INPUTS = 16;

function getValue({ type, rawData }: { type: EventType; rawData: number }) {
  let value: number;
  if (type === "Encoder") {
    // Assuming Binary Offset
    // Sometimes the raw data returns as 0 for some reason, and numbers can
    // become larger than expected
    // @see https://docs.intech.studio/guides/grid/grid-basic/editor-121-encoder/
    value = rawData === 0 ? 0 : clamp({ min: -3, max: 3, value: rawData - 64 });
  } else {
    value = rawData / 127;
  }

  return value;
}

export const Grid: FunctionComponent<Props> = ({
  input,
  outputObject,
  onGridStateChange,
  onConnectionStateChange,
}) => {
  const [gridState, setGridState] = useState<GridState>(
    getInitialArray({
      length: NUM_INPUTS,
      initialValue: {
        buttonValue: undefined,
        buttonRaw: undefined,
        encoderValue: undefined,
        encoderRaw: undefined,
      },
    })
  );
  const [sendSendLayerType, setSendLayerType] = useState<SendLayerType>("1");
  const midiOutputState = useOutputState({
    output: outputObject?.output,
    onConnectionStateChange,
    outputSend: outputObject?.throttledSend,
  });

  useEffect(() => {
    input.onmidimessage = ({ data }) => {
      if (!data) {
        return;
      }

      const [eventTypeData, indexData, rawData] = data;
      const type = EVENT_TYPE_MAP[eventTypeData];

      if (!type) {
        console.error("Invalid eventType", {
          eventType: eventTypeData,
          data,
        });
        return;
      }

      const index = indexData - 32;
      const value = getValue({ type, rawData });

      setGridState((prevGridState) => {
        const newGridState = [...prevGridState];
        const prevIndexState = newGridState[index] || {};
        const newValue =
          type === "Encoder"
            ? {
                encoderValue: value,
                encoderRaw: rawData,
              }
            : {
                buttonValue: value,
                buttonRaw: rawData,
              };

        newGridState[index] = {
          ...prevIndexState,
          ...newValue,
        };

        if (onGridStateChange) {
          onGridStateChange({
            update: {
              type,
              index,
              value,
              raw: rawData,
            },
            state: newGridState,
            outputSend: outputObject?.throttledSend,
          });
        }

        return newGridState;
      });
    };

    return () => {
      input.onmidimessage = null;
    };
  }, [input, onGridStateChange, outputObject?.throttledSend]);

  const cardStyle = {
    "--card-padding": "var(--space-6)",
    width: "fit-content",
  } as CSSProperties;

  return (
    <Card style={cardStyle}>
      <Flex direction="column" gap="4">
        <Heading
          as="h2"
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          Grid EN16{" "}
          {midiOutputState === "connected" && (
            <Tooltip content="MIDI Output connected">
              <Badge color="grass" size="3">
                <LightningBoltIcon />
              </Badge>
            </Tooltip>
          )}
          {midiOutputState === "disconnected" && (
            <Tooltip content="MIDI Output disconnected">
              <Badge color="amber" size="3" title="">
                <ExclamationTriangleIcon />
              </Badge>
            </Tooltip>
          )}
        </Heading>
        {!gridState && <Box>No input yet</Box>}
        <RadixGrid columns="4" rows="4" gapX="7" gapY="4">
          {gridState &&
            Object.entries(gridState).map(([indexStr, inputState]) => {
              const index = Number.parseInt(indexStr, 10);
              return (
                <Element
                  key={index}
                  index={index}
                  inputState={inputState}
                  outputSend={outputObject?.throttledSend}
                  sendSendLayerType={sendSendLayerType}
                />
              );
            })}
        </RadixGrid>
        {/* {outputObject && (
          <Flex gap="2" align="center">
            <Flex direction="column" align="center">
              <Flex gap="2" align="center">
                <Text as="label" htmlFor={`${input.name}-both-layers`}>
                  Send to
                </Text>
                <Select.Root
                  value={sendSendLayerType}
                  onValueChange={(value: SendLayerType) => {
                    setSendLayerType(value);
                  }}
                >
                  <Select.Trigger />
                  <Select.Content>
                    <Select.Item value="1">Layer 1</Select.Item>
                    <Select.Item value="2">Layer 2</Select.Item>
                    <Select.Item value="both">Both layers</Select.Item>
                    <Select.Item value="split">Split layers</Select.Item>
                  </Select.Content>
                </Select.Root>
              </Flex>
            </Flex>
          </Flex>
        )} */}
      </Flex>
    </Card>
  );
};
