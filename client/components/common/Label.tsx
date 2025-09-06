// /components/common/Label.tsx
import { LabelHTMLAttributes, ReactNode } from 'react';

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  children: ReactNode;
}

export default function Label({ children, ...props }: LabelProps) {
  return (
    <label className="label" {...props}>
      <span className="label-text">{children}</span>
    </label>
  );
}