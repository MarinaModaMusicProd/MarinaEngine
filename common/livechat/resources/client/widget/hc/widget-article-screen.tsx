import React, {useEffect, useRef} from 'react';
import {useWidgetArticle} from '@livechat/widget/hc/use-widget-article';
import {highlightAllCode} from '@common/text-editor/highlight/highlight-code';
import {AnimatePresence, m} from 'framer-motion';
import {opacityAnimation} from '@ui/animation/opacity-animation';
import {useParams} from 'react-router-dom';
import {ArticleAttachments} from '@helpdesk/help-center/articles/article-attachments';
import {ArticlePageSkeleton} from '@helpdesk/help-center/articles/article-page/article-page-skeleton';
import {ArticlePageFeedback} from '@helpdesk/help-center/articles/article-page/article-page-feedback';
import {Article} from '@helpdesk/help-center/articles/article';
import {WidgetScreenHeader} from '@livechat/widget/widget-screen-header';
import {IconButton} from '@ui/buttons/icon-button';
import {FullscreenIcon} from '@ui/icons/material/Fullscreen';
import {Button} from '@ui/buttons/button';
import {Trans} from '@ui/i18n/trans';
import {ArrowBackIcon} from '@ui/icons/material/ArrowBack';
import {useWidgetStore, widgetStore} from '@livechat/widget/widget-store';
import {useLocalStorage} from '@ui/utils/hooks/local-storage';
import {FullscreenExitIcon} from '@ui/icons/material/FullscreenExit';
import clsx from 'clsx';
import {useNavigate} from '@common/ui/navigation/use-navigate';
import {ArticleLink} from '@helpdesk/help-center/articles/article-link';
import {OpenInNewIcon} from '@ui/icons/material/OpenInNew';

export function WidgetArticleScreen() {
  const {articleId} = useParams();
  const query = useWidgetArticle(articleId!);
  const navigate = useNavigate();
  const [articleSize, setArticleSize] = useLocalStorage<
    'maximized' | 'minimized'
  >('articleSize');

  useEffect(() => {
    widgetStore().setActiveSize(
      articleSize === 'maximized' ? 'articleMaximized' : 'open',
    );
    return () => {
      if (widgetStore().activeSize === 'articleMaximized') {
        widgetStore().setActiveSize('open');
      }
    };
  }, [articleSize]);

  return (
    <div className="flex h-full flex-col">
      <WidgetScreenHeader
        color="bg"
        start={
          <Button
            relative="path"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
          >
            <Trans message="Back" />
          </Button>
        }
        end={
          <IconButton
            size="sm"
            iconSize="md"
            onClick={() => {
              setArticleSize(
                articleSize === 'maximized' ? 'minimized' : 'maximized',
              );
            }}
          >
            {articleSize === 'minimized' ? (
              <FullscreenIcon />
            ) : (
              <FullscreenExitIcon />
            )}
          </IconButton>
        }
      />
      <div className="compact-scrollbar flex-auto overflow-y-auto px-20 pb-20 stable-scrollbar">
        <AnimatePresence initial={false} mode="wait">
          {query.data ? (
            <Article article={query.data.article} />
          ) : (
            <ArticlePageSkeleton />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

interface ArticleProps {
  article: Article;
}

function Article({article}: ArticleProps) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const activeSize = useWidgetStore(s => s.activeSize);
  useEffect(() => {
    if (bodyRef.current) {
      highlightAllCode(bodyRef.current);
    }
  }, []);
  return (
    <m.div {...opacityAnimation} key="widget-article-body">
      <article key="article">
        <h1 className="font-display text-slate-900 text-2xl tracking-tight">
          {article.title}
        </h1>
        <div
          className={clsx(
            'prose-pre:bg-slate-900 prose dark:prose-invert prose-headings:font-normal prose-a:font-normal prose-a:text-primary prose-pre:rounded-xl prose-pre:shadow-lg dark:prose-pre:shadow-none dark:prose-pre:ring-1 dark:prose-pre:ring-divider',
            activeSize !== 'articleMaximized' && 'text-sm',
          )}
        >
          <div
            ref={bodyRef}
            className="article-body whitespace-pre-wrap break-words leading-6"
            dangerouslySetInnerHTML={{__html: article.body}}
          />
        </div>
      </article>
      <ArticleAttachments article={article} key="attachments" />
      <div className="mt-20 flex justify-center border-t pt-20" key="feedback">
        <ArticlePageFeedback articleId={article.id} />
      </div>
      <div
        className="mt-30 flex items-center justify-center gap-4 text-sm text-muted"
        key="article-link"
      >
        <OpenInNewIcon size="sm" />
        <ArticleLink article={article} target="_blank">
          <Trans message="Open in help center" />
        </ArticleLink>
      </div>
    </m.div>
  );
}
