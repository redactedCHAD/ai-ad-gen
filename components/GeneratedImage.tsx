import React from 'react';
import Spinner from './Spinner';
import Button from './Button';
import type { UploadedFile } from '../types';

interface GeneratedImageProps {
  isGenerating: boolean;
  imageUrl: string | null;
  text: string | null;
  error: string | null;
  onUseForVideo: (file: UploadedFile) => void;
}

const Placeholder: React.FC = () => (
    <div className="text-center text-gray-500">
        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="mt-4">Your generated ad will appear here.</p>
    </div>
);

const GeneratedImage: React.FC<GeneratedImageProps> = ({ isGenerating, imageUrl, text, error, onUseForVideo }) => {
  
  const handleUseImageForVideo = () => {
    if (!imageUrl) return;
    const match = imageUrl.match(/^data:(image\/[a-zA-Z]+);base64,(.*)$/);
    if (match && match[1] && match[2]) {
        const mimeType = match[1];
        const base64 = match[2];
        onUseForVideo({ base64, mimeType });
    } else {
        console.error("Could not parse generated image data URL to create video.");
    }
  };

  const handleDownloadImage = () => {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = imageUrl;
    const mimeType = imageUrl.split(';')[0].split(':')[1] ?? 'image/png';
    const extension = mimeType.split('/')[1] ?? 'png';
    link.download = `ai-generated-ad.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderContent = () => {
    if (isGenerating) {
      return (
        <div className="text-center">
          <Spinner />
          <p className="mt-4 text-cyan-400">Generating your creative vision...</p>
          <p className="text-sm text-gray-400">This may take a moment.</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center text-red-400 bg-red-900/50 p-4 rounded-lg">
          <h3 className="font-bold">Generation Failed</h3>
          <p className="mt-2 text-sm">{error}</p>
        </div>
      );
    }
    
    if (imageUrl) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-between gap-4">
            <div className="flex-grow flex items-center justify-center w-full">
              <img src={imageUrl} alt="Generated ad" className="max-h-[400px] w-full object-contain rounded-lg shadow-2xl" />
            </div>
            {text && <p className="text-sm text-gray-400 italic p-3 bg-black/30 rounded-md self-stretch text-center">{text}</p>}
            <div className="w-full flex flex-col sm:flex-row gap-2">
                 <Button onClick={handleUseImageForVideo}>
                    🎬 Use this Image to Generate Video
                </Button>
                <Button onClick={handleDownloadImage} variant="secondary">
                    ⬇️ Download Image
                </Button>
            </div>
        </div>
      );
    }

    return <Placeholder />;
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-black/20 rounded-lg p-4 min-h-[300px]">
      {renderContent()}
    </div>
  );
};

export default GeneratedImage;