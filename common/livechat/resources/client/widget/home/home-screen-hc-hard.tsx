import {useArticles} from '@livechat/widget/hc/use-articles';
import {HomeScreenCardLayout} from '@livechat/widget/home/home-screen-card-layout';
import {Button} from '@ui/buttons/button';
import {SearchIcon} from '@ui/icons/material/Search';
import {Trans} from '@ui/i18n/trans';
import {ButtonBase} from '@ui/buttons/button-base';
import {Link} from 'react-router-dom';
import {getArticleLink} from '@helpdesk/help-center/articles/article-link';
import {KeyboardArrowRightIcon} from '@ui/icons/material/KeyboardArrowRight';
import {AnimatePresence, m} from 'framer-motion';
import {Skeleton} from '@ui/skeleton/skeleton';
import {opacityAnimation} from '@ui/animation/opacity-animation';
import {useSettings} from '@ui/settings/use-settings';
import clsx from 'clsx';

export function HomeScreenHcHard() {
  const {chatWidget} = useSettings();
  const showArticles = chatWidget?.hideHomeArticles ?? false;
  const query = useArticles({perPage: 4});
  return (
    <HomeScreenCardLayout className={clsx(showArticles && 'p-8')}>
      <Button
        elementType={Link}
        to="/hc?prevRoute=home"
        justify="justify-between"
        variant="flat"
        color={showArticles ? 'chip' : 'white'}
        endIcon={<SearchIcon />}
        className={clsx('w-full', showArticles ? 'min-h-40' : 'min-h-54')}
      >
        <Trans message="Search for help" />
      </Button>
      {showArticles && (
        <div className="mt-10 text-sm">
          <AnimatePresence initial={false} mode="wait">
            {!query.data ? (
              <Skeletons />
            ) : (
              <m.div key="article-list" {...opacityAnimation}>
                {query.data?.pagination.data.map(article => (
                  <ButtonBase
                    key={article.id}
                    justify="justify-between"
                    className="w-full rounded-panel px-12 py-8 hover:bg-hover"
                    elementType={Link}
                    to={getArticleLink(article)}
                  >
                    {article.title}
                    <KeyboardArrowRightIcon size="sm" />
                  </ButtonBase>
                ))}
              </m.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </HomeScreenCardLayout>
  );
}

export function Skeletons() {
  return (
    <m.div key="article-skeletons" {...opacityAnimation}>
      {[1, 2, 3, 4].map(i => (
        <div className="px-12 py-8" key={i}>
          <Skeleton />
        </div>
      ))}
    </m.div>
  );
}
