const fs = require('fs');
const path = require('path');

// 重定向配置：路径 -> 目标
const REDIRECTS = [
  { from: '/daily', to: '/blog-template/zh/daily' },
  { from: '/about', to: '/blog-template/zh/about' },
  { from: '/posts', to: '/blog-template/zh/posts' },
];

const DIST_DIR = path.join(process.cwd(), 'dist');

function generateRedirectHTML(to: string): string {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="refresh" content="0; url=${to}">
  <title>Redirecting...</title>
</head>
<body>
  <p>正在跳转至 <a href="${to}">目标页面</a>...</p>
</body>
</html>`;
}

function generateRedirects() {
  console.log('Generating redirect files...');
  
  for (const { from, to } of REDIRECTS) {
    const filePath = path.join(DIST_DIR, `${from}.html`);
    const html = generateRedirectHTML(to);
    
    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`Created: ${filePath} -> ${to}`);
  }
  
  console.log('Redirect files generated successfully!');
}

generateRedirects();
