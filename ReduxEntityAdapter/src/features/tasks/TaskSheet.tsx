import { useState } from "react";
import type { Task, TaskStatus, TaskHistoryEntry } from "./tasksSlice";
import type { User } from "./usersSlice";
import { useAppDispatch } from "@/app/hooks";
import { addComment } from "./tasksSlice";
import { MS_PER_MINUTE, MS_PER_HOUR, MS_PER_DAY } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, ArrowRightLeft, UserPlus, Send } from "lucide-react";

const HISTORY_ICONS: Record<TaskHistoryEntry["type"], typeof MessageSquare> = {
  status: ArrowRightLeft,
  assign: UserPlus,
  comment: MessageSquare,
};

function formatTime(ts: number) {
  const d = new Date(ts);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / MS_PER_MINUTE);
  const diffH = Math.floor(diffMs / MS_PER_HOUR);
  const diffD = Math.floor(diffMs / MS_PER_DAY);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffH < 24) return `${diffH}h ago`;
  if (diffD < 7) return `${diffD}d ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

interface TaskSheetProps {
  task: Task | null;
  users: User[];
  onClose: () => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onAssign: (
    taskId: string,
    userId: string | null,
    userName: string | null,
  ) => void;
}

export function TaskSheet({
  task,
  users,
  onClose,
  onStatusChange,
  onAssign,
}: TaskSheetProps) {
  const dispatch = useAppDispatch();
  const [comment, setComment] = useState("");

  const handleComment = () => {
    if (!task || !comment.trim()) return;
    dispatch(addComment({ taskId: task.id, message: comment.trim() }));
    setComment("");
  };

  const sortedHistory = task
    ? [...task.history].sort((a, b) => b.timestamp - a.timestamp)
    : [];

  return (
    <Sheet open={task !== null} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{task?.title ?? "Task Details"}</SheetTitle>
          <SheetDescription>View and manage this task</SheetDescription>
        </SheetHeader>

        {task && (
          <Tabs defaultValue="details" className="mt-6">
            <TabsList className="w-full">
              <TabsTrigger value="details" className="flex-1">
                Details
              </TabsTrigger>
              <TabsTrigger value="history" className="flex-1">
                History
                {task.history.length > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-2 h-5 px-1.5 text-xs"
                  >
                    {task.history.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6 mt-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <p className="text-sm">{task.title}</p>
              </div>

              {task.description && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <p className="text-sm text-muted-foreground">
                      {task.description}
                    </p>
                  </div>
                </>
              )}

              <Separator />

              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={task.status}
                  onValueChange={(v) =>
                    onStatusChange(task.id, v as TaskStatus)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="inProgress">In Progress</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Assigned To</Label>
                <Select
                  value={task.userId ?? "none"}
                  onValueChange={(v) => {
                    const userId = v === "none" ? null : v;
                    const userName = userId
                      ? (users.find((u) => u.id === userId)?.name ?? null)
                      : null;
                    onAssign(task.id, userId, userName);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Unassigned" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Unassigned</SelectItem>
                    {users.map((u) => (
                      <SelectItem key={u.id} value={u.id}>
                        {u.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>ID</Label>
                <p className="text-xs text-muted-foreground font-mono">
                  {task.id}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="history" className="mt-4">
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write a comment..."
                    onKeyDown={(e) => e.key === "Enter" && handleComment()}
                  />
                  <Button
                    size="icon"
                    onClick={handleComment}
                    disabled={!comment.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>

                <Separator />

                <ScrollArea className="h-[400px] pr-2">
                  <div className="space-y-4">
                    {sortedHistory.map((entry) => {
                      const Icon = HISTORY_ICONS[entry.type];
                      return (
                        <div key={entry.id} className="flex gap-3">
                          <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted">
                            <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm">{entry.message}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {formatTime(entry.timestamp)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    {sortedHistory.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-8">
                        No history yet
                      </p>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </SheetContent>
    </Sheet>
  );
}
