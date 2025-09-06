// /components/project/ProjectCard.tsx (Updated)
import Link from 'next/link';

interface Project {
  _id: string;
  name: string;
  description?: string;
  // These fields would be added to your backend API response for a richer card
  memberCount?: number;
  taskCount?: number;
}

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/projects/${project._id}`} className="card bg-base-100 shadow-md hover:shadow-xl transition-shadow group">
      <div className="card-body">
        <h2 className="card-title text-lg group-hover:text-primary transition-colors">{project.name}</h2>
        <p className="text-sm opacity-70 flex-grow min-h-[40px]">{project.description || 'No description provided.'}</p>
        <div className="card-actions justify-end mt-4 border-t border-base-300 pt-4">
            {/* Example of richer data - you would need to add this data from your API */}
            {/* <div className="stat-value text-sm">{project.memberCount || 0} Members</div> */}
            {/* <div className="stat-value text-sm">{project.taskCount || 0} Tasks</div> */}
            <div className="badge badge-outline">View</div>
        </div>
      </div>
    </Link>
  );
}