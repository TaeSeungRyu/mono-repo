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
  if (!session) {
    console.log(session);
    redirect("/error");
  }
  return (
    <>
      <Header></Header>
      {children}
    </>
  );
}
