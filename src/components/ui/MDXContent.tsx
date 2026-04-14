import React from 'react';

interface MDXContentProps {
    content: string;
    postIdMap?: Record<string, string>;
    lang?: string;
}

// 简单的 Markdown 渲染函数
function renderMarkdown(content: string): string {
    return content
        // 代码块
        .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-muted/70 rounded-md p-4 overflow-x-auto text-sm"><code>$2</code></pre>')
        // 行内代码
        .replace(/`([^`]+)`/g, '<code class="bg-muted px-1.5 py-0.5 rounded-sm text-sm">$1</code>')
        // 标题
        .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold mt-6 mb-3">$1</h3>')
        .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-semibold mt-8 mb-4">$1</h2>')
        .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mt-8 mb-4">$1</h1>')
        // 粗体和斜体
        .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        // 链接
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-700 hover:underline">$1</a>')
        // 图片
        .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="rounded-lg shadow-sm my-8 max-w-full" />')
        // 无序列表
        .replace(/^- (.*$)/gim, '<li class="my-1">$1</li>')
        // 有序列表
        .replace(/^\d+\. (.*$)/gim, '<li class="my-1">$1</li>')
        // 段落
        .replace(/\n\n/g, '</p><p class="my-4 leading-relaxed">')
        // 换行
        .replace(/\n/g, '<br />');
}

export default function MDXContent({ content }: MDXContentProps) {
    const html = renderMarkdown(content);
    
    return (
        <div 
            className="prose prose-base max-w-none"
            dangerouslySetInnerHTML={{ __html: `<p class="my-4 leading-relaxed">${html}</p>` }}
        />
    );
}