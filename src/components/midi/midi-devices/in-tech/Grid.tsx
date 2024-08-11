import { Box, Card, Flex, Heading, Grid as RadixGrid } from "@radix-ui/themes";
import { type FunctionComponent, useEffect, useState } from "react";

interface Props {
  input: MIDIInput;
}

type EventType = "Button" | "Encoder";

interface Message {
  type: EventType;
  index: number;
  value: number;
}

interface InputState {
  buttonValue?: number;
  encoderValue?: number;
}
type GridState = Record<number, InputState>;

const EVENT_TYPE_MAP: Record<number, EventType> = {
  144: "Button",
  176: "Encoder",
};

const NUM_INPUTS = 16;

function getInitialGridState() {
  const gridState: GridState = {};

  for (let i = 0; i < NUM_INPUTS; i++) {
    gridState[i] = {
      buttonValue: undefined,
      encoderValue: undefined,
    };
  }

  return gridState;
}

export const Grid: FunctionComponent<Props> = ({ input }) => {
  const [gridState, setGridState] = useState<GridState>(getInitialGridState());

  useEffect(() => {
    input.onmidimessage = ({ data }) => {
      if (!data) {
        return;
      }

      const [eventTypeData, indexData, valueData] = data;
      const type = EVENT_TYPE_MAP[eventTypeData];

      if (!type) {
        console.error("Invalid eventType", {
          eventType: eventTypeData,
          data,
        });
        return;
      }

      const index = indexData - 32;
      const value = type === "Encoder" ? valueData - 64 : valueData / 127;

      setGridState((prevGridState) => {
        const newGridState = prevGridState || {};
        const prevIndexState = newGridState[index] || {};
        const newState =
          type === "Encoder"
            ? {
                encoderValue: value,
              }
            : {
                buttonValue: value,
              };
        return {
          ...newGridState,
          [index]: {
            ...prevIndexState,
            ...newState,
          },
        };
      });
    };

    return () => {
      input.onmidimessage = null;
    };
  }, [input]);

  return (
    <Card>
      <Flex direction="column" gap="4">
        <Heading as="h2">Grid EN16</Heading>
        {!gridState && <Box>No input yet</Box>}
        <RadixGrid columns="4" rows="4" gap="3" width="15rem">
          {gridState &&
            Object.entries(gridState).map(([index, indexState]) => {
              const { buttonValue, encoderValue } = indexState;
              let bgColor = "default";
              if (buttonValue === 0) {
                bgColor = "var(--gray-4)";
              } else if (buttonValue === 1) {
                bgColor = "var(--blue-5)";
              }

              const style = {
                "--card-background-color": bgColor,
                width: "3rem",
                minHeight: "3rem",
              } as React.CSSProperties;

              return (
                <Card key={index} style={style}>
                  <Flex justify="center">{encoderValue}</Flex>
                </Card>
              );
            })}
        </RadixGrid>
      </Flex>
    </Card>
  );
};
