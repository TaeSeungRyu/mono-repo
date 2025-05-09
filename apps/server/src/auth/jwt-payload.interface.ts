export interface JwtPayload {
  username: string;
}

export enum JWTCode {
  refreshToken = 'refreshToken',
  accessToken = 'accessToken',
}
