// /contexts/ProjectContext.tsx
"use client";

import { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import api from '../lib/api';

interface Project {
  _id: string;
  name: string;
  description?: string;
}

interface ProjectContextType {
  projects: Project[];
  fetchProjects: () => Promise<void>;
  createProject: (name: string, description: string) => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const [projects, setProjects] = useState<Project[]>([]);

  const fetchProjects = useCallback(async () => {
    try {
      const { data } = await api.get('/projects');
      setProjects(data.projects);
    } catch (error) {
      console.error("Failed to fetch projects", error);
      setProjects([]);
    }
  }, []);

  const createProject = async (name: string, description: string) => {
    try {
      const { data } = await api.post('/projects', { name, description });
      // Add the new project to the list without a full refetch
      setProjects(prevProjects => [...prevProjects, data.project]);
    } catch (error) {
      console.error("Failed to create project", error);
      // Re-throw the error to be caught in the component
      throw error;
    }
  };

  return (
    <ProjectContext.Provider value={{ projects, fetchProjects, createProject }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};