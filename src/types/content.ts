export interface PostMetadata {
  date: Date;
  tags: string[];
  postid: string;
  slug: string;
  description: string;
  keywords: string[];
  title?: string;
}

export interface PostData extends Omit<PostMetadata, 'postid' | 'title'> {
  title?: string;
  content: string;
  fileName: string;
}

export interface PostSummary extends Omit<PostMetadata, 'postid' | 'title'> {
  title?: string;
  fileName: string;
}

export type IndexEntry = {
  slug: string;
  type: 'post' | 'daily';
  filePath: string; // relative to content/
  fileName: string;
  fileNameBase: string;
  title: string | null;
  date: string | null; // YYYY-MM-DD
  tags: string[];
};
