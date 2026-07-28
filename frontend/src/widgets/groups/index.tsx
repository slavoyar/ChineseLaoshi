import { GroupGrid, GroupListSkeleton, useGroupStore } from '@entities/group';
import { AddGroupDialog } from '@features/add-group';
import { useRequireAuth } from '@shared/hooks';
import { Button, EmptyState } from '@shared/ui';
import { cn } from '@shared/utils';
import { Plus } from 'lucide-react';
import { HTMLAttributes, useState } from 'react';

export const Groups = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => {
  const [groups, isLoading] = useGroupStore((state) => [state.groups, state.isLoading]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const { gateAction } = useRequireAuth();

  const isEmpty = !isLoading && (groups?.length ?? 0) === 0;

  return (
    <div
      className={cn(
        'flex min-h-0 flex-col gap-5 rounded-2xl border bg-card p-5 md:gap-10 md:p-10',
        className
      )}
      {...props}
    >
      <h2 className='text-2xl text-foreground'>Groups</h2>
      <div className='min-h-0 flex-1 overflow-auto'>
        {isLoading ? (
          <GroupListSkeleton />
        ) : isEmpty ? (
          <>
            <EmptyState
              size='compact'
              title='No groups yet'
              description='Everything loaded fine — you just have not created a group. Add one to start building vocabulary.'
              action={
                <Button onClick={() => gateAction(() => setIsAddOpen(true))}>
                  <Plus aria-hidden='true' />
                  Create group
                </Button>
              }
            />
            <AddGroupDialog open={isAddOpen} onOpenChange={setIsAddOpen} />
          </>
        ) : (
          <GroupGrid />
        )}
      </div>
    </div>
  );
};
