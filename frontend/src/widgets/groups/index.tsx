import { GroupGrid, GroupListSkeleton, useGroupStore } from '@entities/group';
import { cn } from '@shared/utils';
import { HTMLAttributes } from 'react';

export const Groups = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => {
  const [groups, isLoading] = useGroupStore((state) => [state.groups, state.isLoading]);

  return (
    <div
      className={cn(
        'flex min-h-0 flex-col gap-5 rounded-2xl border bg-card p-5 md:gap-10 md:p-10',
        className,
      )}
      {...props}
    >
      <h2 className='text-2xl text-foreground'>Groups</h2>
      <div className='min-h-0 flex-1 overflow-auto'>
        {isLoading ? (
          <GroupListSkeleton />
        ) : (
          <div className='flex flex-col gap-4'>
            {groups.length === 0 && (
              <p className='text-center text-muted-foreground'>
                No groups yet. Create one to start building your vocabulary.
              </p>
            )}
            <GroupGrid />
          </div>
        )}
      </div>
    </div>
  );
};
