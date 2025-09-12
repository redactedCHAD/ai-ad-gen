import React, { useState, useRef, useCallback } from 'react';
import type { UploadedFile } from '../types';

interface ImageUploaderProps {
  value: UploadedFile | null;
  onImageUpload: (file: UploadedFile) => void;
  onClear: () => void;
  label: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ value, onImageUpload, onClear, label }) => {
  const [dragOver, setDragOver] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const previewUrl = value ? `data:${value.mimeType};base64,${value.base64}` : null;

  const handleFileChange = useCallback((file: File | null) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        if (base64String) {
          onImageUpload({ base64: base64String, mimeType: file.type });
        }
      };
      reader.readAsDataURL(file);
    }
  }, [onImageUpload]);

  const onDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const onDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragOver(false);
  };
  
  const onDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
        handleFileChange(file);
    }
  };

  return (
    <div className="relative">
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
      />
      <label
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => !value && fileInputRef.current?.click()}
        className={`flex justify-center items-center w-full h-48 border-2 border-dashed rounded-lg transition-all duration-200
          ${value ? 'p-0 border-solid border-gray-700 cursor-default' : 'p-4 cursor-pointer'}
          ${dragOver ? 'border-cyan-500 bg-cyan-500/10' : 'border-gray-600 hover:border-cyan-600 hover:bg-white/5'}`}
      >
        {previewUrl ? (
          <img src={previewUrl} alt="Preview" className="max-h-full max-w-full object-contain rounded-md" />
        ) : (
          <div className="text-center text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
            <p className="mt-2 text-sm px-2">{label}</p>
          </div>
        )}
      </label>
       {previewUrl && (
        <button
            onClick={(e) => { e.preventDefault(); onClear(); }}
            className="absolute top-2 right-2 bg-black bg-opacity-70 text-white rounded-full p-1.5 leading-none hover:bg-opacity-90 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-white"
            aria-label="Remove image"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
        </button>
      )}
    </div>
  );
};

export default ImageUploader;