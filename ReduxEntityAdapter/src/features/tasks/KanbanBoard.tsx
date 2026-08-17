import type { Task, TaskStatus } from "./tasksSlice";
import type { User } from "./usersSlice";
import { useAppDispatch } from "@/app/hooks";
import { updateTaskStatus } from "./tasksSlice";
import { getInitials } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChevronLeft, ChevronRight, User as UserIcon } from "lucide-react";
import { useAutoAnimate } from "@formkit/auto-animate/react";

const COLUMNS: { key: TaskStatus; label: string; color: string }[] = [
  { key: "todo", label: "To Do", color: "bg-zinc-900 border-zinc-700" },
  {
    key: "inProgress",
    label: "In Progress",
    color: "bg-violet-950 border-violet-800",
  },
  { key: "done", label: "Done", color: "bg-emerald-950 border-emerald-800" },
];

const STATUS_ORDER: TaskStatus[] = ["todo", "inProgress", "done"];

interface KanbanBoardProps {
  grouped: Record<TaskStatus, Task[]>;
  users: User[];
}

export function KanbanBoard({ grouped, users }: KanbanBoardProps) {
  const dispatch = useAppDispatch();

  const moveTask = (taskId: string, direction: "forward" | "backward") => {
    const current = Object.entries(grouped).find(([, tasks]) =>
      tasks.some((t) => t.id === taskId),
    );
    if (!current) return;
    const currentStatus = current[0] as TaskStatus;
    const idx = STATUS_ORDER.indexOf(currentStatus);
    const nextIdx = direction === "forward" ? idx + 1 : idx - 1;
    if (nextIdx < 0 || nextIdx >= STATUS_ORDER.length) return;
    dispatch(updateTaskStatus({ id: taskId, status: STATUS_ORDER[nextIdx] }));
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {COLUMNS.map((col) => (
        <KanbanColumn
          key={col.key}
          title={col.label}
          color={col.color}
          tasks={grouped[col.key]}
          users={users}
          canMoveBackward={col.key !== "todo"}
          canMoveForward={col.key !== "done"}
          onMove={moveTask}
        />
      ))}
    </div>
  );
}

interface KanbanColumnProps {
  title: string;
  color: string;
  tasks: Task[];
  users: User[];
  canMoveBackward: boolean;
  canMoveForward: boolean;
  onMove: (taskId: string, direction: "forward" | "backward") => void;
}

function KanbanColumn({
  title,
  color,
  tasks,
  users,
  canMoveBackward,
  canMoveForward,
  onMove,
}: KanbanColumnProps) {
  const [parent] = useAutoAnimate();

  return (
    <div className={`rounded-lg border-2 ${color} p-3 space-y-3`}>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">{title}</h3>
        <Badge variant="secondary" className="text-xs">
          {tasks.length}
        </Badge>
      </div>
      <div ref={parent} className="space-y-2 min-h-[100px]">
        {tasks.map((task) => {
          const assignee = task.userId
            ? users.find((u) => u.id === task.userId)
            : null;

          return (
            <Card key={task.id} className="shadow-sm">
              <CardContent className="p-3">
                <p className="text-sm font-medium mb-2">{task.title}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {assignee ? (
                      <Avatar className="h-5 w-5">
                        <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                          {getInitials(assignee.name)}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <UserIcon className="h-3.5 w-3.5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex items-center gap-0.5">
                    {canMoveBackward && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => onMove(task.id, "backward")}
                      >
                        <ChevronLeft className="h-3 w-3" />
                      </Button>
                    )}
                    {canMoveForward && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => onMove(task.id, "forward")}
                      >
                        <ChevronRight className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {tasks.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-4">
            No tasks
          </p>
        )}
      </div>
    </div>
  );
}
