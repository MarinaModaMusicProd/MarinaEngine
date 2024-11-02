import {Trans} from '@ui/i18n/trans';
import {IllustratedMessage} from '@ui/images/illustrated-message';
import React, {ReactElement} from 'react';

interface MediaPageNoResultsMessage {
  description: ReactElement;
  searchQuery?: string;
  className?: string;
}
export function MediaPageNoResultsMessage({
  description,
  searchQuery,
  className,
}: MediaPageNoResultsMessage) {
  if (searchQuery) {
    return (
      <IllustratedMessage
        className={className}
        title={<Trans message="No results found" />}
        description={
          <Trans message="Try another search query or different filters" />
        }
      />
    );
  }
  return (
    <IllustratedMessage
      className={className}
      title={<Trans message="Nothing to display" />}
      description={description}
    />
  );
}
