import nextMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/about',
        destination: '/zh/about',
      },
      {
        source: '/daily',
        destination: '/zh/daily',
      },
      {
        source: '/daily/:slug*',
        destination: '/zh/daily/:slug*',
      },
      {
        source: '/posts',
        destination: '/zh/posts',
      },
      {
        source: '/posts/:slug*',
        destination: '/zh/posts/:slug*',
      },
      {
        source: '/:prefix(public)?/image/:path*',
        destination: '/image/:path*',
      },
    ];
  },
  experimental: {
    mdxRs: true,
  },
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // 优化字体加载
  optimizeFonts: true,
  // GitHub Pages 静态导出配置
  output: 'export',
  distDir: 'dist',
  basePath: '/blog-template',
  // 优化图片加载（静态导出需要 unoptimized）
  images: {
    unoptimized: true,
  },
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
};

const withMDX = nextMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
})

export default withMDX(nextConfig)
