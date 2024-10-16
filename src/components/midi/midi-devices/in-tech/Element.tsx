import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import { Card, Flex } from "@radix-ui/themes";
import { clsx } from "clsx";
import type { CSSProperties, FunctionComponent, ReactNode } from "react";
import type { RGBColor } from "../../../../types";
import { rgbToCssString } from "../../../../utils/color";
import {
  ColorPicker,
  type ColorPickerProps,
} from "../../../color-input/ColorPicker";
import { type ColorState, useColor } from "../../../color-input/useColor";
import { MIDI_OUT_THROTTLE_TIME } from "../../constants";
import type { MIDIOutputSend, RGBLayer } from "../../types";
import { createRGBMessagesForLED } from "../../utils/midiMessage";
import { waitFor } from "../../utils/waitFor";
import styles from "./Element.module.scss";
import type { InputState, SendLayerType } from "./Grid";

const DEFAULT_RGB_COLOR: RGBColor = [0, 0, 0];

const ColorLED = ({
  style,
  colorState,
  ...props
}: {
  style?: CSSProperties;
} & ColorPickerProps) => {
  const { red, green, blue } = colorState;
  const isBlack = red === 0 && green === 0 && blue === 0;

  const colorPickerStyles = {
    "--bgColor": rgbToCssString([red, green, blue]),
    ...style,
  } as CSSProperties;
  return (
    <ColorPicker
      className={`${styles.colorLED} ${isBlack ? styles.isBlack : ""}`}
      colorState={colorState}
      {...props}
      style={colorPickerStyles}
    />
  );
};

const TwoLayerColors = ({
  index,
  layer1Color,
  layer2Color,
  throttledSend,
}: {
  index: number;
  layer1Color: ColorState;
  layer2Color: ColorState;
  throttledSend: MIDIOutputSend;
}) => {
  return (
    <Flex direction="row" align="center">
      <ColorLED
        colorState={layer1Color}
        onColorChange={async (color: RGBColor) => {
          const layer = 1;
          const [r, g, b] = color;
          const messages = createRGBMessagesForLED({
            index,
            layer,
            r,
            g,
            b,
          });

          for (const message of messages) {
            throttledSend(message);
            await waitFor(MIDI_OUT_THROTTLE_TIME);
          }
        }}
      />
      <ColorLED
        colorState={layer2Color}
        onColorChange={async (color: RGBColor) => {
          const layer = 2;
          const [r, g, b] = color;
          const messages = createRGBMessagesForLED({
            index,
            layer,
            r,
            g,
            b,
          });

          for (const message of messages) {
            throttledSend(message);
            await waitFor(MIDI_OUT_THROTTLE_TIME);
          }
        }}
      />
    </Flex>
  );
};

const LayersColor = ({
  index,
  layer1Color,
  layer2Color,
  bothLayerColor,
  throttledSend,
  layersType,
}: {
  index: number;
  layer1Color: ColorState;
  layer2Color: ColorState;
  bothLayerColor: ColorState;
  throttledSend: MIDIOutputSend;
  layersType: "1" | "2" | "both";
}) => {
  let layers: RGBLayer[] = [1];
  let color: ColorState = layer1Color;
  if (layersType === "2") {
    layers = [2];
    color = layer2Color;
  } else if (layersType === "both") {
    layers = [1, 2];
    color = bothLayerColor;
  }

  return (
    <ColorLED
      colorState={color}
      onColorChange={async (color: RGBColor) => {
        for (const layer of layers) {
          const [r, g, b] = color;
          const messages = createRGBMessagesForLED({
            index,
            layer,
            r,
            g,
            b,
          });

          for (const message of messages) {
            throttledSend(message);
            await waitFor(MIDI_OUT_THROTTLE_TIME);
          }

          await waitFor(MIDI_OUT_THROTTLE_TIME);
        }
      }}
    />
  );
};

export const Element: FunctionComponent<{
  index: number;
  inputState: InputState;
  throttledSend?: MIDIOutputSend;
  sendSendLayerType?: SendLayerType;
}> = ({ index, inputState, throttledSend, sendSendLayerType }) => {
  const layer1Color = useColor({ defaultRgb: DEFAULT_RGB_COLOR });
  const layer2Color = useColor({ defaultRgb: DEFAULT_RGB_COLOR });
  const bothLayerColor = useColor({ defaultRgb: DEFAULT_RGB_COLOR });

  const { buttonValue, encoderValue } = inputState;

  let encoderIcon: ReactNode;
  if (encoderValue !== undefined) {
    if (encoderValue < 0 && encoderValue >= -1) {
      encoderIcon = <ChevronLeftIcon />;
    } else if (encoderValue < -1) {
      encoderIcon = <DoubleArrowLeftIcon />;
    } else if (encoderValue > 0 && encoderValue <= 1) {
      encoderIcon = <ChevronRightIcon />;
    } else if (encoderValue > 1) {
      encoderIcon = <DoubleArrowRightIcon />;
    }
  }

  return (
    <Flex direction="column" align="center">
      {throttledSend &&
        (sendSendLayerType === "1" ||
          sendSendLayerType === "2" ||
          sendSendLayerType === "both") && (
          <LayersColor
            index={index}
            layer1Color={layer1Color}
            layer2Color={layer2Color}
            bothLayerColor={bothLayerColor}
            throttledSend={throttledSend}
            layersType={sendSendLayerType}
          />
        )}
      {throttledSend && sendSendLayerType === "split" && (
        <TwoLayerColors
          index={index}
          layer1Color={layer1Color}
          layer2Color={layer2Color}
          throttledSend={throttledSend}
        />
      )}
      <Card
        className={clsx(styles.element, {
          [styles.buttonPressed]: buttonValue === 1,
          [styles.encodeValue]: Boolean(encoderIcon),
        })}
      >
        <Flex direction="column" align="center" justify="center">
          {encoderIcon}
        </Flex>
      </Card>
    </Flex>
  );
};
