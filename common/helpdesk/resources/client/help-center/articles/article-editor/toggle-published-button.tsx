import {Article} from '@helpdesk/help-center/articles/article';
import {Button} from '@ui/buttons/button';
import {Trans} from '@ui/i18n/trans';
import React from 'react';
import {useUpdateArticle} from '@helpdesk/help-center/articles/requests/use-update-article';

interface Props {
  article: Article;
}
export function TogglePublishedButton({article}: Props) {
  const updateArticle = useUpdateArticle();
  return (
    <Button
      variant="link"
      color="primary"
      disabled={updateArticle.isPending}
      onClick={() => {
        updateArticle.mutate({
          id: article.id,
          draft: !article.draft,
        });
      }}
    >
      {article.draft ? (
        <Trans message="Publish" />
      ) : (
        <Trans message="Unpublish" />
      )}
    </Button>
  );
}
