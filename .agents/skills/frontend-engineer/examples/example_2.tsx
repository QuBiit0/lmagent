// components/features/user/user-card.tsx

import { memo } from 'react';
import type { User } from '@/types';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui/avatar';

interface UserCardProps {
  user: User;
  variant?: 'default' | 'compact';
  className?: string;
  onSelect?: (user: User) => void;
}

export const UserCard = memo(function UserCard({
  user,
  variant = 'default',
  className,
  onSelect,
}: UserCardProps) {
  const handleClick = () => {
    onSelect?.(user);
  };

  return (
    <article
      className={cn(
        'rounded-lg border bg-card p-4 transition-shadow hover:shadow-md',
        variant === 'compact' && 'p-2',
        className
      )}
      onClick={handleClick}
      role={onSelect ? 'button' : undefined}
      tabIndex={onSelect ? 0 : undefined}
    >
      <div className="flex items-center gap-3">
        <Avatar src={user.avatarUrl} alt={user.name} />
        <div>
          <h3 className="font-medium">{user.name}</h3>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      </div>
    </article>
  );
});