export interface JwtPayload {
  username: string;
}

export enum JWTCode {
  refresh_token = 'refresh_token',
  access_token = 'access_token',
}
