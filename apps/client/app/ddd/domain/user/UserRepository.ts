import { User } from "./Repo";

//[use case] Domain Layer
export interface UserRepository {
  findOneUser(username: string, password: string): any;
  insertUser(
    username: string,
    password: string,
    authCodes: string,
    name: string | null,
  ): Promise<any>;
  findMe(): Promise<any>;
  findUserWithPage(
    page: number,
    limit: number,
    username: string | null,
    name: string | null,
  ): Promise<any>;
  updateUser(
    id: string,
    oldPassword: string,
    newPassword: string,
    authCodes: string,
    name: string | null,
  ): Promise<any>;
  deleteUser(id: string, oldPassword: string): Promise<any>;

  logOut(username: string): Promise<any>;
}
