
import React, { useState, useEffect } from 'react';
import Spinner from './Spinner';
import Button from './Button';
import StyleSelector from './StyleSelector';
import { VIDEO_LOADING_MESSAGES, VIDEO_STYLE_OPTIONS } from '../constants';
import type { UploadedFile } from '../types';

interface VideoGeneratorProps {
  isGenerating: boolean;
  videoUrl: string | null;
  error: string | null;
  videoDescription: string;
  onVideoDescriptionChange: (value: string) => void;
  selectedStyles: string[];
  onStyleToggle: (style: string) => void;
  onGenerate: () => void;
  disabled: boolean;
  sourceImage: UploadedFile | null;
  isCustomSource: boolean;
  onClearCustomSource: () => void;
}

const VideoPlaceholder: React.FC = () => (
    <div className="text-center text-gray-500">
        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.82m5.84-2.56a14.98 14.98 0 00-5.84-2.56m0 0a14.98 14.98 0 01-5.84-2.56m5.84 2.56v-4.82m0 4.82l-5.84 2.56M12 2.25a.75.75 0 01.75.75v.01a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM12 18a.75.75 0 01.75.75v.01a.75.75 0 01-1.5 0V18.75A.75.75 0 0112 18zM12 8.25a.75.75 0 01.75.75v.01a.75.75 0 01-1.5 0V9A.75.75 0 0112 8.25z" />
        </svg>
        <p className="mt-4">Your generated video will appear here.</p>
    </div>
);


const VideoOutput: React.FC<Pick<VideoGeneratorProps, 'isGenerating' | 'videoUrl' | 'error'>> = ({ isGenerating, videoUrl, error }) => {
    const [loadingMessage, setLoadingMessage] = useState(VIDEO_LOADING_MESSAGES[0]);

    useEffect(() => {
        if (isGenerating) {
            setLoadingMessage(VIDEO_LOADING_MESSAGES[0]);
            let messageIndex = 0;
            const interval = setInterval(() => {
                messageIndex = (messageIndex + 1) % VIDEO_LOADING_MESSAGES.length;
                setLoadingMessage(VIDEO_LOADING_MESSAGES[messageIndex]);
            }, 4000);
            return () => clearInterval(interval);
        }
    }, [isGenerating]);
    
    if (isGenerating) {
        return (
          <div className="text-center">
            <Spinner />
            <p className="mt-4 text-cyan-400">Generating your video ad...</p>
            <p className="text-sm text-gray-400">{loadingMessage}</p>
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
      
    if(videoUrl) {
        const handleDownloadVideo = () => {
            if (!videoUrl) return;
            const link = document.createElement('a');
            link.href = videoUrl;
            link.download = 'ai-generated-video.mp4';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };
        
        return (
            <div className="w-full flex flex-col gap-4 items-center">
                <video src={videoUrl} controls autoPlay loop className="max-h-[400px] w-full object-contain rounded-lg shadow-2xl" />
                <div className="w-full sm:w-2/3">
                    <Button onClick={handleDownloadVideo} variant="secondary">
                        ⬇️ Download Video
                    </Button>
                </div>
            </div>
        )
    }

    return <VideoPlaceholder />;
};


const VideoGenerator: React.FC<VideoGeneratorProps> = (props) => {
    const { 
        sourceImage, 
        isCustomSource, 
        onClearCustomSource, 
        selectedStyles, 
        onStyleToggle, 
        onGenerate, 
        disabled,
        videoDescription,
        onVideoDescriptionChange
    } = props;
    const sourcePreviewUrl = sourceImage ? `data:${sourceImage.mimeType};base64,${sourceImage.base64}` : null;

    return (
        <div className="flex flex-col space-y-4 p-6 bg-gray-800 rounded-2xl shadow-lg">
            <h2 className="text-xl font-semibold text-cyan-400">4. Generate a Video Ad</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left: Controls */}
                <div className="flex flex-col space-y-4">
                    <div>
                        <h3 className="font-semibold text-gray-300 mb-2">Video Source</h3>
                        <div className="relative w-32 h-32 bg-gray-700 rounded-lg flex items-center justify-center">
                            {sourcePreviewUrl ? (
                                <img src={sourcePreviewUrl} alt="Video source preview" className="max-h-full max-w-full object-contain rounded-md" />
                            ) : (
                                <p className="text-xs text-gray-500 text-center p-2">Upload a primary photo to begin.</p>
                            )}
                        </div>
                        {isCustomSource && (
                           <button onClick={onClearCustomSource} className="mt-2 text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
                                Reset to primary photo
                            </button>
                        )}
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-300 mb-2">Video Prompt*</h3>
                        <textarea
                          value={videoDescription}
                          onChange={(e) => onVideoDescriptionChange(e.target.value)}
                          placeholder="e.g., An energetic, fast-paced video showing the product in action."
                          className="w-full h-24 p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
                          maxLength={200}
                          aria-required="true"
                        />
                        <p className="text-right text-xs text-gray-400 mt-1">{videoDescription.length} / 200</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-300 mb-2">Video Styles (up to 3)</h3>
                         <StyleSelector
                            styles={VIDEO_STYLE_OPTIONS}
                            selectedStyles={selectedStyles}
                            onStyleToggle={onStyleToggle}
                        />
                    </div>
                     <div className="pt-2">
                        <Button onClick={onGenerate} disabled={disabled}>
                            {props.isGenerating ? 'Generating...' : '🎬 Generate Video Ad'}
                        </Button>
                    </div>
                </div>

                {/* Right: Output */}
                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900/50 rounded-lg p-4 min-h-[300px]">
                    <VideoOutput {...props} />
                </div>
            </div>
        </div>
    );
};

export default VideoGenerator;
