// /components/project/ProjectHeader.tsx (Updated)
import Avatar from '../common/Avatar';

type Role = 'owner' | 'admin' | 'member';

interface Member {
    userId: { _id: string; name: string; avatarUrl?: string };
}

interface Project {
  name: string;
  description?: string;
  members: Member[];
}

interface ProjectHeaderProps {
    project: Project;
    userRole: Role;
}

export default function ProjectHeader({ project, userRole }: ProjectHeaderProps) {
    const openInviteModal = () => {
        const modal = document.getElementById('invite_member_modal') as HTMLDialogElement;
        if (modal) {
            modal.showModal();
        }
    };
  
  return (
    <div className="mb-6 border-b border-base-300 pb-4">
      <div className="flex flex-col md:flex-row justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">{project.name}</h1>
          <p className="mt-1 text-base-content/70">{project.description}</p>
        </div>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
            <div className="flex items-center -space-x-2">
            {project.members.slice(0, 5).map(({ userId }) => (
                <div key={userId._id} className="tooltip" data-tip={userId.name}>
                <Avatar user={userId} />
                </div>
            ))}
            {project.members.length > 5 && (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-base-300 text-sm font-bold">
                +{project.members.length - 5}
                </div>
            )}
            </div>
            
            {/* --- CONDITIONAL UI --- */}
            {(userRole === 'owner' || userRole === 'admin') && (
                <button className="btn btn-primary" onClick={openInviteModal}>Invite Member</button>
            )}
        </div>
      </div>
    </div>
  );
}