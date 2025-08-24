import type { ClickPoint } from '../types';

export function calculateImageCoordinates(
  event: React.MouseEvent<HTMLElement>,
  imageElement: HTMLImageElement
): Omit<ClickPoint, 'id' | 'timestamp'> {
  const rect = imageElement.getBoundingClientRect();
  
  // Calculate scale factors
  const scaleX = imageElement.naturalWidth / rect.width;
  const scaleY = imageElement.naturalHeight / rect.height;
  
  // Calculate display coordinates (relative to the rendered image)
  const displayX = event.clientX - rect.left;
  const displayY = event.clientY - rect.top;
  
  // Calculate actual image coordinates
  const imageX = Math.round(displayX * scaleX);
  const imageY = Math.round(displayY * scaleY);
  
  return { displayX, displayY, imageX, imageY };
}

export function generateClickPointId(): string {
  return `click-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function exportCoordinatesAsJSON(clickPoints: ClickPoint[]): string {
  const exportData = clickPoints.map(point => ({
    id: point.id,
    imageCoordinates: {
      x: point.imageX,
      y: point.imageY
    },
    displayCoordinates: {
      x: point.displayX,
      y: point.displayY
    },
    timestamp: point.timestamp.toISOString()
  }));
  
  return JSON.stringify(exportData, null, 2);
}

export function exportCoordinatesAsCSV(clickPoints: ClickPoint[]): string {
  const headers = ['ID', 'Image X', 'Image Y', 'Display X', 'Display Y', 'Timestamp'];
  const rows = clickPoints.map(point => [
    point.id,
    point.imageX,
    point.imageY,
    Math.round(point.displayX),
    Math.round(point.displayY),
    point.timestamp.toISOString()
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  return csvContent;
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}
