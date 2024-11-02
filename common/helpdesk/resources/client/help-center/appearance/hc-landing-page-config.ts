export interface HcLandingPageConfig {
  show_footer?: boolean;
  hide_small_categories?: boolean;
  articles_per_category?: number;
  children_per_category?: number;
  header?: {
    variant?: 'simple' | 'colorful';
    title?: string;
    subtitle?: string;
    placeholder?: string;
    background?: string;
    backgroundRepeat?: string;
    backgroundPosition?: string;
    backgroundSize?: string;
  };
  content?: {
    variant?: 'articleGrid' | 'multiProduct';
  };
}
