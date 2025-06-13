import Task from "./Task";
import { fn } from "storybook/test";

export const ActionsData = {
  onCheckBoxChange: fn(),
  onButtonClick: fn(),
};

export default {
  component: Task,
  title: "Task",
  tags: ["autodocs"],
  //👇 "Data"로 끝나는 export들은 스토리가 아닙니다.
  excludeStories: /.*Data$/,
  args: {
    ...ActionsData,
  },
};

export const Default = {
  args: {
    task: {
      id: "1",
      title: "Test Task11111",
      state: "TASK_INBOX",
    },
  },
};

export const Pinned = {
  args: {
    task: {
      ...Default.args.task,
      state: "TASK_PINNED",
    },
  },
};

export const Archived = {
  args: {
    task: {
      ...Default.args.task,
      state: "TASK_ARCHIVED",
    },
  },
};
