"use client";
import { signIn } from "next-auth/react";
export function HandleBtn() {
  const _signin = () => {
    signIn("credentials", {
      email: "email@aaa.com",
      password: "email from custom signin",
      redirect: false,
    });
  };
  return (
    <button type="button" onClick={() => _signin()}>
      signin
    </button>
  );
}
