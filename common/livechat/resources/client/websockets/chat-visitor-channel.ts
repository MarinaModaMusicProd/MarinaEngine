export const chatVisitorChannel = {
  name: (visitorId: string | number) => `visitor.${visitorId}`,
  events: {
    visits: {
      created: '.visit.created',
    },
    messages: {
      created: '.message.created',
    },
  },
};
