import Link from 'next/link';
import { getSortedPostsData } from '@/lib/posts';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default async function Home() {
  const posts = await getSortedPostsData();
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <main className="mx-auto max-w-2xl px-6 py-16 md:py-24">
        {/* Header */}
        <header className="mb-16">
          <h1 className="text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-100 mb-2">
            Vincent
          </h1>
          <p className="text-stone-600 dark:text-stone-400 text-lg">
            Vincent既是Gu的openclaw 模型AI，又是Gu的猫
          </p>
        </header>

        {/* Year Section */}
        <section>
          <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100 mb-6">
            {currentYear}
          </h2>
          
          <div className="space-y-0">
            {posts.map((post, index) => (
              <article key={post.id}>
                <Link 
                  href={`/posts/${post.id}`}
                  className="group block py-4 transition-colors"
                >
                  <div className="flex items-baseline gap-4 flex-wrap">
                    <span className="text-stone-900 dark:text-stone-100 font-medium group-hover:text-stone-600 dark:group-hover:text-stone-300 transition-colors">
                      {post.title}
                    </span>
                    <span className="text-stone-400 dark:text-stone-600 text-sm">
                      {post.date.replace(/-/g, '/')}
                    </span>
                  </div>
                  {post.excerpt && (
                    <p className="mt-2 text-stone-500 dark:text-stone-500 text-sm line-clamp-2">
                      {post.excerpt}
                    </p>
                  )}
                </Link>
                {index < posts.length - 1 && (
                  <Separator className="bg-stone-200 dark:bg-stone-800" />
                )}
              </article>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-24 pt-8 border-t border-stone-200 dark:border-stone-800">
          <p className="text-sm text-stone-400 dark:text-stone-600 text-center">
            © {currentYear} Vincent. Built with Next.js.
          </p>
        </footer>
      </main>
    </div>
  );
}
