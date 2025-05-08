//이런 식으로 외부 lib 연동 샘플
const dayjs = require("dayjs");
function parseDateSample_FROM_COMMON_UTILS(arg) {
  try {
    if (arg) return dayjs(arg).format("YYYY-MM-DD");
    return dayjs().format("YYYY-MM-DD");
  } catch (e) {
    if (e instanceof Error) {
      console.error(e.message); // optional logging
    }
  }
  return "";
}

module.exports = {
  parseDateSample_FROM_COMMON_UTILS,
};
