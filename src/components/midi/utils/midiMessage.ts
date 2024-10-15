import type { RGBLayer } from "../types";

export function createMIDIControlChangeMessage({
  channel,
  controlChange,
  value,
}: {
  channel: number;
  controlChange: number;
  value: number;
}) {
  // Ensure the channel is within the range 1-16
  if (channel < 0 || channel > 15) {
    throw new Error("MIDI channel must be between 0 and 15");
  }

  if (controlChange < 0 || controlChange > 127) {
    throw new Error("Control Change number must be between 0 and 127");
  }

  if (value < 0 || value > 127) {
    throw new Error("Control Change value must be between 0 and 127");
  }

  const statusByte = 0xb0 | channel;
  const midiMessage = [statusByte, controlChange, value];

  return midiMessage;
}

const STARTING_CONTROL_CHANGE_NUM = 20;

function halveValue(value: number) {
  return Math.floor(value / 2);
}

export function createRGBMessagesForLED({
  index,
  layer,
  r,
  g,
  b,
}: {
  index: number;
  layer: RGBLayer;
  r: number;
  g: number;
  b: number;
}) {
  // Map 8 bit (0-255) to 7 bit (0-127)
  const red = halveValue(r);
  const green = halveValue(g);
  const blue = halveValue(b);

  const baseCCNumber = STARTING_CONTROL_CHANGE_NUM + index * 3; // 3 CC numbers per LED

  const redCC = baseCCNumber;
  const greenCC = redCC + 1;
  const blueCC = redCC + 2;

  return [
    [0xb0 | layer, redCC, red],
    [0xb0 | layer, greenCC, green],
    [0xb0 | layer, blueCC, blue],
  ];
}
