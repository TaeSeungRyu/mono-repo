import NextAuth, { Session } from "next-auth";
import { authOptions } from "@/app/utils/authOptions";
import { JWT } from "next-auth/jwt";

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  useSecureCookies: process.env.NODE_ENV === "production", //https://next-auth.js.org/warnings#use_secure_cookies 이슈 해결을 위한 설정
  debug: process.env.NODE_ENV !== "production", //https://next-auth.js.org/warnings#debug_enabled 이슈 해결을 위한 설정
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
  ...authOptions,
});
export { handler as GET, handler as POST };
