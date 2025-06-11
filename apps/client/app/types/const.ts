//api server로 바로 요청을 보내는 경우
export const proxy_pre_name = "/api-server";

//nextjs의 api route를 통해 요청을 보내는 경우
export const client_api_pre_name = "/api";
const ws: string = process?.env?.API_WEBSOCKET_SERVER_URL || "";
export const API = {
  SIGNUP: `${proxy_pre_name}/user/signup`,
  LOGOUT: `${proxy_pre_name}/auth/logout`,
  MYINFO: `${proxy_pre_name}/user/my-info`,
  BOARD: `${proxy_pre_name}/board`,
  BOARD_CREATE: `${proxy_pre_name}/board/create`,
  BOARD_UPDATE: `${proxy_pre_name}/board/update`,
  BOARD_DELETE: `${proxy_pre_name}/board/delete`,

  CALENDAR: `${proxy_pre_name}/calendar`,
  CALENDAR_CREATE: `${proxy_pre_name}/calendar/create`,
  CALENDAR_UPDATE: `${proxy_pre_name}/calendar/update`,
  CALENDAR_DELETE: `${proxy_pre_name}/calendar/delete`,

  USERLIST: `${proxy_pre_name}/user/find-paging`,
  USERUPDATE: `${proxy_pre_name}/user/update-info`,
  USERDELETE: `${proxy_pre_name}/user/delete`,

  SCRAPPING: `${proxy_pre_name}/scrapping`,
  GITHUB: `${proxy_pre_name}/github`,
  KAFKA_ADD: `${proxy_pre_name}/kafka/add`,

  DIRECT_SERVER_WEBSOCKET: `${ws}`,

  LOCAL_REFRESH: `${client_api_pre_name}/auth/refresh`,
  LOCAL_SSE: `${client_api_pre_name}/sse`,

  DIRECT_SERVER_USER_AUTH_CODE: `/user/get-auth-code`,
  DIRECT_SERVER_MYINFO: "/user/my-info",
  DIRECT_SERVER_SIGNIN: "/auth/login",
  DIRECT_SERVER_REFRESH: "/auth/refresh-token",
  DIRECT_SERVER_SSE: "/events/sse",
} as const;
