// /components/common/Modal.tsx
import { ReactNode } from 'react';

interface ModalProps {
  id: string;
  title: string;
  children: ReactNode;
  actionButton: ReactNode;
}

export default function Modal({ id, title, children, actionButton }: ModalProps) {
  return (
    <dialog id={id} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">{title}</h3>
        <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        <div className="py-4">
            {children}
        </div>
        <div className="modal-action">
            {actionButton}
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}