// /components/project/InviteMemberModal.tsx
"use client";

import { useState } from 'react';
import api from '../../lib/api';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';

interface InviteMemberModalProps {
  projectId: string;
}

export default function InviteMemberModal({ projectId }: InviteMemberModalProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleInvite = async () => {
    if (!email) return;
    setLoading(true);
    setMessage('');
    try {
      const { data } = await api.post(`/projects/${projectId}/invite`, { email });
      setMessage(data.message || 'Invitation sent successfully!');
      setEmail(''); // Clear input on success
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Failed to send invitation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      id="invite_member_modal"
      title="Invite a New Member"
      actionButton={
        <Button onClick={handleInvite} disabled={loading}>
          {loading ? <span className="loading loading-spinner"></span> : 'Send Invitation'}
        </Button>
      }
    >
      <p className="mb-4">Enter the email address of the person you want to invite to this project.</p>
      <Input
        label="Email Address"
        type="email"
        placeholder="name@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {message && <p className="text-sm mt-4">{message}</p>}
    </Modal>
  );
}