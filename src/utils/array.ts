export function arraysEqual(arr1: number[], arr2: number[]): boolean {
  if (arr1.length !== arr2.length) {
    return false;
  }

  return arr1.every((value, index) => value === arr2[index]);
}

export function getInitialArray<ArrayType>({
  initialValue,
  length,
}: { initialValue: ArrayType; length: number }) {
  const arr: ArrayType[] = [];

  for (let i = 0; i < length; i++) {
    arr[i] = initialValue;
  }

  return arr;
}

export function cycleArray<T>(arr: T[], offset: number) {
  const length = arr.length;
  const normalizedOffset = ((offset % length) + length) % length;

  return arr
    .slice(-normalizedOffset)
    .concat(arr.slice(0, length - normalizedOffset));
}
