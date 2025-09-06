// /components/project/CreateProjectModal.tsx
"use client";

import { useState } from 'react';
import { useProjects } from '../../contexts/ProjectContext';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';

export default function CreateProjectModal() {
  const { createProject } = useProjects();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      await createProject(name, description);
      // Close the modal upon success
      const modal = document.getElementById('create_project_modal') as HTMLDialogElement;
      modal?.close();
      setName('');
      setDescription('');
    } catch (err) {
      setError('Failed to create project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      id="create_project_modal"
      title="Create a New Project"
      actionButton={
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? <span className="loading loading-spinner"></span> : 'Create Project'}
        </Button>
      }
    >
      <div className="space-y-4">
        <Input
          label="Project Name"
          type="text"
          placeholder="e.g., Q4 Marketing Campaign"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          label="Description (Optional)"
          type="text"
          placeholder="A short description of the project"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {error && <p className="text-sm text-error">{error}</p>}
      </div>
    </Modal>
  );
}