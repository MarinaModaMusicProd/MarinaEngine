import {useTrans} from '@ui/i18n/use-trans';
import {m} from 'framer-motion';
import {TextField} from '@ui/forms/input-field/text-field/text-field';
import {SearchIcon} from '@ui/icons/material/Search';
import {ProgressCircle} from '@ui/progress/progress-circle';
import {Trans} from '@ui/i18n/trans';
import React, {ReactElement} from 'react';
import {WidgetScreenHeader} from '@livechat/widget/widget-screen-header';
import {Link, Outlet, useParams, useSearchParams} from 'react-router-dom';
import {IconButton} from '@ui/buttons/icon-button';
import {KeyboardArrowLeftIcon} from '@ui/icons/material/KeyboardArrowLeft';
import {useSearchArticles} from '@helpdesk/help-center/search/use-search-articles';
import {Article} from '@helpdesk/help-center/articles/article';
import {ArticleListItem} from '@livechat/widget/hc/section-screen';
import {IllustratedMessage} from '@ui/images/illustrated-message';
import {SvgImage} from '@ui/images/svg-image';
import searchImage from '@helpdesk/help-center/search/search.svg';
import {CloseIcon} from '@ui/icons/material/Close';
import {opacityAnimation} from '@ui/animation/opacity-animation';
import {useIsDarkMode} from '@ui/themes/use-is-dark-mode';

export function HelpScreen() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTerm = searchParams.get('query') || '';
  const setSearchTerm = (value: string) => {
    setSearchParams({query: value}, {replace: true});
  };
  const query = useSearchArticles(searchTerm);
  const {categoryId, sectionId} = useParams();

  let backUri: string | undefined;
  if (sectionId) {
    backUri = `/hc/categories/${categoryId}`;
  } else if (categoryId) {
    backUri = '/hc';
  } else if (searchParams.get('prevRoute') === 'home') {
    backUri = '/';
  }

  return (
    <m.div
      key="help-screen"
      {...opacityAnimation}
      className="flex min-h-0 flex-auto flex-col"
    >
      <WidgetScreenHeader
        label={<Trans message="Help" />}
        start={
          backUri && (
            <IconButton
              elementType={Link}
              to={backUri}
              onClick={() => {
                setSearchTerm('');
              }}
            >
              <KeyboardArrowLeftIcon />
            </IconButton>
          )
        }
      >
        <SearchField
          value={searchTerm}
          onChange={setSearchTerm}
          isLoading={query.isFetching}
        />
      </WidgetScreenHeader>
      <div className="compact-scrollbar flex-auto overflow-auto">
        {query.status === 'pending' ? (
          <Outlet />
        ) : (
          <SearchResults results={query.data?.pagination.data} />
        )}
      </div>
    </m.div>
  );
}

interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  isLoading: boolean;
}
function SearchField({value, onChange, isLoading}: SearchFieldProps) {
  const {trans} = useTrans();
  const isDarkMode = useIsDarkMode();

  let icon: ReactElement;
  if (isLoading) {
    icon = <ProgressCircle isIndeterminate size="sm" />;
  } else if (value) {
    icon = (
      <IconButton onClick={() => onChange('')}>
        <CloseIcon />
      </IconButton>
    );
  } else {
    icon = <SearchIcon />;
  }

  return (
    <TextField
      autoFocus
      value={value}
      onChange={e => onChange(e.target.value)}
      size="sm"
      placeholder={trans({message: 'Search for answers'})}
      background={isDarkMode ? 'bg-alt' : 'bg'}
      endAdornment={icon}
    />
  );
}

interface SearchResultsProps {
  results: Article[] | undefined;
}
function SearchResults({results}: SearchResultsProps) {
  if (!results?.length) {
    return (
      <IllustratedMessage
        className="mt-48"
        size="sm"
        image={<SvgImage src={searchImage} />}
        title={<Trans message="No articles match your search query" />}
      />
    );
  }
  return (
    <div>
      {results?.map(result => (
        <ArticleListItem key={result.id} article={result} />
      ))}
    </div>
  );
}
