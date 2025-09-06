// /components/task/CreateTaskModal.tsx
"use client";

import { useState } from 'react';
import api from '@/lib/api';
import Modal from '@/components/common/Modal';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';

interface CreateTaskModalProps {
  projectId: string;
  columnStatus: 'To-Do' | 'In Progress' | 'Done';
  onTaskCreated: () => void; // Function to refresh tasks
}

export default function CreateTaskModal({ projectId, columnStatus, onTaskCreated }: CreateTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!title) {
        setError('Title is required.');
        return;
    }
    setLoading(true);
    setError('');
    try {
      await api.post('/tasks', {
        title,
        description,
        projectId,
        status: columnStatus
      });
      // The socket event will update the UI, so we just close the modal.
      const modal = document.getElementById(`create_task_modal_${columnStatus}`) as HTMLDialogElement;
      modal?.close();
      setTitle('');
      setDescription('');
    } catch (err) {
      setError('Failed to create task.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      id={`create_task_modal_${columnStatus}`}
      title={`Add New Task to "${columnStatus}"`}
      actionButton={
        <Button onClick={handleSubmit} loading={loading}>
          Create Task
        </Button>
      }
    >
      <div className="space-y-4">
        <Input
          label="Task Title"
          type="text"
          placeholder="e.g., Design the new logo"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <div className="form-control">
          <label className="label"><span className="label-text">Description</span></label>
          <textarea
            className="textarea textarea-bordered h-24"
            placeholder="Add more details..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        {error && <p className="text-sm text-error">{error}</p>}
      </div>
    </Modal>
  );
}