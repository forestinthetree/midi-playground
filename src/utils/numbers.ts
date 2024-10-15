export function clamp({
  min,
  max,
  value,
}: { min: number; max: number; value: number }) {
  let newValue = value;
  if (newValue < min) {
    newValue = min;
  } else if (newValue > max) {
    newValue = max;
  }

  return newValue;
}

export function cycle({
  min,
  max,
  value,
}: { min: number; max: number; value: number }) {
  let newValue = value;
  if (newValue < min) {
    newValue = newValue + (max - 1);
  } else if (newValue > max) {
    newValue = newValue - (max - 1);
  }

  return newValue;
}
