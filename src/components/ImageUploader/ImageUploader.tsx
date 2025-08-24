import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import type { ImageData, ImageMetadata } from '../../types';
import { validateImageFile } from '../../utils/imageValidation';
import './ImageUploader.css';

interface ImageUploaderProps {
  onImageUpload: (imageData: ImageData) => void;
  onError: (error: string) => void;
  onValidating: (isValidating: boolean) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageUpload,
  onError,
  onValidating
}) => {
  const processImage = useCallback(async (file: File) => {
    onValidating(true);
    onError('');

    try {
      // Validate file type
      const validation = await validateImageFile(file);
      if (!validation.valid) {
        onError(validation.error || 'Invalid file');
        onValidating(false);
        return;
      }

      // Create FileReader to get base64 data and image dimensions
      const reader = new FileReader();

      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;

        // Create image to get dimensions
        const img = new Image();
        img.onload = () => {
          const metadata: ImageMetadata = {
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: new Date(file.lastModified),
            dimensions: {
              width: img.width,
              height: img.height
            }
          };

          const imageData: ImageData = {
            file,
            dataUrl,
            metadata
          };

          onImageUpload(imageData);
          onValidating(false);
        };

        img.onerror = () => {
          onError('Failed to load image');
          onValidating(false);
        };

        img.src = dataUrl;
      };

      reader.onerror = () => {
        onError('Failed to read file');
        onValidating(false);
      };

      reader.readAsDataURL(file);
    } catch (error) {
      onError('An unexpected error occurred');
      onValidating(false);
    }
  }, [onImageUpload, onError, onValidating]);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    if (rejectedFiles.length > 0) {
      const errors = rejectedFiles[0].errors;
      if (errors[0]?.code === 'file-too-large') {
        onError('File size exceeds 10MB limit');
      } else {
        onError('Invalid file type. Only JPG and PNG files are allowed');
      }
      return;
    }

    if (acceptedFiles.length > 0) {
      processImage(acceptedFiles[0]);
    }
  }, [processImage, onError]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false
  });

  return (
    <div
      {...getRootProps()}
      className={`dropzone ${isDragActive ? 'dropzone-active' : ''}`}
    >
      <input {...getInputProps()} />
      <div className="dropzone-content">
        <svg
          className="upload-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        {isDragActive ? (
          <p>Drop the image here...</p>
        ) : (
          <>
            <p className="main-text">Drag & drop your screenshot here</p>
            <p className="sub-text">or click to select</p>
            <p className="file-info">Supports: JPG, PNG (Max 10MB)</p>
          </>
        )}
      </div>
    </div>
  );
};
