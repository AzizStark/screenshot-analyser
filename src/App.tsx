import React, { useState } from 'react';
import { ImageUploader } from './components/ImageUploader/ImageUploader';
import { ImageViewer } from './components/ImageViewer/ImageViewer';
import { ImageDetails } from './components/ImageDetails/ImageDetails';
import { CoordinatesList } from './components/CoordinatesList/CoordinatesList';
import type { ImageData, ClickPoint } from './types';
import './App.css';

function App() {
  const [uploadedImage, setUploadedImage] = useState<ImageData | null>(null);
  const [clickPoints, setClickPoints] = useState<ClickPoint[]>([]);
  const [uploadError, setUploadError] = useState<string>('');
  const [isValidating, setIsValidating] = useState(false);

  const handleImageUpload = (imageData: ImageData) => {
    setUploadedImage(imageData);
    setClickPoints([]); // Clear previous coordinates
    setUploadError('');
  };

  const handleAddClickPoint = (clickPoint: ClickPoint) => {
    setClickPoints(prev => [...prev, clickPoint]);
  };

  const handleClearAllPoints = () => {
    setClickPoints([]);
  };

  const handleRemovePoint = (id: string) => {
    setClickPoints(prev => prev.filter(point => point.id !== id));
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Screenshot Coordinate Analyzer</h1>
        <p>Upload an image and click anywhere to get coordinates</p>
      </header>

      <main className="app-main">
        {!uploadedImage ? (
          <div className="upload-container">
            <ImageUploader
              onImageUpload={handleImageUpload}
              onError={setUploadError}
              onValidating={setIsValidating}
            />
            {uploadError && (
              <div className="error-message">{uploadError}</div>
            )}
            {isValidating && (
              <div className="validating-message">Validating image...</div>
            )}
          </div>
        ) : (
          <div className="analysis-container">
            <div className="left-panel">
              <ImageViewer
                imageUrl={uploadedImage.dataUrl}
                clickPoints={clickPoints}
                onAddClickPoint={handleAddClickPoint}
                imageDimensions={uploadedImage.metadata.dimensions}
              />
              <button 
                className="new-image-button"
                onClick={() => {
                  setUploadedImage(null);
                  setClickPoints([]);
                }}
              >
                Upload New Image
              </button>
            </div>
            
            <div className="right-panel">
              <ImageDetails metadata={uploadedImage.metadata} />
              <CoordinatesList
                clickPoints={clickPoints}
                onClearAll={handleClearAllPoints}
                onRemovePoint={handleRemovePoint}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
