import React, { useRef, useState, useEffect } from 'react';
import type { ClickPoint } from '../../types';
import { calculateImageCoordinates, generateClickPointId } from '../../utils/coordinateUtils';
import './ImageViewer.css';

interface ImageViewerProps {
  imageUrl: string;
  clickPoints: ClickPoint[];
  onAddClickPoint: (clickPoint: ClickPoint) => void;
  imageDimensions: { width: number; height: number };
}

export const ImageViewer: React.FC<ImageViewerProps> = ({
  imageUrl,
  clickPoints,
  onAddClickPoint,
  imageDimensions
}) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [displayDimensions, setDisplayDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDisplayDimensions = () => {
      if (imageRef.current) {
        const rect = imageRef.current.getBoundingClientRect();
        setDisplayDimensions({ width: rect.width, height: rect.height });
      }
    };

    updateDisplayDimensions();
    window.addEventListener('resize', updateDisplayDimensions);
    return () => window.removeEventListener('resize', updateDisplayDimensions);
  }, [imageUrl]);

  const handleImageClick = (event: React.MouseEvent<HTMLImageElement>) => {
    if (!imageRef.current) return;

    const coordinates = calculateImageCoordinates(event, imageRef.current);
    const clickPoint: ClickPoint = {
      id: generateClickPointId(),
      ...coordinates,
      timestamp: new Date()
    };

    onAddClickPoint(clickPoint);
  };

  const calculateMarkerPosition = (point: ClickPoint) => {
    if (!imageRef.current) return { left: 0, top: 0 };

    const rect = imageRef.current.getBoundingClientRect();
    const scaleX = rect.width / imageDimensions.width;
    const scaleY = rect.height / imageDimensions.height;

    return {
      left: point.imageX * scaleX,
      top: point.imageY * scaleY
    };
  };

  return (
    <div className="image-viewer-container" ref={containerRef}>
      <div className="image-wrapper">
        <img
          ref={imageRef}
          src={imageUrl}
          alt="Uploaded screenshot"
          className="viewer-image"
          onClick={handleImageClick}
          onLoad={(e) => {
            const img = e.target as HTMLImageElement;
            const rect = img.getBoundingClientRect();
            setDisplayDimensions({ width: rect.width, height: rect.height });
          }}
        />
        {clickPoints.map((point, index) => {
          const position = calculateMarkerPosition(point);
          return (
            <div
              key={point.id}
              className="click-marker"
              style={{
                left: `${position.left}px`,
                top: `${position.top}px`
              }}
              title={`Point ${index + 1}: (${point.imageX}, ${point.imageY})`}
            >
              <span className="marker-number">{index + 1}</span>
            </div>
          );
        })}
      </div>
      <div className="viewer-info">
        <p>Click anywhere on the image to mark coordinates</p>
        <p className="dimension-info">
          Image: {imageDimensions.width} × {imageDimensions.height}px | 
          Display: {Math.round(displayDimensions.width)} × {Math.round(displayDimensions.height)}px
        </p>
      </div>
    </div>
  );
};
