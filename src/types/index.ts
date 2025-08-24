export interface ClickPoint {
  id: string;
  displayX: number;  // Where clicked on screen
  displayY: number;
  imageX: number;    // Actual position on original image
  imageY: number;
  timestamp: Date;
}

export interface ImageMetadata {
  name: string;
  size: number;
  type: string;  // File extension type
  lastModified: Date;
  dimensions: {
    width: number;
    height: number;
  };
  validatedMimeType?: string; // From file-type validation
}

export interface ImageData {
  file: File;
  dataUrl: string;
  metadata: ImageMetadata;
}

export interface AppState {
  uploadedImage: ImageData | null;
  clickPoints: ClickPoint[];
  isUploading: boolean;
  uploadError: string | null;
  isValidating: boolean;
}
