// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number = 300
) {
  let timer: NodeJS.Timeout;

  const debouncedFunction = function (...args: Parameters<T>) {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };

  // Add a cancel method to clear the timer
  debouncedFunction.cancel = () => {
    clearTimeout(timer);
  };

  return debouncedFunction;
}
