'use client';

import React, { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

interface ShotImageViewerProps {
  imageUrl?: string | null;
  className?: string;
}

export function ShotImageViewer({ imageUrl, className }: ShotImageViewerProps) {
  const displayImageUrl = imageUrl;

  const transformRef = useRef<{ setTransform: (x: number, y: number, scale: number) => void } | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null);
  const [displaySize, setDisplaySize] = useState<{ width: number; height: number } | null>(null);

  useEffect(() => {
    setImageLoaded(false);
    setImageSize(null);
    setDisplaySize(null);
  }, [displayImageUrl]);

  useEffect(() => {
    if (!imageLoaded || !imgRef.current || !wrapperRef.current) return;

    const img = imgRef.current;
    const imgWidth = img.naturalWidth;
    const imgHeight = img.naturalHeight;

    if (imgWidth === 0 || imgHeight === 0) return;

    setImageSize({ width: imgWidth, height: imgHeight });

    const updateDisplaySize = () => {
      if (!wrapperRef.current || !imgRef.current) return;

      const wrapperWidth = wrapperRef.current.clientWidth;
      const wrapperHeight = wrapperRef.current.clientHeight;

      if (wrapperWidth === 0 || wrapperHeight === 0) return;

      const imgAspectRatio = imgWidth / imgHeight;
      const wrapperAspectRatio = wrapperWidth / wrapperHeight;

      let displayWidth = imgWidth;
      let displayHeight = imgHeight;

      if (imgAspectRatio > wrapperAspectRatio) {
        displayWidth = wrapperWidth;
        displayHeight = wrapperWidth / imgAspectRatio;
      } else {
        displayHeight = wrapperHeight;
        displayWidth = wrapperHeight * imgAspectRatio;
      }

      setDisplaySize({ width: displayWidth, height: displayHeight });
    };

    updateDisplaySize();

    const resizeObserver = new ResizeObserver(updateDisplaySize);
    if (wrapperRef.current) {
      resizeObserver.observe(wrapperRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [imageLoaded, displayImageUrl]);

  useEffect(() => {
    if (!displaySize || !transformRef.current || !wrapperRef.current) return;

    const wrapperWidth = wrapperRef.current.clientWidth;
    const wrapperHeight = wrapperRef.current.clientHeight;

    if (wrapperWidth === 0 || wrapperHeight === 0) return;

    const centerX = (wrapperWidth - displaySize.width) / 2;
    const centerY = (wrapperHeight - displaySize.height) / 2;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (transformRef.current) {
          transformRef.current.setTransform(centerX, centerY, 1);
        }
      });
    });
  }, [displaySize, displayImageUrl]);

  return (
    <div
      className={cn(
        'w-full h-full flex items-center justify-center bg-[var(--ds-bg-secondary)] overflow-hidden',
        className,
      )}
    >
      <div ref={wrapperRef} className="w-full h-full">
        <TransformWrapper
          initialScale={1}
          minScale={0.5}
          maxScale={4}
          wheel={{
            step: 0.1,
          }}
          panning={{
            disabled: false,
          }}
          doubleClick={{
            disabled: false,
            mode: 'reset',
          }}
          centerOnInit={false}
          limitToBounds={false}
          centerZoomedOut={false}
          onInit={(ref) => {
            transformRef.current = ref;
          }}
        >
          <TransformComponent
            wrapperStyle={{
              width: '100%',
              height: '100%',
            }}
          contentStyle={{
            width: displaySize ? `${displaySize.width}px` : '100%',
            height: displaySize ? `${displaySize.height}px` : '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'none',
          }}
        >
          {displayImageUrl && (
            <div
              ref={containerRef}
              style={{
                width: displaySize ? `${displaySize.width}px` : '100%',
                height: displaySize ? `${displaySize.height}px` : '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                ref={imgRef}
                src={displayImageUrl}
                alt="Shot image"
                onLoad={() => setImageLoaded(true)}
                style={{
                  width: displaySize ? `${displaySize.width}px` : 'auto',
                  height: displaySize ? `${displaySize.height}px` : 'auto',
                  objectFit: 'contain',
                }}
              />
            </div>
          )}
        </TransformComponent>
      </TransformWrapper>
      </div>
    </div>
  );
}

