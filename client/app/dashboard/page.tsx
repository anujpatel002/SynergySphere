"use client";
import { useEffect, useState } from 'react'; // Correctly import useState here
import { useProjects } from '../../contexts/ProjectContext';
import ProjectCard from '../../components/project/ProjectCard';
import Spinner from '../../components/common/Spinner';
import CreateProjectModal from '../../components/project/CreateProjectModal';
import { PlusIcon } from '@heroicons/react/24/solid';

export default function DashboardPage() {
  const { projects, fetchProjects } = useProjects();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects().finally(() => setLoading(false));
  }, [fetchProjects]);
  
  const openCreateModal = () => {
    const modal = document.getElementById('create_project_modal') as HTMLDialogElement;
    modal?.showModal();
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full"><Spinner /></div>;
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Projects</h1>
        <button className="btn btn-primary" onClick={openCreateModal}>
          <PlusIcon className="w-5 h-5" />
          New Project
        </button>
      </div>
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-base-100 rounded-lg">
            <h2 className="text-xl font-semibold">No Projects Yet</h2>
            <p className="mt-2 text-base-content/60">Get started by creating a new project.</p>
        </div>
      )}
      <CreateProjectModal />
    </>
  );
}