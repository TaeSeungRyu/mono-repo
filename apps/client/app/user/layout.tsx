import { authOptions } from "@/app/utils/authOptions";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import Header from "../components/HeaderComponent";
import { API } from "../types/const";
import { AuthCodesProvider } from "./providers";
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  //로그인 여부 확인
  const session = await getServerSession(authOptions);
  const isSuperUser =
    session?.user?.auths && session?.user?.auths?.includes("admin");
  if (!session || !isSuperUser) {
    redirect("/error");
  }
  const prePatch = await fetch(
    `${process.env.API_SERVER_URL}${API.DIRECT_SERVER_USER_AUTH_CODE}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session?.user?.serverAccessToken}`,
      },
      //cache: "force-cache",
      next: {
        revalidate: 60 * 60 * 1,
      },
    },
  );
  const result = await prePatch.json();
  return (
    <>
      <Header session={session}></Header>
      <AuthCodesProvider value={result}>{children}</AuthCodesProvider>
    </>
  );
}
