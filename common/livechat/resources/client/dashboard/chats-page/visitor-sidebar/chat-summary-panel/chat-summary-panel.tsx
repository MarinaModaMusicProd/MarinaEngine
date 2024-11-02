import {useGenerateChatSummary} from '@livechat/dashboard/chats-page/visitor-sidebar/chat-summary-panel/use-generate-chat-summary';
import {useRequiredParams} from '@common/ui/navigation/use-required-params';
import {Button} from '@ui/buttons/button';
import {Trans} from '@ui/i18n/trans';
import {WandSparkleIcon} from '@common/ai/wand-sparkle-icon';
import React from 'react';
import {
  setConversationSummaryQueryData,
  useConversationSummary,
} from '@livechat/dashboard/chats-page/visitor-sidebar/chat-summary-panel/use-conversation-summary';
import {ProgressCircle} from '@ui/progress/progress-circle';
import {ChatSummary} from '@livechat/widget/chat/chat';
import {ChipList} from '@ui/forms/input-field/chip-field/chip-list';
import {Chip} from '@ui/forms/input-field/chip-field/chip';
import {FormattedDate} from '@ui/i18n/formatted-date';
import {useDeleteChatSummary} from '@livechat/dashboard/chats-page/visitor-sidebar/chat-summary-panel/use-delete-chat-summary';

interface Props {
  initialData?: ChatSummary | null;
}
export function ChatSummaryPanel({initialData}: Props) {
  const {chatId} = useRequiredParams(['chatId']);
  const generateSummary = useGenerateChatSummary();
  const deleteSummary = useDeleteChatSummary();
  const {data} = useConversationSummary(chatId, initialData);

  return (
    <div>
      {data?.summary ? <SummaryPanel summary={data.summary} /> : null}
      {!data?.summary ? (
        <div className="mb-10 text-xs text-muted">
          <Trans message="Use AI to generate a concise chat summary, keywords and overall customer sentiment." />
        </div>
      ) : null}
      <div className="flex items-center gap-8">
        <Button
          variant="flat"
          color="primary"
          size="xs"
          startIcon={
            generateSummary.isPending ? (
              <ProgressCircle isIndeterminate size="xs" />
            ) : (
              <WandSparkleIcon />
            )
          }
          disabled={generateSummary.isPending}
          onClick={() => {
            generateSummary.mutate(
              {chatId},
              {
                onSuccess: r => {
                  setConversationSummaryQueryData(chatId, r.summary);
                },
              },
            );
          }}
        >
          <Trans message="Generate summary" />
        </Button>
        {data?.summary ? (
          <Button
            variant="outline"
            size="xs"
            disabled={deleteSummary.isPending}
            onClick={() => {
              deleteSummary.mutate(
                {chatId},
                {
                  onSuccess: () => {
                    setConversationSummaryQueryData(chatId, null);
                  },
                },
              );
            }}
          >
            <Trans message="Remove" />
          </Button>
        ) : null}
      </div>
    </div>
  );
}

interface SummaryPanelProps {
  summary: ChatSummary;
}
function SummaryPanel({summary}: SummaryPanelProps) {
  return (
    <div className="mb-24">
      <ul className="list-inside list-disc text-sm">
        {summary.content.summary.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
      <ChipList size="sm" className="mt-12">
        {summary.content.keywords.map((keyword, index) => (
          <Chip key={index}>{keyword}</Chip>
        ))}
      </ChipList>
      <div className="mt-12 text-xs text-muted">
        <Trans message="Customer sentiment" />: {summary.content.sentiment}
      </div>
      <div className="mt-6 text-xs text-muted">
        <Trans
          message="Generated on :date by :name"
          values={{
            date: <FormattedDate date={summary.created_at} preset="long" />,
            name: summary.user?.name || 'agent',
          }}
        />
      </div>
    </div>
  );
}
