/**
 * Creates a debounced version of a function that delays its execution
 * until after a specified delay period has elapsed since the last time
 * it was invoked. Useful for limiting the rate at which a function is
 * called, particularly in response to events like scrolling or typing.
 *
 * @template T - The type of the function to debounce. It infers the argument
 *               and return types from the provided function.
 * @param {T} func - The function to debounce.
 * @param {number} [delay=300] - The amount of time, in milliseconds, to delay
 *                               the function call. Defaults to 300ms.
 * @returns {T & { cancel: () => void }} - A debounced version of the function
 *                                         with an added `cancel` method to
 *                                         clear any pending timer.
 *
 * @example
 * const debouncedSave = debounce(() => saveData(), 500);
 * debouncedSave(); // Will only call saveData after 500ms without another call
 */
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
/**
 * Utility function to calculate percentage-based value.
 * @param percentage - The percentage value (e.g., for 50%, pass 50)
 * @param total - The total value that the percentage is based on.
 * @returns The calculated percentage of the total value.
 */
export function calculatePercentage(percentage: number, total: number): number {
  return (percentage / 100) * total;
}
