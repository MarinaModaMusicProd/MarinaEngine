import {useSettings} from '@ui/settings/use-settings';
import {MultiProductArticleGrid} from '@helpdesk/help-center/homepage/multi-product-article-grid';
import {Footer} from '@common/ui/footer/footer';
import React, {ReactNode} from 'react';
import {useHcLandingPageData} from '@helpdesk/help-center/homepage/use-hc-landing-page-data';
import {PageStatus} from '@common/http/page-status';
import {ArticleGrid} from '@helpdesk/help-center/homepage/article-grid';
import {ColorfulHeader} from '@helpdesk/help-center/homepage/colorful-header';
import {SimpleHeader} from '@helpdesk/help-center/homepage/simple-header';

export function HcLandingPage() {
  const query = useHcLandingPageData();
  const {hcLanding} = useSettings();

  return (
    <Layout>
      {query.data ? (
        hcLanding?.content?.variant === 'multiProduct' ? (
          <MultiProductArticleGrid data={query.data} />
        ) : (
          <ArticleGrid data={query.data} />
        )
      ) : (
        <PageStatus
          query={query}
          show404={false}
          delayedSpinner={false}
          loaderIsScreen={false}
        />
      )}
    </Layout>
  );
}

interface LayoutProps {
  children: ReactNode;
}
function Layout({children}: LayoutProps) {
  const {hcLanding} = useSettings();
  return (
    <div className="isolate">
      {hcLanding?.header?.variant === 'simple' ? (
        <SimpleHeader />
      ) : (
        <ColorfulHeader />
      )}
      <div className="container mx-auto mb-60 px-14 md:px-24">
        <main className="relative z-10 min-h-850">{children}</main>
      </div>
      {hcLanding?.show_footer && <Footer className="px-40" />}
    </div>
  );
}
