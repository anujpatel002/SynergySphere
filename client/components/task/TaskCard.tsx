// /components/task/TaskCard.tsx (Updated)
import Avatar from '../common/Avatar';

interface Task {
  _id: string;
  title: string;
  description?: string;
  priority: 'Low' | 'Medium' | 'High';
  assignee?: { _id: string; name: string; avatarUrl?: string };
}

const priorityClasses = {
  High: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-l-red-500' },
  Medium: { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-l-yellow-500' },
  Low: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-l-green-500' },
};

export default function TaskCard({ task }: { task: Task }) {
  const priorityStyle = priorityClasses[task.priority] || priorityClasses.Medium;

  return (
    <div className={`card bg-base-100 shadow-sm border-l-4 ${priorityStyle.border} cursor-pointer hover:shadow-lg transition-shadow`}>
      <div className="card-body p-4">
        <span className={`badge badge-sm ${priorityStyle.bg} ${priorityStyle.text} self-start`}>{task.priority}</span>
        <h3 className="font-semibold mt-2">{task.title}</h3>
        <div className="card-actions justify-end mt-4">
          {task.assignee && (
             <div className="tooltip" data-tip={`Assigned to ${task.assignee.name}`}>
                <Avatar user={task.assignee} size="sm" />
             </div>
          )}
        </div>
      </div>
    </div>
  );
}