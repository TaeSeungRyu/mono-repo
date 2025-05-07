"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function MobileDetectorProviders({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor;

    // 모바일 디바이스 판별
    const isMobile = /Mobile|Android|iP(ad|hone|od)/i.test(userAgent);

    // 현재 경로가 `/mobile`이 아닌 경우에만 리다이렉트
    if (isMobile && !pathname.startsWith("/mobile")) {
      const newPath = `/mobile${pathname}`;
      router.replace(newPath);
    }
  }, [pathname, router]);
  return <>{children}</>;
}
