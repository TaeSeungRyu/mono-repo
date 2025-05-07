import { User } from "./Repo";

//[use case] Domain Layer
export interface UserRepository {
  findOneUser(username: string, password: string): any;
  insertUser(
    username: string,
    password: string,
    name: string | null
  ): Promise<any>;
  findMe(): Promise<any>;
}
