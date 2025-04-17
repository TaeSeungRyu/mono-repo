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
      },
      //요청 샘플 입니다.
      async authorize() {
        //credentials, req
        const loginUrl = `${process.env.API_SERVER_URL}/login`; //fetch는 full url을 요구 합니다.
        const params = {
          adminUsername: process.env.TEST_ID,
          adminPassword: process.env.TEST_PASSWORD,
        };
        const requestResult = await fetch(loginUrl, {
          //API 서버에 로그인 요청
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(params),
        }).catch((e) => e);
        try {
          if (requestResult.status === 200) {
            const requestToJson = await requestResult.json(); //API 서버에서 받은 데이터를 사용자 정보
            console.log("api call requestToJson : ", requestToJson);
            return {
              id: 1,
              name: "asdf",
              email: "asdf@a.com",
              role: ["bbb", "eee", "ggg", "qqq", "eeee"].join(","), //사용자 정의 필드 추가
              accessToken: requestToJson?.data?.accessToken,
            };
          }
        } catch (e) {
          console.log(e);
        }
        return {
          id: 1,
          name: "testName",
          email: "test@a.com",
          role: ["aaaa", "bbbb", "cccc", "dddd", "eeee"].join(","), //사용자 정의 필드 추가
          accessToken: "testAccessToken",
        }; //사용자 정보를 리턴, 원하는 방법으로 가공
      },
    }),
  ],
};
