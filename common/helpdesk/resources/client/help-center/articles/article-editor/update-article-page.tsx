import React, {Fragment, useRef} from 'react';
import {FormProvider, useForm} from 'react-hook-form';
import {Trans} from '@ui/i18n/trans';
import {Article} from '@helpdesk/help-center/articles/article';
import {Editor} from '@tiptap/react';
import clsx from 'clsx';
import {toast} from '@ui/toast/toast';
import {message} from '@ui/i18n/message';
import {useTrans} from '@ui/i18n/use-trans';
import {Skeleton} from '@ui/skeleton/skeleton';
import {PageStatus} from '@common/http/page-status';
import {PageMetaTags} from '@common/http/page-meta-tags';
import {Button} from '@ui/buttons/button';
import {Link} from 'react-router-dom';
import {OpenInNewIcon} from '@ui/icons/material/OpenInNew';
import {getArticleLink} from '@helpdesk/help-center/articles/article-link';
import {useArticle} from '@helpdesk/help-center/articles/requests/use-article';
import {
  ArticleEditorLayout,
  HcArticleBodyEditor,
} from '@helpdesk/help-center/articles/article-editor/hc-article-body-editor';
import {
  UpdateArticlePayload,
  useUpdateArticle,
} from '@helpdesk/help-center/articles/requests/use-update-article';
import {ArticleEditorAside} from '@helpdesk/help-center/articles/article-editor/article-editor-aside';
import {TogglePublishedButton} from '@helpdesk/help-center/articles/article-editor/toggle-published-button';

export function UpdateArticlePage() {
  const query = useArticle('updateArticle');

  return query.data ? (
    <Fragment>
      <PageMetaTags query={query} />
      <PageContent article={query.data.article} />
    </Fragment>
  ) : (
    <ArticleEditorLayout aside={<Skeleton variant="rect" size="w-full h-46" />}>
      <PageStatus query={query} />
    </ArticleEditorLayout>
  );
}

interface PageContentProps {
  article: Article;
}
function PageContent({article}: PageContentProps) {
  const {trans} = useTrans();
  const editor = useRef<Editor>();
  const form = useForm<UpdateArticlePayload>({
    defaultValues: {
      title: article.title,
      slug: article.slug,
      visible_to_role: article.visible_to_role,
      author_id: article.author_id,
      managed_by_role: article.managed_by_role,
      sections: article.sections?.map(s => s.id),
      tags: article.tags?.map(t => ({
        name: t.name,
        id: t.id,
        description: t.display_name,
      })),
      attachments: article.attachments,
    },
  });

  const updateArticle = useUpdateArticle(form);
  const handleSave = () => {
    if (!editor.current) return null;
    updateArticle.mutate(
      {
        ...form.getValues(),
        body: editor.current.getHTML(),
        id: article.id,
      },
      {
        onSuccess: () => {
          toast(trans(message('Article updated')));
        },
      },
    );
  };

  return (
    <FormProvider {...form}>
      <ArticleEditorLayout
        aside={
          <ArticleEditorAside
            onSave={() => handleSave()}
            isSaving={updateArticle.isPending}
          >
            <PublicationStatus article={article} />
          </ArticleEditorAside>
        }
      >
        <HcArticleBodyEditor
          initialContent={article.body}
          onLoad={e => (editor.current = e)}
        />
      </ArticleEditorLayout>
    </FormProvider>
  );
}

interface PublicationStatusProps {
  article: Article;
}
function PublicationStatus({article}: PublicationStatusProps) {
  return (
    <div className="mb-28 border-b pb-14 text-sm">
      <div className="mb-8 font-semibold">
        <Trans message="Publication status" />
      </div>
      <div className="flex items-center">
        <div className="mr-10 flex items-center gap-8 border-r pr-10">
          <div
            className={clsx(
              'h-12 w-12 rounded-full border',
              article.draft
                ? 'border-divider'
                : 'border-transparent bg-positive',
            )}
          />
          {article.draft ? (
            <Trans message="Draft" />
          ) : (
            <Trans message="Published" />
          )}
        </div>
        <TogglePublishedButton article={article} />
      </div>
      <Button
        variant="link"
        color="primary"
        elementType={Link}
        to={getArticleLink(article, {section: article.sections?.[0]})}
        endIcon={<OpenInNewIcon />}
        target="_blank"
        size="xs"
        className="mt-18"
      >
        <Trans message="Preview in Help Center" />
      </Button>
    </div>
  );
}
