// /components/common/Avatar.tsx
interface User {
  name: string;
  avatarUrl?: string;
}

export default function Avatar({ user }: { user: User }) {
  return (
    <div className="avatar placeholder">
      <div className="bg-neutral text-neutral-content rounded-full w-10">
        {user.avatarUrl ? (
          <img src={user.avatarUrl} alt={user.name} />
        ) : (
          <span>{user.name.charAt(0).toUpperCase()}</span>
        )}
      </div>
    </div>
  );
}