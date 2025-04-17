import { authOptions } from "@/app/utils/authOptions";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  //세션에서 리다이렉트 하는 방법
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/?reason=withMessage");
  }
  return <>{children}</>;
}
