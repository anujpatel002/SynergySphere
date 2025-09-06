// client/app/dashboard/page.tsx
"use client";
import { useEffect, useState } from 'react';
import { useProjects } from '../../contexts/ProjectContext';
import ProjectCard from '../../components/project/ProjectCard';
import { PlusIcon } from '@heroicons/react/24/solid';
import { Button } from '@/components/common/Button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/common/Dialog';
import CreateProjectModal from '../../components/project/CreateProjectModal';

export default function DashboardPage() {
  const { projects, fetchProjects } = useProjects();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects().finally(() => setLoading(false));
  }, [fetchProjects]);

  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
        <div className="flex items-center space-x-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <PlusIcon className="w-5 h-5 mr-2" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create a New Project</DialogTitle>
                <DialogDescription>
                  Start a new collaborative project.
                </DialogDescription>
              </DialogHeader>
              <CreateProjectModal />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="mt-8">
        {loading ? (
          <div className="flex justify-center items-center h-full">Loading projects...</div>
        ) : projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 rounded-lg border border-dashed">
            <h2 className="text-xl font-semibold">No Projects Yet</h2>
            <p className="mt-2 text-sm text-muted-foreground">Get started by creating a new project.</p>
          </div>
        )}
      </div>
    </>
  );
}