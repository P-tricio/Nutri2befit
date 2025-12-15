import { useState, useEffect } from 'react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    fallbackIcon?: string; // Material symbol name
    fallbackColor?: string; // Tailwind class e.g. "bg-red-100"
}

export default function ImageWithFallback({
    src,
    alt,
    className,
    fallbackIcon = 'restaurant',
    fallbackColor = 'bg-slate-200',
    ...props
}: ImageWithFallbackProps) {
    const [error, setError] = useState(false);

    useEffect(() => {
        setError(false); // Reset error if src changes
    }, [src]);

    if (error || !src) {
        return (
            <div className={`${className} ${fallbackColor} flex items-center justify-center`}>
                <span className="material-symbols-outlined text-slate-400/50 text-4xl">{fallbackIcon}</span>
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={alt}
            className={`${className} object-cover`}
            onError={() => setError(true)}
            {...props}
        />
    );
}
