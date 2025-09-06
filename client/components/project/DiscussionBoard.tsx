"use client";
import { useState, useEffect, useRef } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import api from '@/lib/api';
import socket from '@/lib/socket';
import { useAuth } from '@/hooks/useAuth';
import Avatar from '@/components/common/Avatar';
import Button from '@/components/common/Button';

interface User { _id: string; name: string; avatarUrl?: string; }
interface Message { _id: string; text: string; sender: User; projectId: string; }

export default function DiscussionBoard({ projectId }: { projectId: string }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    api.get(`/messages/${projectId}`).then(res => setMessages(res.data.messages));

    const handleNewMessage = (message: Message) => {
        if (message.projectId === projectId) {
            setMessages(prev => [...prev, message]);
        }
    };
    socket?.on('message:created', handleNewMessage);
    return () => { socket?.off('message:created', handleNewMessage); };
  }, [projectId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    const tempMessage = newMessage;
    setNewMessage('');
    try {
      await api.post('/messages', { text: tempMessage, projectId });
    } catch (error) {
      setNewMessage(tempMessage);
    }
  };

  return (
    <div className="card bg-base-200 h-full flex flex-col">
      <div className="card-body p-4 flex-1 overflow-y-auto">
        {messages.map((msg) => (
          <div key={msg._id} className={`chat ${msg.sender._id === user?._id ? 'chat-end' : 'chat-start'}`}>
            <div className="chat-image avatar"><Avatar user={msg.sender} size="sm" /></div>
            <div className="chat-header text-xs opacity-50">{msg.sender.name}</div>
            <div className={`chat-bubble ${msg.sender._id === user?._id ? 'chat-bubble-primary' : ''}`}>{msg.text}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="p-4 border-t border-base-300 flex gap-2">
        <input type="text" placeholder="Type a message..." className="input input-bordered w-full" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
        <Button type="submit" variant="primary"><PaperAirplaneIcon className="w-5 h-5" /></Button>
      </form>
    </div>
  );
}