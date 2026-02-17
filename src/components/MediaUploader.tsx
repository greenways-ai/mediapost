import { useRef, useState } from 'react';

interface MediaUploaderProps {
  onUpload: (urls: string[]) => void;
  existingMedia: string[];
  onRemove: (index: number) => void;
  required?: boolean;
}

const API_URL = 'http://localhost:3001';

export function MediaUploader({ onUpload, existingMedia, onRemove, required }: MediaUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const totalFiles = files.length + existingMedia.length;
    if (totalFiles > 4) {
      alert('Maximum 4 media files allowed per post');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const uploadedUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append('media', file);

      try {
        // Create a temporary post ID for media upload
        const tempId = 'temp-' + Date.now();
        const response = await fetch(`${API_URL}/api/posts/${tempId}/media`, {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          const data = await response.json();
          uploadedUrls.push(...data.mediaUrls);
        }
        setUploadProgress(((i + 1) / files.length) * 100);
      } catch (error) {
        console.error('Upload failed:', error);
      }
    }

    onUpload(uploadedUrls);
    setIsUploading(false);
    setUploadProgress(0);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const isImage = (url: string) => /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
  const isVideo = (url: string) => /\.(mp4|mov|webm)$/i.test(url);

  return (
    <div className="space-y-3">
      {existingMedia.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {existingMedia.map((url, index) => (
            <div key={index} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100">
              {isImage(url) && (
                <img 
                  src={`${API_URL}${url}`} 
                  alt={`Media ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              )}
              {isVideo(url) && (
                <video 
                  src={`${API_URL}${url}`}
                  className="w-full h-full object-cover"
                  preload="metadata"
                />
              )}
              <button
                onClick={() => onRemove(index)}
                className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remove"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              {isVideo(url) && (
                <div className="absolute bottom-1 right-1 bg-black/70 text-white px-1.5 py-0.5 rounded text-xs">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {existingMedia.length < 4 && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            id="media-upload"
          />
          <label
            htmlFor="media-upload"
            className={`
              inline-flex items-center gap-2 px-4 py-2 border-2 border-dashed rounded-lg cursor-pointer transition-colors
              ${required && existingMedia.length === 0
                ? 'border-orange-300 bg-orange-50 text-orange-700 hover:border-orange-500'
                : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50 text-gray-600'
              }
            `}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm font-medium">
              {existingMedia.length === 0 ? 'Add Media' : 'Add More'}
              {required && existingMedia.length === 0 && ' *'}
            </span>
            <span className="text-xs opacity-75">
              ({4 - existingMedia.length} remaining)
            </span>
          </label>
        </div>
      )}

      {isUploading && (
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <span className="text-xs text-gray-500">{Math.round(uploadProgress)}%</span>
        </div>
      )}
    </div>
  );
}
