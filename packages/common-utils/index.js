export const printer = (arg) => console.log("printer", arg);
export const writer = (arg) => console.log("writer", arg);
export const reader = (arg) => console.log("reader", arg);
export const logger = (arg) => console.log("logger", arg);

//이런 식으로 외부 lib 연동 샘플
import dayjs from "dayjs";
export function parseDateSample(arg) {
  try {
    if (arg) return dayjs(arg).format("YYYY-MM-DD");
    return dayjs(arg).format("YYYY-MM-DD");
  } catch (e) {
    console.error(e);
  }
  return "";
}

import debounce from "debounce";
export function debounceSample(arg) {
  debounce(() => {
    if (arg) {
      arg();
    }
  }, 1000);
}
