import type { Metadata } from "next";
import { Geist } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";
import AttributeProviders from "./providers/AttributeProviders";

//폰트 주입 샘플
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

//메타데이터 샘플
export const metadata: Metadata = {
  title: "Next App Sample!",
  description: "다양한 넥스트 앱 샘플!",
};

//next-themes next-themes next-themes 해보기!
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} text-[#119595] dark:bg-gray-900 text-black dark:text-white`}
      >
        <NextTopLoader color="red" crawlSpeed={500} />
        <AttributeProviders>{children}</AttributeProviders>
      </body>
    </html>
  );
}
