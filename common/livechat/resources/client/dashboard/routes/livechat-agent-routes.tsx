import {Navigate, RouteObject} from 'react-router-dom';
import {authGuard} from '@common/auth/guards/auth-route';

export const lazyLivechatAgentRoute = async (
  cmp: keyof typeof import('@livechat/dashboard/routes/livechat-agent-routes.lazy'),
) => {
  const exports = await import(
    '@livechat/dashboard/routes/livechat-agent-routes.lazy'
  );
  return {
    Component: exports[cmp],
  };
};

export const livechatAgentRoutes: RouteObject[] = [
  {
    path: '/agent',
    loader: () => authGuard({permission: 'conversations.view'}),
    lazy: () => lazyLivechatAgentRoute('LivechatDashboardLayout'),
    children: [
      // chats
      {
        path: 'chats',
        lazy: () => lazyLivechatAgentRoute('ChatPage'),
      },
      {
        path: 'chats/:chatId',
        lazy: () => lazyLivechatAgentRoute('ChatPage'),
      },

      // archive
      {
        path: 'archive',
        lazy: () => lazyLivechatAgentRoute('ArchivePage'),
      },
      {
        path: 'archive/:chatId',
        lazy: () => lazyLivechatAgentRoute('ArchivePage'),
      },

      // visitors
      {
        path: 'traffic',
        lazy: () => lazyLivechatAgentRoute('VisitorsIndexPage'),
      },

      // groups
      {
        path: 'groups',
        lazy: () => lazyLivechatAgentRoute('GroupsIndexPage'),
      },
      {
        path: 'groups/new',
        lazy: () => lazyLivechatAgentRoute('CreateGroupPage'),
      },
      {
        path: 'groups/:groupId/edit',
        lazy: () => lazyLivechatAgentRoute('EditGroupPage'),
      },

      // agents
      {
        path: 'agents',
        lazy: () => lazyLivechatAgentRoute('AgentsIndexPage'),
      },
      {
        path: 'invited-agents',
        lazy: () => lazyLivechatAgentRoute('AgentInvitesIndexPage'),
      },
      {
        path: 'agents/:agentId',
        lazy: () => lazyLivechatAgentRoute('EditAgentPage'),
        children: [
          {
            index: true,
            element: <Navigate to="details" replace />,
          },
          {
            path: 'details',
            lazy: () => lazyLivechatAgentRoute('AgentDetailsTab'),
          },
          {
            path: 'permissions',
            lazy: () => lazyLivechatAgentRoute('UpdateUserPermissionsTab'),
          },
          {
            path: 'conversations',
            lazy: () => lazyLivechatAgentRoute('AgentConversationsTab'),
          },
          {
            path: 'security',
            lazy: () => lazyLivechatAgentRoute('UpdateUserSecurityTab'),
          },
          {
            path: 'date',
            lazy: () => lazyLivechatAgentRoute('UpdateUserDatetimeTab'),
          },
          {
            path: 'api',
            lazy: () => lazyLivechatAgentRoute('UpdateUserApiTab'),
          },
        ],
      },

      // canned replies
      {
        path: 'saved-replies',
        lazy: () => lazyLivechatAgentRoute('CannedRepliesDatatablePage'),
      },
      {
        path: 'saved-replies/new',
        lazy: () => lazyLivechatAgentRoute('CreateCannedReplyPage'),
      },
      {
        path: 'saved-replies/:replyId/update',
        lazy: () => lazyLivechatAgentRoute('UpdateCannedReplyPage'),
      },

      // help center
      {
        path: 'hc',
        element: <Navigate to="hc/arrange" replace />,
      },
      {
        path: 'hc/arrange',
        lazy: () => lazyLivechatAgentRoute('HcCategoryManager'),
      },
      {
        path: 'hc/arrange/categories/:categoryId',
        lazy: () => lazyLivechatAgentRoute('HcCategoryManager'),
      },
      {
        path: 'hc/arrange/sections/:sectionId',
        lazy: () => lazyLivechatAgentRoute('HcArticleManager'),
      },
      {
        path: 'articles',
        lazy: () => lazyLivechatAgentRoute('ArticleDatatablePage'),
      },
      {
        path: 'articles/new',
        lazy: () => lazyLivechatAgentRoute('CreateArticlePage'),
      },
      {
        path: 'articles/:articleId/edit',
        lazy: () => lazyLivechatAgentRoute('UpdateArticlePage'),
      },

      // edit article
      {
        path: 'hc/arrange/sections/:sectionId/articles/:articleId/edit',
        lazy: () => lazyLivechatAgentRoute('UpdateArticlePage'),
      },
      {
        path: 'hc/arrange/categories/:categoryId/articles/:articleId/edit',
        lazy: () => lazyLivechatAgentRoute('UpdateArticlePage'),
      },
      {
        path: 'hc/articles/:articleId/edit',
        lazy: () => lazyLivechatAgentRoute('UpdateArticlePage'),
      },

      // create article
      {
        path: 'hc/arrange/sections/:sectionId/articles/new',
        lazy: () => lazyLivechatAgentRoute('CreateArticlePage'),
      },
      {
        path: 'hc/arrange/categories/:categoryId/articles/new',
        lazy: () => lazyLivechatAgentRoute('CreateArticlePage'),
      },
      {
        path: 'hc/articles/new',
        lazy: () => lazyLivechatAgentRoute('CreateArticlePage'),
      },
    ],
  },
];
