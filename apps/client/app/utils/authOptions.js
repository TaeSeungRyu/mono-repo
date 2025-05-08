import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    // OAuth 인증 생플
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    // 로그인 페이지에서 사용자 이름과 비밀번호를 입력하여 로그인하는 방법을 제공.
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
        access_token: { label: "Access Token", type: "text" },
        refresh_token: { label: "Refresh Token", type: "text" },
      },
      //요청 샘플 입니다.
      async authorize(credentials) {
        console.log(credentials);
        if (credentials.access_token) {
          console.log("access_token access_token access_token in in in");
          debugger;
          const getMe = await fetch(
            `${process.env.API_SERVER_URL}/user/my-info`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${credentials.access_token}`,
              },
            },
          );
          const me = await getMe?.json();
          return {
            serverAccessToken: credentials.access_token,
            serverRefreshToken: credentials.refresh_token,
            id: me.result.data.id,
            username: me.result.data.username,
            name: me.result.data.name,
          };
        } else {
          const requestResult = await fetch(
            `${process.env.API_SERVER_URL}/auth/login`,
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
          if (user?.result?.success) {
            const getMe = await fetch(
              `${process.env.API_SERVER_URL}/user/my-info`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${user.result.access_token}`,
                },
              },
            );
            const me = await getMe?.json();
            return {
              serverAccessToken: user.result.access_token,
              serverRefreshToken: user.result.refresh_token,
              id: me.result.data.id,
              username: me.result.data.username,
              name: me.result.data.name,
            };
          }
        }

        throw new Error("Invalid username or password");
      },
    }),
  ],
};
