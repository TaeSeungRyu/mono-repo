import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import SqlLiteDB from "@/app/lib/db";

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
      async authorize(credentials) {
        const prepare = SqlLiteDB.prepare(
          "SELECT * FROM User WHERE password = $password AND username = $username"
        );

        const user = prepare.get({
          username: credentials.username,
          password: credentials.password,
        });
        console.log("login from db : ", user);
        if (user) {
          return user;
        }
        throw new Error("Invalid username or password");
      },
    }),
  ],
};
