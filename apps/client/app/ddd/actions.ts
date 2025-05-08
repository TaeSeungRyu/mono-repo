import { BoardService } from "./application/BoardService";
import { UserService } from "./application/UserService";
import { RepoBoardRepositoryImpl } from "./infrastructure/board/RepoBoardRepositoryImpl";
import { UserRepositoryImpl } from "./infrastructure/user/RepoUserRepositoryImpl";

//비즈니스 로직을 수행하는 영역(브릿지 역할)
const userRepository = new UserRepositoryImpl();
const boardRepository = new RepoBoardRepositoryImpl();

const useUserService = new UserService(userRepository);
const useBoardService = BoardService.getInstance(boardRepository);

export { useUserService, useBoardService };
