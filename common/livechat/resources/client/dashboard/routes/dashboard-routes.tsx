import {Navigate, RouteObject} from 'react-router-dom';
import {authGuard} from '@common/auth/guards/auth-route';

export const lazyDashboardRoute = async (
  cmp: keyof typeof import('@livechat/dashboard/routes/dashboard-routes.lazy'),
) => {
  const exports = await import(
    '@livechat/dashboard/routes/dashboard-routes.lazy'
  );
  return {
    Component: exports[cmp],
  };
};

export const dashboardRoutes: RouteObject[] = [
  {
    path: '/dashboard',
    loader: () => authGuard({permission: 'conversations.view'}),
    lazy: () => lazyDashboardRoute('LivechatDashboardLayout'),
    children: [
      // chats
      {
        path: 'chats',
        lazy: () => lazyDashboardRoute('ChatPage'),
      },
      {
        path: 'chats/:chatId',
        lazy: () => lazyDashboardRoute('ChatPage'),
      },

      // archive
      {
        path: 'archive',
        lazy: () => lazyDashboardRoute('ArchivePage'),
      },
      {
        path: 'archive/:chatId',
        lazy: () => lazyDashboardRoute('ArchivePage'),
      },

      // visitors
      {
        path: 'traffic',
        lazy: () => lazyDashboardRoute('VisitorsIndexPage'),
      },

      // groups
      {
        path: 'groups',
        lazy: () => lazyDashboardRoute('GroupsIndexPage'),
      },
      {
        path: 'groups/new',
        lazy: () => lazyDashboardRoute('CreateGroupPage'),
      },
      {
        path: 'groups/:groupId/edit',
        lazy: () => lazyDashboardRoute('EditGroupPage'),
      },

      // agents
      {
        path: 'agents',
        lazy: () => lazyDashboardRoute('AgentsIndexPage'),
      },
      {
        path: 'invited-agents',
        lazy: () => lazyDashboardRoute('AgentInvitesIndexPage'),
      },
      {
        path: 'agents/:agentId',
        lazy: () => lazyDashboardRoute('EditAgentPage'),
        children: [
          {
            index: true,
            element: <Navigate to="details" replace />,
          },
          {
            path: 'details',
            lazy: () => lazyDashboardRoute('AgentDetailsTab'),
          },
          {
            path: 'permissions',
            lazy: () => lazyDashboardRoute('UpdateUserPermissionsTab'),
          },
          {
            path: 'security',
            lazy: () => lazyDashboardRoute('UpdateUserSecurityTab'),
          },
          {
            path: 'date',
            lazy: () => lazyDashboardRoute('UpdateUserDatetimeTab'),
          },
          {
            path: 'api',
            lazy: () => lazyDashboardRoute('UpdateUserApiTab'),
          },
        ],
      },

      // canned replies
      {
        path: 'saved-replies',
        lazy: () => lazyDashboardRoute('CannedRepliesDatatablePage'),
      },
      {
        path: 'saved-replies/new',
        lazy: () => lazyDashboardRoute('CreateCannedReplyPage'),
      },

      // help center
      {
        path: 'hc',
        element: <Navigate to="hc/arrange" replace />,
      },
      {
        path: 'hc/arrange',
        lazy: () => lazyDashboardRoute('HcCategoryManager'),
      },
      {
        path: 'hc/arrange/categories/:categoryId',
        lazy: () => lazyDashboardRoute('HcCategoryManager'),
      },
      {
        path: 'hc/arrange/sections/:sectionId',
        lazy: () => lazyDashboardRoute('HcArticleManager'),
      },
      {
        path: 'articles',
        lazy: () => lazyDashboardRoute('ArticleDatatablePage'),
      },
      {
        path: 'articles/new',
        lazy: () => lazyDashboardRoute('CreateArticlePage'),
      },
      {
        path: 'articles/:articleId/edit',
        lazy: () => lazyDashboardRoute('UpdateArticlePage'),
      },

      // edit article
      {
        path: 'hc/arrange/sections/:sectionId/articles/:articleId/edit',
        lazy: () => lazyDashboardRoute('UpdateArticlePage'),
      },
      {
        path: 'hc/arrange/categories/:categoryId/articles/:articleId/edit',
        lazy: () => lazyDashboardRoute('UpdateArticlePage'),
      },
      {
        path: 'hc/articles/:articleId/edit',
        lazy: () => lazyDashboardRoute('UpdateArticlePage'),
      },

      // create article
      {
        path: 'hc/arrange/sections/:sectionId/articles/new',
        lazy: () => lazyDashboardRoute('CreateArticlePage'),
      },
      {
        path: 'hc/arrange/categories/:categoryId/articles/new',
        lazy: () => lazyDashboardRoute('CreateArticlePage'),
      },
      {
        path: 'hc/articles/new',
        lazy: () => lazyDashboardRoute('CreateArticlePage'),
      },
    ],
  },
];
