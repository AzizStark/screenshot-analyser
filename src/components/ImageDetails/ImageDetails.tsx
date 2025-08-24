import React from 'react';
import type { ImageMetadata } from '../../types';
import { formatFileSize } from '../../utils/imageValidation';
import './ImageDetails.css';

interface ImageDetailsProps {
  metadata: ImageMetadata;
}

export const ImageDetails: React.FC<ImageDetailsProps> = ({ metadata }) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="image-details">
      <h3 className="details-title">Image Details</h3>
      <div className="details-content">
        <div className="detail-item">
          <span className="detail-label">File Name:</span>
          <span className="detail-value" title={metadata.name}>
            {metadata.name}
          </span>
        </div>
        <div className="detail-item">
          <span className="detail-label">File Size:</span>
          <span className="detail-value">{formatFileSize(metadata.size)}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Dimensions:</span>
          <span className="detail-value">
            {metadata.dimensions.width} × {metadata.dimensions.height} pixels
          </span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Format:</span>
          <span className="detail-value">
            {metadata.type.toUpperCase().replace('IMAGE/', '')}
          </span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Last Modified:</span>
          <span className="detail-value">
            {formatDate(metadata.lastModified)}
          </span>
        </div>
        {metadata.validatedMimeType && (
          <div className="detail-item">
            <span className="detail-label">Validated Type:</span>
            <span className="detail-value">
              {metadata.validatedMimeType}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
