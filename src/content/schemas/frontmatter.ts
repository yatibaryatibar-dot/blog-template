export type ContentType = 'post' | 'daily';

export type Frontmatter = {
  slug?: string;
  title?: string;
  date?: string | Date;
  description?: string;
  keywords?: string[] | string;
  tags?: string[];
};
