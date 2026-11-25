export function debounce<TArgs extends unknown[]>(
  callback: (...args: TArgs) => void,
  delayMs: number,
) {
  let timeout: ReturnType<typeof setTimeout> | undefined;

  return Object.assign(
    (...args: TArgs) => {
      if (timeout !== undefined) clearTimeout(timeout);
      timeout = setTimeout(() => {
        timeout = undefined;
        callback(...args);
      }, delayMs);
    },
    {
      cancel() {
        if (timeout !== undefined) clearTimeout(timeout);
        timeout = undefined;
      },
    },
  );
}
