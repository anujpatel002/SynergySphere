// /components/project/TaskBoard.tsx
import TaskColumn from '@/components/task/TaskColumn';

type TaskStatus = 'To-Do' | 'In Progress' | 'Done';

interface Task {
  _id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: 'Low' | 'Medium' | 'High';
}

interface TaskBoardProps {
  tasks: Task[];
  projectId: string;
}

export default function TaskBoard({ tasks, projectId }: TaskBoardProps) {
  const columns: TaskStatus[] = ['To-Do', 'In Progress', 'Done'];

  const filteredTasks = (status: TaskStatus) => tasks.filter(task => task.status === status);

  return (
    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-x-auto">
      {columns.map((status) => (
        <TaskColumn
          key={status}
          status={status}
          tasks={filteredTasks(status)}
          projectId={projectId}
        />
      ))}
    </div>
  );
}