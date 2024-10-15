// biome-ignore lint/suspicious/noExplicitAny: Allow any params
export function throttle(func: (...params: any) => void, duration: number) {
  let shouldWait = false;

  // biome-ignore lint/suspicious/noExplicitAny: Allow any params
  return function (...args: any) {
    if (!shouldWait) {
      func.apply(this, args);
      shouldWait = true;

      setTimeout(() => {
        shouldWait = false;
      }, duration);
    }
  };
}
