import NextAuth from "next-auth";
import { authOptions } from "@/app/utils/authOptions";

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  credentials: "include",
  session: {
    jwt: true,
    strategy: "jwt",
    secureCookie: process.env.NODE_ENV === "production",
  },
  jwt: {
    encryption: true, // JWT 암호화 활성화
  },
  debug: true,
  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax", // 개발 환경에서는 lax로 설정
        path: "/",
        secure: false,
      },
    },
  },
  providers: authOptions.providers,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role; //사용자 정의 필드 추가
        token.accessToken = user.accessToken; //사용자 정의 필드 추가
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.role) session.user.role = token.role; //사용자 정의 필드 추가
      if (session.accessToken && token.accessToken)
        session.user.accessToken = token.accessToken; //사용자 정의 필드 추가
      return session;
    },
  },
});
export { handler as GET, handler as POST };
