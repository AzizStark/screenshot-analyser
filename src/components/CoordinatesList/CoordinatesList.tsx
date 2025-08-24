import React, { useState } from 'react';
import type { ClickPoint } from '../../types';
import { exportCoordinatesAsJSON, exportCoordinatesAsCSV, copyToClipboard } from '../../utils/coordinateUtils';
import './CoordinatesList.css';

interface CoordinatesListProps {
  clickPoints: ClickPoint[];
  onClearAll: () => void;
  onRemovePoint: (id: string) => void;
}

export const CoordinatesList: React.FC<CoordinatesListProps> = ({
  clickPoints,
  onClearAll,
  onRemovePoint
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyCoordinate = async (point: ClickPoint) => {
    const text = `Image: (${point.imageX}, ${point.imageY})`;
    await copyToClipboard(text);
    setCopiedId(point.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportJSON = () => {
    const json = exportCoordinatesAsJSON(clickPoints);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `coordinates-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    const csv = exportCoordinatesAsCSV(clickPoints);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `coordinates-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="coordinates-list">
      <div className="coordinates-header">
        <h3 className="coordinates-title">
          Click Coordinates ({clickPoints.length})
        </h3>
        {clickPoints.length > 0 && (
          <button
            className="clear-button"
            onClick={onClearAll}
            title="Clear all coordinates"
          >
            Clear All
          </button>
        )}
      </div>

      {clickPoints.length === 0 ? (
        <p className="empty-message">No coordinates marked yet</p>
      ) : (
        <>
          <div className="coordinates-items">
            {clickPoints.map((point, index) => (
              <div key={point.id} className="coordinate-item">
                <div className="coordinate-number">{index + 1}</div>
                <div className="coordinate-info">
                  <div className="coordinate-main">
                    Image: ({point.imageX}, {point.imageY})
                  </div>
                  <div className="coordinate-sub">
                    Display: ({Math.round(point.displayX)}, {Math.round(point.displayY)})
                  </div>
                </div>
                <div className="coordinate-actions">
                  <button
                    className="action-button copy-button"
                    onClick={() => handleCopyCoordinate(point)}
                    title="Copy coordinates"
                  >
                    {copiedId === point.id ? '✓' : '📋'}
                  </button>
                  <button
                    className="action-button remove-button"
                    onClick={() => onRemovePoint(point.id)}
                    title="Remove this point"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="export-buttons">
            <button
              className="export-button"
              onClick={handleExportJSON}
              title="Export as JSON"
            >
              Export JSON
            </button>
            <button
              className="export-button"
              onClick={handleExportCSV}
              title="Export as CSV"
            >
              Export CSV
            </button>
          </div>
        </>
      )}
    </div>
  );
};
