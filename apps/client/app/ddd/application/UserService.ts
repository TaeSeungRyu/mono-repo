import { UserRepository } from "../domain/user/UserRepository";

//[use case] Application Layer

export type validateType = {
  result: boolean;
  message: string;
};

export class UserService {
  private CONTEXT_KEY = "LoginContextProviderKey";

  constructor(private userRepo: UserRepository) {}
  async signIn(username: string, password: string) {
    return this.userRepo.findOneUser(username, password);
  }
  async signUp(username: string, password: string, name: string | null) {
    return this.userRepo.insertUser(username, password, name);
  }

  async findMe() {
    return this.userRepo.findMe();
  }

  validateDataBeforInsert(
    username: string,
    password: string,
    name: string | null
  ): validateType {
    if (!username || !password || !name) {
      return { result: false, message: "데이터를 입력해주세요" };
    }
    if (password.length < 6) {
      return { result: false, message: "비밀 번호 길이가 6자이하 입니다" };
    }
    if (!/^[a-zA-Z0-9]+$/.test(username)) {
      return {
        result: false,
        message: "아이디는 영문과 숫자로만 입력해주세요",
      };
    }
    return { result: true, message: "" };
  }

  alterLocalStorage(data: any, calback: Function | null) {
    if (data == null || Object.keys(data).length === 0) {
      localStorage.removeItem(this.CONTEXT_KEY);
    } else {
      localStorage.setItem(this.CONTEXT_KEY, JSON.stringify(data));
    }
    if (calback) {
      calback();
    }
  }
  get getLocalStorage() {
    if (localStorage.getItem(this.CONTEXT_KEY) == null) {
      return null;
    }
    return JSON.parse(localStorage.getItem(this.CONTEXT_KEY) as string);
  }
}
