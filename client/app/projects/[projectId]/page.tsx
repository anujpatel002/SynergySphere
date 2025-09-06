// /app/projects/[projectId]/page.tsx
"use client";

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import socket from '@/lib/socket';
import { useAuth } from '@/hooks/useAuth';

import ProjectHeader from '@/components/project/ProjectHeader';
import TaskBoard from '@/components/project/TaskBoard';
import DiscussionBoard from '@/components/project/DiscussionBoard';
import Spinner from '@/components/common/Spinner';
import InviteMemberModal from '@/components/project/InviteMemberModal';

// Type Definitions
type Role = 'owner' | 'admin' | 'member';
interface Member { userId: { _id: string; name: string; email: string; avatarUrl?: string }; role: Role; }
interface Task { _id: string; title: string; description?: string; status: 'To-Do' | 'In Progress' | 'Done'; priority: 'Low' | 'Medium' | 'High'; assignee?: { _id: string; name: string; avatarUrl?: string }; }
interface Project { _id: string; name: string; description?: string; owner: string; members: Member[]; tasks: Task[]; }

export default function ProjectPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const { user } = useAuth();

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'tasks' | 'discussion'>('tasks');

  const userRole = useMemo(() => {
    if (!user || !project) return 'member';
    const memberInfo = project.members.find(m => m.userId._id === user._id);
    return memberInfo ? memberInfo.role : 'member';
  }, [user, project]);

  const fetchProjectDetails = useCallback(async () => {
    if (!projectId) return;
    try {
      const { data } = await api.get(`/projects/${projectId}`);
      setProject(data.project);
      setTasks(data.project.tasks || []);
    } catch (error) {
      console.error("Failed to fetch project details", error);
    }
  }, [projectId]);

  useEffect(() => {
    setLoading(true);
    fetchProjectDetails().finally(() => setLoading(false));

    if (socket) {
      socket.connect();
      socket.emit('joinProject', projectId);

      const handleTaskCreated = (newTask: Task) => setTasks((prev) => [...prev, newTask]);
      const handleTaskUpdated = (updatedTask: Task) => setTasks((prev) => prev.map((t) => (t._id === updatedTask._id ? updatedTask : t)));
      const handleTaskDeleted = ({ taskId }: { taskId: string }) => setTasks((prev) => prev.filter((t) => t._id !== taskId));

      socket.on('task:created', handleTaskCreated);
      socket.on('task:updated', handleTaskUpdated);
      socket.on('task:deleted', handleTaskDeleted);

      return () => {
        socket.emit('leaveProject', projectId);
        socket.off('task:created', handleTaskCreated);
        socket.off('task:updated', handleTaskUpdated);
        socket.off('task:deleted', handleTaskDeleted);
      };
    }
  }, [projectId, fetchProjectDetails]);

  if (loading) {
    return <div className="flex h-full w-full items-center justify-center"><Spinner /></div>;
  }
  if (!project) {
    return <div className="p-8 text-center">Project not found or you do not have access.</div>;
  }

  return (
    <>
      <div className="flex h-full flex-col">
        <ProjectHeader project={project} userRole={userRole} />
        
        <div role="tablist" className="tabs tabs-lifted">
          <a role="tab" className={`tab ${activeTab === 'tasks' ? 'tab-active font-bold' : ''}`} onClick={() => setActiveTab('tasks')}>Task Board</a>
          <a role="tab" className={`tab ${activeTab === 'discussion' ? 'tab-active font-bold' : ''}`} onClick={() => setActiveTab('discussion')}>Discussion</a>
        </div>
        
        <div className="flex-1 bg-base-100 p-4 md:p-6 rounded-b-lg rounded-tr-lg shadow-inner overflow-hidden">
          {activeTab === 'tasks' && <TaskBoard tasks={tasks} projectId={projectId} onUpdate={fetchProjectDetails} />}
          {activeTab === 'discussion' && <DiscussionBoard projectId={projectId} />}
        </div>
      </div>
      <InviteMemberModal projectId={projectId} />
    </>
  );
}