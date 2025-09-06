// /components/layout/Sidebar.tsx (Updated)
import Link from 'next/link';
import { HomeIcon, BriefcaseIcon } from '@heroicons/react/24/outline';

export default function Sidebar() {
  return (
    <aside className="w-64 flex flex-col bg-base-100 text-base-content shadow-lg">
      <div className="p-4 border-b border-base-300">
        <Link href="/dashboard" className="text-2xl font-bold flex items-center gap-2">
          <BriefcaseIcon className="w-7 h-7" />
          SynergySphere
        </Link>
      </div>
      <ul className="menu p-4 flex-1">
        <li>
          <Link href="/dashboard">
            <HomeIcon className="w-5 h-5" />
            Dashboard
          </Link>
        </li>
        {/* Future links like "My Tasks" or "Settings" can go here */}
      </ul>
    </aside>
  );
}