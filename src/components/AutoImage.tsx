import React, { useEffect, useState } from 'react';
import Image, { type ImageProps } from 'next/image';

// src/components/AutoImage.tsx
// FIXED: new component ensuring images always have explicit width and height

interface AutoImageProps extends Omit<ImageProps, 'width' | 'height'> {
  width?: number;
  height?: number;
}

const AutoImage: React.FC<AutoImageProps> = ({ width, height, ...props }) => {
  const [dims, setDims] = useState<{ width: number; height: number } | null>(null);

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

  const finalWidth = width ?? dims?.width ?? 1;
  const finalHeight = height ?? dims?.height ?? 1;

  return <Image width={finalWidth} height={finalHeight} {...props} />;
};

export default AutoImage;
