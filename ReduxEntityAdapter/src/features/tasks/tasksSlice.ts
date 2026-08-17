import {
  createSlice,
  createEntityAdapter,
  nanoid,
  createSelector,
} from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/app/hooks";
import { MS_PER_DAY } from "@/lib/utils";

export type TaskStatus = "todo" | "inProgress" | "done";

type HistoryEntryType = "status" | "assign" | "comment";

export interface TaskHistoryEntry {
  id: string;
  type: HistoryEntryType;
  message: string;
  timestamp: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  userId: string | null;
  history: TaskHistoryEntry[];
}

export interface TaskWithUser extends Task {
  user: { id: string; name: string; avatarUrl: string } | null;
}

const tasksAdapter = createEntityAdapter<Task>();

function loadTasks() {
  try {
    const raw = localStorage.getItem("tasks");
    if (raw) return JSON.parse(raw) as TasksState;
  } catch {}
  const now = Date.now();
  const SEED_TASKS: Task[] = [
    {
      id: nanoid(),
      title: "Design landing page",
      description:
        "Create wireframes and high-fidelity mockups for the main marketing page. Include responsive breakpoints for mobile, tablet, and desktop. Use the new brand color palette",
      status: "todo",
      userId: null,
      history: [
        {
          id: nanoid(),
          type: "comment",
          message:
            "Waiting for brand guidelines from the design team before starting",
          timestamp: now - MS_PER_DAY * 3,
        },
      ],
    },
    {
      id: nanoid(),
      title: "Set up CI/CD pipeline",
      description:
        "Configure GitHub Actions for automated testing, linting, and deployment. Pipeline should run on every PR and deploy to staging automatically",
      status: "todo",
      userId: null,
      history: [
        {
          id: nanoid(),
          type: "comment",
          message: "Researching best practices for monorepo CI setups",
          timestamp: now - MS_PER_DAY * 2,
        },
      ],
    },
    {
      id: nanoid(),
      title: "Write API documentation",
      description:
        "Document all REST endpoints with request/response examples using OpenAPI 3.0 spec. Include authentication flow and error code reference",
      status: "inProgress",
      userId: null,
      history: [
        {
          id: nanoid(),
          type: "status",
          message: "Status changed to In Progress",
          timestamp: now - MS_PER_DAY * 5,
        },
        {
          id: nanoid(),
          type: "comment",
          message:
            "Started with the /auth endpoints. Request/response schemas are drafted",
          timestamp: now - MS_PER_DAY * 3,
        },
      ],
    },
    {
      id: nanoid(),
      title: "Implement auth flow",
      description:
        "Add JWT-based authentication with refresh token rotation. Support email/password sign-in and Google OAuth. Session expires after 15 minutes of inactivity",
      status: "inProgress",
      userId: null,
      history: [
        {
          id: nanoid(),
          type: "status",
          message: "Status changed to In Progress",
          timestamp: now - MS_PER_DAY * 7,
        },
        {
          id: nanoid(),
          type: "comment",
          message: "JWT tokens implemented. Google OAuth integration is next",
          timestamp: now - MS_PER_DAY * 4,
        },
        {
          id: nanoid(),
          type: "comment",
          message:
            "Refresh token rotation working in staging. Needs security review",
          timestamp: now - MS_PER_DAY * 1,
        },
      ],
    },
    {
      id: nanoid(),
      title: "Create database schema",
      description:
        "Design PostgreSQL schema for users, tasks, and projects tables. Add proper indexes for frequently queried columns and foreign key constraints",
      status: "done",
      userId: null,
      history: [
        {
          id: nanoid(),
          type: "status",
          message: "Status changed to In Progress",
          timestamp: now - MS_PER_DAY * 14,
        },
        {
          id: nanoid(),
          type: "comment",
          message:
            "Initial ERD draft completed with users, tasks, and projects",
          timestamp: now - MS_PER_DAY * 12,
        },
        {
          id: nanoid(),
          type: "status",
          message: "Status changed to Done",
          timestamp: now - MS_PER_DAY * 10,
        },
        {
          id: nanoid(),
          type: "comment",
          message:
            "Schema approved and migrated to staging. Indexes verified with EXPLAIN ANALYZE",
          timestamp: now - MS_PER_DAY * 10,
        },
      ],
    },
    {
      id: nanoid(),
      title: "Set up project scaffolding",
      description:
        "Initialize Vite + React + TypeScript project. Configure ESLint, Prettier, path aliases, and Tailwind CSS. Add Husky pre-commit hooks",
      status: "done",
      userId: null,
      history: [
        {
          id: nanoid(),
          type: "status",
          message: "Status changed to In Progress",
          timestamp: now - MS_PER_DAY * 21,
        },
        {
          id: nanoid(),
          type: "status",
          message: "Status changed to Done",
          timestamp: now - MS_PER_DAY * 20,
        },
        {
          id: nanoid(),
          type: "comment",
          message:
            "All tooling configured and working. Lint + typecheck + build pipeline verified",
          timestamp: now - MS_PER_DAY * 20,
        },
      ],
    },
  ];
  return {
    ...tasksAdapter.setAll(tasksAdapter.getInitialState(), SEED_TASKS),
    activeTaskId: null,
  };
}

