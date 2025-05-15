//api server로 바로 요청을 보내는 경우
export const proxy_pre_name = "/api-server";

//nextjs의 api route를 통해 요청을 보내는 경우
export const client_api_pre_name = "/api";

export enum API {
  SIGNUP = `${proxy_pre_name}/user/signup`,
  MYINFO = `${proxy_pre_name}/user/my-info`,
  BOARD = `${proxy_pre_name}/board`,
  BOARD_CREATE = `${proxy_pre_name}/board/create`,
  BOARD_UPDATE = `${proxy_pre_name}/board/update`,
  BOARD_DELETE = `${proxy_pre_name}/board/delete`,

  CALENDAR = `${proxy_pre_name}/calendar`,
  CALENDAR_CREATE = `${proxy_pre_name}/calendar/create`,
  CALENDAR_UPDATE = `${proxy_pre_name}/calendar/update`,
  CALENDAR_DELETE = `${proxy_pre_name}/calendar/delete`,

  LOCAL_REFRESH = `${client_api_pre_name}/auth/refresh`,
  DIRECT_SERVER_MYINFO = "/user/my-info",
  DIRECT_SERVER_SIGNIN = "/auth/login",
  DIRECT_SERVER_REFRESH = "/auth/refresh-token",
}
