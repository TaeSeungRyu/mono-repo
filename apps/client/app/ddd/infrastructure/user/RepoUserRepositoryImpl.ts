import { signIn } from "next-auth/react";

import { UserRepository } from "../../domain/user/UserRepository";
import { CommonResponse } from "../../domain/CommonResponse";
import { fetcher } from "@/app/lib/useFetch";
import { API } from "@/app/types/const";

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
    const insertResult = await fetcher(API.SIGNUP, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password, name }),
    });
    return new Promise(async (resolve, reject) => {
      if (insertResult.ok) {
        const { result } = await insertResult.json();
        resolve(
          new CommonResponse({ data: result.data, success: result.success }),
        );
      } else {
        reject(new Error("DB Insert Error"));
      }
    });
  }
  async findMe() {
    const meResult = await fetcher(API.MYINFO, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return new Promise(async (resolve, reject) => {
      if (meResult.ok) {
        const { result } = await meResult.json();
        resolve(
          new CommonResponse({ data: result.data, success: result.success }),
        );
      } else {
        reject(new Error("DB Insert Error"));
      }
    });
  }

  async findUserWithPage(
    page: number,
    limit: number,
    username: string | null,
    name: string | null,
  ): Promise<any> {
    const query = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      username: username ? username : "",
      name: name ? name : "",
    });
    if (!username) {
      query.delete("username");
    }
    if (!name) {
      query.delete("name");
    }

    const findResult = await fetcher(`${API.USERLIST}?${query}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return new Promise(async (resolve, reject) => {
      if (findResult.ok) {
        const { result } = await findResult.json();
        resolve(
          new CommonResponse({ data: result.data, success: result.success }),
        );
      } else {
        reject(new Error("DB Insert Error"));
      }
    });
  }

  async updateUser(
    id: string,
    oldPassword: string,
    newPassword: string,
    name: string | null,
  ): Promise<any> {
    const updateResult = await fetcher(API.USERUPDATE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, oldPassword, newPassword, name }),
    });
    return new Promise(async (resolve, reject) => {
      if (updateResult.ok) {
        const { result } = await updateResult.json();
        console.log("repository : ", result.success);
        resolve(
          new CommonResponse({ data: result.data, success: result.success }),
        );
      } else {
        reject(new Error("DB Insert Error"));
      }
    });
  }

  async deleteUser(id: string, oldPassword: string): Promise<any> {
    const deleteResult = await fetcher(`${API.USERDELETE}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, oldPassword }),
    });
    return new Promise(async (resolve, reject) => {
      if (deleteResult.ok) {
        const { result } = await deleteResult.json();
        resolve(
          new CommonResponse({ data: result.data, success: result.success }),
        );
      } else {
        reject(new Error("DB Insert Error"));
      }
    });
  }
}
