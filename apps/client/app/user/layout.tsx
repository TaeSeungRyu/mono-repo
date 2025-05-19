import { authOptions } from "@/app/utils/authOptions";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import Header from "../components/HeaderComponent";

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
  return (
    <>
      <Header session={session}></Header>
      {children}
    </>
  );
}
