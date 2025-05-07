export interface JwtPayload {
  username: string;
}

export enum JWTCode {
  refreshToken = 'refresh_token',
  accessToken = 'access_token',
}
