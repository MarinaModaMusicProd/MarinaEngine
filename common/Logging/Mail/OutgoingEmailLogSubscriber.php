<?php

namespace Common\Logging\Mail;

use Exception;
use Illuminate\Events\Dispatcher;
use Illuminate\Mail\Events\MessageSending;
use Illuminate\Mail\Events\MessageSent;
use ZBateson\MailMimeParser\Message;

class OutgoingEmailLogSubscriber
{
    public function handleSending(MessageSending $event): void
    {
        // make sure any logic exceptions from symfony don't break the app
        try {
            $headers = $event->message->getPreparedHeaders();
        } catch (Exception $e) {
            return;
        }

        $parsedMessage = Message::from($event->message->toString(), true);

        foreach (
            $parsedMessage->getAllAttachmentParts()
            as $index => $attachment
        ) {
            // only store attachments that are less than 500KB
            if (strlen($attachment->getContent()) > 500000) {
                $parsedMessage->removeAttachmentPart($index);
            }
        }

        $logItem = OutgoingEmailLogItem::create([
            'message_id' => $headers->get('Message-ID')->getBodyAsString(),
            'from' => $headers->get('From')->getBodyAsString(),
            'to' => $headers->get('To')->getBodyAsString(),
            'subject' => $headers->get('Subject')->getBodyAsString(),
            'mime' => utf8_encode((string) $parsedMessage),
            'status' => 'not-sent',
        ]);

        $event->message
            ->getHeaders()
            ->addTextHeader('X-BE-LOG-ID', $logItem->id);
    }

    public function handleSent(MessageSent $event): void
    {
        $logId = $event->message
            ->getHeaders()
            ->get('X-BE-LOG-ID')
            ->getBodyAsString();

        OutgoingEmailLogItem::where('id', $logId)->update([
            'status' => 'sent',
            'message_id' => $event->sent
                ->getSymfonySentMessage()
                ->getMessageId(),
        ]);
    }

    public function subscribe(Dispatcher $events): array
    {
        return [
            MessageSending::class => 'handleSending',
            MessageSent::class => 'handleSent',
        ];
    }
}
