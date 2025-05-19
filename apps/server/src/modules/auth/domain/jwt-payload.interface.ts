export interface JwtPayload {
  username: string;
  roles?: string[];
}

export enum JWTCode {
  refreshToken = 'refreshToken',
  accessToken = 'accessToken',
}
