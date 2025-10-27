/**
 * @param ms 밀리초, 1s = 1000ms
 */
export function sleep(ms = 1000) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