interface TasksState extends ReturnType<typeof tasksAdapter.getInitialState> {
  activeTaskId: string | null;
}

const initialState: TasksState = loadTasks();

function pushHistory(
  state: TasksState,
  taskId: string,
  entry: Omit<TaskHistoryEntry, "id" | "timestamp">,
) {
  const task = state.entities[taskId];
  if (!task) return;
  task.history.push({ id: nanoid(), timestamp: Date.now(), ...entry });
}

export const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: "To Do",
  inProgress: "In Progress",
  done: "Done",
};

export const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask: {
      reducer: tasksAdapter.addOne,
      prepare: (
        title: string,
        status: TaskStatus = "todo",
        description: string = "",
        userId: string | null = null,
      ) => ({
        payload: {
          id: nanoid(),
          title,
          description,
          status,
          userId,
          history: [
            {
              id: nanoid(),
              type: "status" as const,
              message: `Status changed to ${STATUS_LABELS[status]}`,
              timestamp: Date.now(),
            },
          ],
        },
      }),
    },
    updateTaskStatus(
      state,
      action: PayloadAction<{ id: string; status: TaskStatus }>,
    ) {
      const task = state.entities[action.payload.id];
      if (task && task.status !== action.payload.status) {
        const newStatus = action.payload.status;
        tasksAdapter.updateOne(state, {
          id: action.payload.id,
          changes: { status: newStatus },
        });
        pushHistory(state, action.payload.id, {
          type: "status",
          message: `Status changed to ${STATUS_LABELS[newStatus]}`,
        });
      }
    },
    assignTaskToUser(
      state,
      action: PayloadAction<{
        taskId: string;
        userId: string | null;
        userName: string | null;
      }>,
    ) {
      const task = state.entities[action.payload.taskId];
      if (task) {
        tasksAdapter.updateOne(state, {
          id: action.payload.taskId,
          changes: { userId: action.payload.userId },
        });
        pushHistory(state, action.payload.taskId, {
          type: "assign",
          message: action.payload.userName
            ? `Assigned to ${action.payload.userName}`
            : "Unassigned",
        });
      }
    },
    addComment(
      state,
      action: PayloadAction<{ taskId: string; message: string }>,
    ) {
      pushHistory(state, action.payload.taskId, {
        type: "comment",
        message: action.payload.message,
      });
    },
    setActiveTaskId(state, action: PayloadAction<string | null>) {
      state.activeTaskId = action.payload;
    },
  },
});

export const {
  addTask,
  updateTaskStatus,
  assignTaskToUser,
  addComment,
  setActiveTaskId,
} = tasksSlice.actions;
export const tasksReducer = tasksSlice.reducer;

const tasksSelector = tasksAdapter.getSelectors(
  (state: RootState) => state.tasks,
);

const { selectAll: selectAllTasks } = tasksSelector;

const selectActiveTaskId = (state: RootState) => state.tasks.activeTaskId;
const selectUsersState = (state: RootState) => state.users;
const selectTasksEntities = (state: RootState) => state.tasks.entities;

export const selectTasksWithUsers = createSelector(
  [selectAllTasks, selectUsersState],
  (tasks, usersState) => {
    const usersAdapter = createEntityAdapter<{
      id: string;
      name: string;
      avatarUrl: string;
    }>();
    const { selectById } = usersAdapter.getSelectors(
      (s: typeof usersState) => s,
    );
    return tasks.map(
      (task): TaskWithUser => ({
        ...task,
        user: task.userId
          ? (selectById(usersState, task.userId) ?? null)
          : null,
      }),
    );
  },
);

export const selectActiveTask = createSelector(
  [selectActiveTaskId, selectTasksEntities],
  (activeId, entities) => {
    if (!activeId) return null;
    return entities[activeId] ?? null;
  },
);

export const selectTasksGroupedByStatus = createSelector(
  [selectAllTasks],
  (tasks): Record<TaskStatus, Task[]> => ({
    todo: tasks.filter((t) => t.status === "todo"),
    inProgress: tasks.filter((t) => t.status === "inProgress"),
    done: tasks.filter((t) => t.status === "done"),
  }),
);
