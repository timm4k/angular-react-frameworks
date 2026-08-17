import type { TaskWithUser, TaskStatus } from "./tasksSlice";
import { STATUS_LABELS } from "./tasksSlice";
import { getInitials } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChevronRight, User as UserIcon } from "lucide-react";

const STATUS_VARIANTS: Record<TaskStatus, "secondary" | "default" | "outline"> =
  {
    todo: "secondary",
    inProgress: "default",
    done: "outline",
  };

interface TaskCardProps {
  task: TaskWithUser;
  onOpen: () => void;
  onStatusChange: (status: TaskStatus) => void;
}

export function TaskCard({ task, onOpen, onStatusChange }: TaskCardProps) {
  const nextStatus: Record<TaskStatus, TaskStatus> = {
    todo: "inProgress",
    inProgress: "done",
    done: "todo",
  };

  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={onOpen}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-sm leading-tight">{task.title}</CardTitle>
          <Badge variant={STATUS_VARIANTS[task.status]} className="shrink-0">
            {STATUS_LABELS[task.status]}
          </Badge>
        </div>
        {task.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {task.description}
          </p>
        )}
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {task.user ? (
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-xs bg-primary/10 text-primary">
                  {getInitials(task.user.name)}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground">
                {task.user.name}
              </span>
            </div>
          ) : (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <UserIcon className="h-3 w-3" /> Unassigned
            </span>
          )}
        </div>
        <Button
          size="sm"
          variant="ghost"
          className="h-7 px-2"
          onClick={(e) => {
            e.stopPropagation();
            onStatusChange(nextStatus[task.status]);
          }}
        >
          <ChevronRight className="h-3 w-3" />
        </Button>
      </CardContent>
    </Card>
  );
}
