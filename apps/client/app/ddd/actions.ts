import { BoardService } from "./application/BoardService";
import { CalendarService } from "./application/CalendarService";
import { GithubService } from "./application/GithubService";
import { KafkaService } from "./application/KafkaService";
import { ScrappingService } from "./application/ScrappingService";
import { UserService } from "./application/UserService";
import { RepoBoardRepositoryImpl } from "./infrastructure/board/RepoBoardRepositoryImpl";
import { RepoCalendarRepositoryImpl } from "./infrastructure/calendar/RepoCalendarRepositoryImpl";
import { RepoGithubRepositoryImpl } from "./infrastructure/github/RepoGithubRepositoryImpl";
import { RepoKafkaRepositoryImpl } from "./infrastructure/kafka/RepoKafkaRepositoryImpl";
import { ScrappingRepositoryImpl } from "./infrastructure/scrapping/ScrappingRepositoryImpl";
import { UserRepositoryImpl } from "./infrastructure/user/RepoUserRepositoryImpl";

//비즈니스 로직을 수행하는 영역(브릿지 역할)
const userRepository = new UserRepositoryImpl();
const boardRepository = new RepoBoardRepositoryImpl();
const calendarRepository = new RepoCalendarRepositoryImpl();
const scrappingRepository = new ScrappingRepositoryImpl();
const githubRepository = new RepoGithubRepositoryImpl();
const kafkaRepository = new RepoKafkaRepositoryImpl();

const useUserService = new UserService(userRepository);
const useBoardService = BoardService.getInstance(boardRepository);
const useCalendarService = CalendarService.getInstance(calendarRepository);
const useScrappingService = ScrappingService.getInstance(scrappingRepository);
const useGithubService = GithubService.getInstance(githubRepository);
const useKafkaService = KafkaService.getInstance(kafkaRepository);

export {
  useUserService,
  useBoardService,
  useCalendarService,
  useScrappingService,
  useGithubService,
  useKafkaService,
};
