import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  addTask,
  selectTasksWithUsers,
  selectTasksGroupedByStatus,
  selectActiveTask,
  setActiveTaskId,
  updateTaskStatus,
  assignTaskToUser,
  type TaskStatus,
} from "./tasksSlice";
import { selectAllUsers } from "./usersSlice";
import { TaskCard } from "./TaskCard";
import { TaskSheet } from "./TaskSheet";
import { KanbanBoard } from "./KanbanBoard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Plus, List, LayoutGrid } from "lucide-react";

export function TasksPage() {
  const dispatch = useAppDispatch();
  const tasksWithUsers = useAppSelector(selectTasksWithUsers);
  const grouped = useAppSelector(selectTasksGroupedByStatus);
  const activeTask = useAppSelector(selectActiveTask);
  const users = useAppSelector(selectAllUsers);
  const [view, setView] = useState<"list" | "kanban">("list");
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newStatus, setNewStatus] = useState<TaskStatus>("todo");
  const [selectedUserId, setSelectedUserId] = useState<string>("none");
  const [titleError, setTitleError] = useState<string | undefined>();

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      setTitleError("Title is required");
      return;
    }
    setTitleError(undefined);
    const userId = selectedUserId === "none" ? null : selectedUserId;
    dispatch(
      addTask(newTitle.trim(), newStatus, newDescription.trim(), userId),
    );
    setNewTitle("");
    setNewDescription("");
    setNewStatus("todo");
    setSelectedUserId("none");
  };

  const totalTasks = tasksWithUsers.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Tasks</h2>
          <p className="text-sm text-muted-foreground">
            {totalTasks} total · {grouped.todo.length} to do ·{" "}
            {grouped.inProgress.length} in progress · {grouped.done.length} done
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{users.length} users</Badge>
          <Button
            variant={view === "list" ? "default" : "outline"}
            size="icon"
            onClick={() => setView("list")}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={view === "kanban" ? "default" : "outline"}
            size="icon"
            onClick={() => setView("kanban")}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add Task</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleAdd}
            className="grid grid-cols-[1fr_160px_180px_auto] gap-4"
          >
            <div className="space-y-1.5">
              <Label htmlFor="task-title">Title</Label>
              <Input
                id="task-title"
                value={newTitle}
                onChange={(e) => {
                  setNewTitle(e.target.value);
                  setTitleError(undefined);
                }}
                placeholder="New task..."
              />
              {titleError && (
                <p className="text-xs text-destructive">{titleError}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select
                value={newStatus}
                onValueChange={(v) => setNewStatus(v as TaskStatus)}
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
            <div className="space-y-1.5">
              <Label>Assign To</Label>
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
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
            <Button type="submit" className="self-end">
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </form>
          <div className="mt-3">
            <Label htmlFor="task-description">Description (optional)</Label>
            <Input
              id="task-description"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Brief description of the task..."
              className="mt-1.5"
            />
          </div>
        </CardContent>
      </Card>

      <Separator />

      {view === "kanban" ? (
        <KanbanBoard grouped={grouped} users={users} />
      ) : (
        <div className="space-y-4">
          {tasksWithUsers.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">
              No tasks yet. Add one above.
            </p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {tasksWithUsers.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onOpen={() => dispatch(setActiveTaskId(task.id))}
                  onStatusChange={(status) =>
                    dispatch(updateTaskStatus({ id: task.id, status }))
                  }
                />
              ))}
            </div>
          )}
        </div>
      )}

      <TaskSheet
        task={activeTask}
        users={users}
        onClose={() => dispatch(setActiveTaskId(null))}
        onStatusChange={(id, status) =>
          dispatch(updateTaskStatus({ id, status }))
        }
        onAssign={(taskId, userId, userName) =>
          dispatch(assignTaskToUser({ taskId, userId, userName }))
        }
      />
    </div>
  );
}
