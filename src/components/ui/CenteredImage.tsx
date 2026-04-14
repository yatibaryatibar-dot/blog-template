import React from 'react';
import Image from 'next/image'; // 使用 next/image 优化图片

interface CenteredImageProps {
    src: string;
    alt: string;
    caption?: string;
    width?: string | number;
}

const CenteredImage: React.FC<CenteredImageProps> = ({ src, alt, caption, width }) => {
    // 处理 Next Image 的 width 和 height
    // 简单的处理：如果提供了 width 属性，将其作为 width，并计算一个默认的 aspect ratio (e.g., 16:9) 来得到 height
    // 更健壮的方式可能需要获取图片的原始尺寸
    let imgWidth: number | undefined;
    let imgHeight: number | undefined;
    const style: React.CSSProperties = {};

    if (width) {
        const parsedWidth = parseInt(String(width), 10);
        if (!isNaN(parsedWidth)) {
            imgWidth = parsedWidth;
            // 假设一个默认的长宽比，例如 16:9
            // imgHeight = Math.round((parsedWidth * 9) / 16);
            // 或者直接设置样式宽度，让 Next Image 自动处理高度
            style.width = `${parsedWidth}px`;
            style.height = 'auto';
        } else {
            style.width = String(width); // 如果是百分比等字符串
            style.height = 'auto';
        }
    }

    // 检查 src 是否是外部链接
    const isExternal = src.startsWith('http') || src.startsWith('//');

    return (
        // 使用 not-prose 避免继承 prose 样式，或者自定义样式
        <div className="not-prose flex flex-col items-center w-full my-6">
            <Image
                src={src}
                alt={alt}
                width={imgWidth || 700}
                height={imgHeight || 400}
                style={style}
                className="max-w-full block rounded-lg shadow-md"
                // 对于外部图片，关闭内置优化，避免需要配置 remotePatterns
                {...(isExternal ? { unoptimized: true } : {})}
            />
            {caption && (
                <p className="text-xs text-gray-500 mt-1 text-center">{caption}</p>
            )}
        </div>
    );
};

export default CenteredImage; 
