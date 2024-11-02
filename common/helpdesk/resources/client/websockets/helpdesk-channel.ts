export const helpdeskChannel = {
  name: 'helpdesk',
  events: {
    conversations: {
      created: '.conversations.created',
      agentChanged: '.conversations.agentChanged',
      groupChanged: '.conversations.groupChanged',
      statusChanged: '.conversations.statusChanged',
      newMessage: '.conversations.newMessage',
    },
    agents: {
      updated: '.agents.updated',
    },
    visitors: {
      created: '.visitors.created',
      visitCreated: '.visitors.visitCreated',
    },
  },
  // events fired by laravel are prefix with a dot, so we need to remove it
  eventMatchesAny: (e: string, events: string[]): boolean => {
    return events.some(
      event => e === event || e.replace(/^\./, '') === event.replace(/^\./, ''),
    );
  },
} as const;
