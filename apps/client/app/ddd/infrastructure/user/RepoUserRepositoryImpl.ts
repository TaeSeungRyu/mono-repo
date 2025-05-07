import { signIn } from "next-auth/react";

import { UserRepository } from "../../domain/user/UserRepository";
import { CommonResponse } from "../../domain/CommonResponse";

//[use case] Infrastructure Layer
export class UserRepositoryImpl implements UserRepository {
  async findOneUser(username: string, password: string) {
    const singinResult: any = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });
    return new CommonResponse(singinResult);
  }

  async insertUser(
    username: string,
    password: string,
    name: string | null,
  ): Promise<any> {
    const insertResult = await fetch("/api/user/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password, name }),
    });

    return new Promise((resolve, reject) => {
      if (insertResult.ok) {
        resolve(insertResult);
      } else {
        reject(new Error("DB Insert Error"));
      }
    });
  }
  async findMe() {
    const meResult = await fetch(`/api-server/user/my-info`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return new Promise(async (resolve, reject) => {
      console.log("meResult meResult", meResult);
      if (meResult.ok) {
        console.log("meResult meResult", meResult);
        const { result } = await meResult.json();
        resolve(new CommonResponse({ data: result.data, sucess: true }));
      } else {
        reject(new Error("DB Insert Error"));
      }
    });
  }
}
