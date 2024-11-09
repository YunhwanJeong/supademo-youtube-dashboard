export function debounce(func: (query: string) => void, delay: number = 300) {
  let timer: NodeJS.Timeout;
  return function (...args: [string]) {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
}
