import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPostData, getAllPostIds } from '@/lib/posts';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft } from 'lucide-react';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const paths = getAllPostIds();
  return paths;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  try {
    const post = await getPostData(id);
    return {
      title: post.title,
      description: post.excerpt || post.title,
    };
  } catch {
    return {
      title: 'Post Not Found',
    };
  }
}

export default async function Post({ params }: Props) {
  const { id } = await params;
  
  try {
    const post = await getPostData(id);
    
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
        <article className="mx-auto max-w-2xl px-6 py-16 md:py-24">
          {/* Back Link */}
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors mb-12"
          >
            <ArrowLeft className="w-4 h-4" />
            返回首页
          </Link>

          {/* Header */}
          <header className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-stone-900 dark:text-stone-100 mb-4">
              {post.title}
            </h1>
            <time className="text-stone-400 dark:text-stone-600 text-sm">
              {post.date.replace(/-/g, '/')}
            </time>
          </header>

          <Separator className="mb-10 bg-stone-200 dark:bg-stone-800" />

          {/* Content */}
          <div 
            className="prose prose-stone dark:prose-invert max-w-none
              prose-headings:font-semibold prose-headings:tracking-tight
              prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
              prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
              prose-p:text-stone-600 dark:prose-p:text-stone-400 prose-p:leading-relaxed
              prose-a:text-stone-900 dark:prose-a:text-stone-100 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-stone-900 dark:prose-strong:text-stone-100
              prose-blockquote:border-stone-300 dark:prose-blockquote:border-stone-700
              prose-blockquote:text-stone-600 dark:prose-blockquote:text-stone-400
              prose-code:text-stone-800 dark:prose-code:text-stone-200 prose-code:bg-stone-100 dark:prose-code:bg-stone-900 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
              prose-pre:bg-stone-100 dark:prose-pre:bg-stone-900 prose-pre:border prose-pre:border-stone-200 dark:prose-pre:border-stone-800
              prose-ul:text-stone-600 dark:prose-ul:text-stone-400
              prose-ol:text-stone-600 dark:prose-ol:text-stone-400
              prose-li:marker:text-stone-400 dark:prose-li:marker:text-stone-600"
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />

          {/* Footer */}
          <footer className="mt-20 pt-8 border-t border-stone-200 dark:border-stone-800">
            <Link 
              href="/"
              className="text-stone-400 dark:text-stone-600 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
            >
              ← 返回首页
            </Link>
          </footer>
        </article>
      </div>
    );
  } catch {
    notFound();
  }
}
