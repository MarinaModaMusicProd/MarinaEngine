import {useAuth} from '@common/auth/use-auth';
import {useMemo} from 'react';

export function useAgentPermissions(agentId: number) {
  const {user, hasPermission} = useAuth();
  return useMemo(() => {
    return {
      canEditAgent: user?.id === agentId || hasPermission('users.update'),
      canDeleteAgent: user?.id !== agentId && hasPermission('users.delete'),
    };
  }, [agentId, hasPermission, user?.id]);
}
