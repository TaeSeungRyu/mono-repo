import CredentialsProvider from "next-auth/providers/credentials";
import { API } from "../types/const";

export const authOptions = {
  providers: [
    // 로그인 페이지에서 사용자 이름과 비밀번호를 입력하여 로그인하는 방법을 제공.
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
        accessToken: { label: "Access Token", type: "text" },
        refreshToken: { label: "Refresh Token", type: "text" },
      },
      //요청 샘플 입니다.
      async authorize(credentials) {
        if (credentials.accessToken) {
          const getMe = await fetch(
            `${process.env.API_SERVER_URL}${API.DIRECT_SERVER_MYINFO}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${credentials.accessToken}`,
              },
            },
          );
          const me = await getMe?.json();
          return {
            serverAccessToken: credentials.accessToken,
            serverRefreshToken: credentials.refreshToken,
            id: me.result.data.id,
            username: me.result.data.username,
            name: me.result.data.name,
            auths: me.result.data.auths,
          };
        } else {
          const requestResult = await fetch(
            `${process.env.API_SERVER_URL}${API.DIRECT_SERVER_SIGNIN}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                username: credentials.username,
                password: credentials.password,
              }),
            },
          );

          const user = await requestResult?.json();
          console.log(user.result.accessToken);
          if (user?.result?.success) {
            const getMe = await fetch(
              `${process.env.API_SERVER_URL}${API.DIRECT_SERVER_MYINFO}`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${user.result.accessToken}`,
                },
              },
            );
            const me = await getMe?.json();
            return {
              serverAccessToken: user.result.accessToken,
              serverRefreshToken: user.result.refreshToken,
              id: me.result.data.id,
              username: me.result.data.username,
              name: me.result.data.name,
              auths: me.result.data.auths,
            };
          }
          const errorMessage = user?.message;
          throw new Error(errorMessage || "Invalid username or password");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.username = user.username; //사용자 정의 필드 추가
        token.serverAccessToken = user.serverAccessToken; //사용자 정의 필드 추가
        token.serverRefreshToken = user.serverRefreshToken; //사용자 정의 필드 추가
        token.auths = user.auths; //사용자 정의 필드 추가
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.username = token.username; //사용자 정의 필드 추가
        session.user.serverAccessToken = token.serverAccessToken; //사용자 정의 필드 추가
        session.user.serverRefreshToken = token.serverRefreshToken; //사용자 정의 필드 추가
        session.user.auths = token.auths; //사용자 정의 필드 추가
      }
      return session;
    },
  },
};
