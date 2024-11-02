import {useInfiniteData} from '@common/ui/infinite-scroll/use-infinite-data';
import {useRequiredParams} from '@common/ui/navigation/use-required-params';
import {Chat} from '@livechat/widget/chat/chat';

export function useAgentConversations() {
  const {agentId} = useRequiredParams(['agentId']);
  return useInfiniteData<Chat>({
    endpoint: `lc/agents/${agentId}/conversations`,
    queryKey: ['helpdesk', 'agents', agentId, 'conversations'],
    preserveQueryKey: true,
    paginate: 'simple',
  });
}
