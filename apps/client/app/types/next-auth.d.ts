//사용자 정의 세션 타입을 정의하는 파일입니다.
//이 파일은 next-auth 패키지의 타입을 확장하는 역할을 합니다.
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      /** The user's role. */
      auths: Array<string>;
      accessToken: string;
      username: string;
      serverAccessToken: string;
      serverRefreshToken: string;
    } & DefaultSession["user"];
  }
  interface User {
    auths: Array<string>;
    accessToken: string;
    username: string;
    serverAccessToken: string;
    serverRefreshToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    /** The user's role */
    auths: Array<string>;
    accessToken: string;
    username: string;
    user: Users | null;
    serverAccessToken: string;
    serverRefreshToken: string;
  }
}
