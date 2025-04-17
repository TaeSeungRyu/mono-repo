"use client";
import { useSession, signIn, signOut } from "next-auth/react";

export default function SigninBtn() {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        <button onClick={() => signOut()}>Sign out</button>
        <div>* 로그인 후 정보 : {session.user?.role?.toString()}</div>
      </>
    );
  }
  return (
    <>
      <button onClick={() => signIn()}>Sign in</button>
      <div>* 아직 로그인이 되지 않았습니다.</div>
    </>
  );
}
