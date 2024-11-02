import {useParams} from 'react-router-dom';
import {useCustomPage} from './use-custom-page';
import {Navbar} from '../ui/navigation/navbar/navbar';
import {Footer} from '../ui/footer/footer';
import {CustomPageBody} from '@common/custom-page/custom-page-body';
import {PageMetaTags} from '@common/http/page-meta-tags';
import {PageStatus} from '@common/http/page-status';
import {useEffect} from 'react';

interface Props {
  slug?: string | number;
}
export function CustomPageLayout({slug}: Props) {
  const {pageSlug} = useParams();
  const query = useCustomPage(slug || pageSlug!);

  useEffect(() => {
    if (query.data?.page) {
      window.scrollTo(0, 0);
    }
  }, [query]);

  return (
    <div className="flex min-h-screen flex-col bg">
      <PageMetaTags query={query} />
      <Navbar
        menuPosition="custom-page-navbar"
        className="sticky top-0 flex-shrink-0"
      />
      <div className="flex-auto">
        {query.data ? (
          <CustomPageBody page={query.data.page} />
        ) : (
          <PageStatus query={query} loaderClassName="mt-80" />
        )}
      </div>
      <Footer className="mx-14 md:mx-40" />
    </div>
  );
}
