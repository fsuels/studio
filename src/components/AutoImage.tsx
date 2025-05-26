import React, { useEffect, useState } from 'react';
import Image, { type ImageProps } from 'next/image';
import type { StaticImport } from 'next/dist/shared/lib/get-img-props';

// src/components/AutoImage.tsx
// FIXED: new component ensuring images always have explicit width and height

interface AutoImageProps extends Omit<ImageProps, 'width' | 'height' | 'src'> {
  width?: number | string;
  height?: number | string;
  src?: string | StaticImport;
}

const AutoImage: React.FC<AutoImageProps> = ({
  width,
  height,
  alt = '',
  ...props
}) => {
  const [dims, setDims] = useState<{ width: number; height: number } | null>(
    null,
  );

  useEffect(() => {
    if (width && height) return;
    if (typeof props.src === 'string') {
      const img = new window.Image();
      img.src = props.src;
      img.onload = () => {
        setDims({ width: img.naturalWidth, height: img.naturalHeight });
      };
    }
  }, [width, height, props.src]);

  const finalWidth =
    (typeof width === 'string' ? parseInt(width, 10) : width) ??
    dims?.width ??
    1;
  const finalHeight =
    (typeof height === 'string' ? parseInt(height, 10) : height) ??
    dims?.height ??
    1;

  return <Image width={finalWidth} height={finalHeight} alt={alt} {...props} />;
};

export default AutoImage;
