import { fileTypeFromBuffer } from 'file-type';

export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png'];
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function validateImageFile(file: File): Promise<{ valid: boolean; error?: string }> {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: 'File size exceeds 10MB limit' };
  }

  try {
    // Read file as array buffer
    const buffer = await file.arrayBuffer();
    const fileType = await fileTypeFromBuffer(new Uint8Array(buffer));
    
    if (!fileType || !ACCEPTED_IMAGE_TYPES.includes(fileType.mime)) {
      return { valid: false, error: 'Invalid file type. Only JPG and PNG files are allowed' };
    }
    
    return { valid: true };
  } catch (error) {
    return { valid: false, error: 'Failed to validate file type' };
  }
}

export function getFileExtension(filename: string): string {
  const parts = filename.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
