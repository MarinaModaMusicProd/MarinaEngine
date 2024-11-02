import {message} from '@ui/i18n/message';
import {SeoSettingsSectionConfig} from '@common/admin/appearance/types/appearance-editor-config';

export const hcSeoAppearanceConfig = {
  config: {
    pages: [
      {
        key: 'hc-landing-page',
        label: message('Landing page'),
      },
      {
        key: 'article-page',
        label: message('Article page'),
      },
      {
        key: 'category-page',
        label: message('Category page'),
      },
      {
        key: 'hc-search-page',
        label: message('Search page'),
      },
    ],
  } as SeoSettingsSectionConfig,
};
