// /components/task/TaskColumn.tsx (Updated)
import { PlusIcon } from '@heroicons/react/24/solid';
import TaskCard from './TaskCard';
import CreateTaskModal from './CreateTaskModal';

// ... (interfaces remain the same)

export default function TaskColumn({ status, tasks, projectId, onUpdate }: TaskColumnProps) {
  const openCreateModal = () => {
    const modal = document.getElementById(`create_task_modal_${status}`) as HTMLDialogElement;
    modal?.showModal();
  };
  
  return (
    <>
      <div className="flex flex-col rounded-lg bg-base-100/50 h-[70vh]">
        <div className="flex justify-between items-center p-4 border-b border-base-300">
            <h2 className="font-semibold text-lg flex items-center gap-2">
                {status}
                <span className="badge badge-neutral">{tasks.length}</span>
            </h2>
        </div>
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {tasks.map((task) => (
            <TaskCard key={task._id} task={task} />
          ))}
        </div>
        <div className="p-2">
            <button className="btn btn-ghost w-full" onClick={openCreateModal}>
                <PlusIcon className="w-5 h-5" /> Add Task
            </button>
        </div>
      </div>
      <CreateTaskModal projectId={projectId} columnStatus={status} onTaskCreated={onUpdate} />
    </>
  );
}