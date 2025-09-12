import React, { useState, useCallback, useEffect } from 'react';
import Header from '../components/Header';
import ImageUploader from '../components/ImageUploader';
import StyleSelector from '../components/StyleSelector';
import Button from '../components/Button';
import GeneratedImage from '../components/GeneratedImage';
import VideoGenerator from '../components/VideoGenerator';
import { generateStyledImage, generateVideoAd } from '../services/geminiService';
import { IMAGE_STYLE_OPTIONS } from '../constants';
import type { UploadedFile } from '../types';

interface AdGeneratorToolProps {
  onBackToDashboard: () => void;
}

const AdGeneratorTool: React.FC<AdGeneratorToolProps> = ({ onBackToDashboard }) => {
  // Input State
  const [primaryImage, setPrimaryImage] = useState<UploadedFile | null>(null);
  const [secondaryImage, setSecondaryImage] = useState<UploadedFile | null>(null);
  const [description, setDescription] = useState<string>('');
  
  // Image Generation State
  const [selectedImageStyles, setSelectedImageStyles] = useState<string[]>([]);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generatedText, setGeneratedText] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState<boolean>(false);
  const [imageError, setImageError] = useState<string | null>(null);

  // Video Generation State
  const [videoSourceImage, setVideoSourceImage] = useState<UploadedFile | null>(null);
  const [videoDescription, setVideoDescription] = useState<string>('');
  const [selectedVideoStyles, setSelectedVideoStyles] = useState<string[]>([]);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState<boolean>(false);
  const [videoError, setVideoError] = useState<string | null>(null);

  // Clean up blob URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (generatedVideoUrl && generatedVideoUrl.startsWith('blob:')) {
        URL.revokeObjectURL(generatedVideoUrl);
      }
    };
  }, [generatedVideoUrl]);


  const resetImageOutput = () => {
    setGeneratedImage(null);
    setGeneratedText(null);
    setImageError(null);
  };
  
  const resetVideoOutput = () => {
    if (generatedVideoUrl && generatedVideoUrl.startsWith('blob:')) {
      URL.revokeObjectURL(generatedVideoUrl);
    }
    setGeneratedVideoUrl(null);
    setVideoError(null);
  }

  const handleImageUpload = (file: UploadedFile, type: 'primary' | 'secondary') => {
    resetImageOutput();
    resetVideoOutput();
    if (type === 'primary') {
      setPrimaryImage(file);
      setVideoSourceImage(null); // Reset video source if primary image changes
    } else {
      setSecondaryImage(file);
    }
  };
  
  const handleClearImage = (type: 'primary' | 'secondary') => {
    if (type === 'primary') {
      setPrimaryImage(null);
      setVideoSourceImage(null);
    } else {
      setSecondaryImage(null);
    }
  };

  const handleImageStyleToggle = (style: string) => {
    setSelectedImageStyles(prev => {
      if (prev.includes(style)) return prev.filter(s => s !== style);
      if (prev.length < 3) return [...prev, style];
      return prev;
    });
  };
  
  const handleVideoStyleToggle = (style: string) => {
    setSelectedVideoStyles(prev => {
      if (prev.includes(style)) return prev.filter(s => s !== style);
      if (prev.length < 3) return [...prev, style];
      return prev;
    });
  };

  const handleGenerateImage = useCallback(async () => {
    if (!primaryImage || description.trim().length === 0 || selectedImageStyles.length === 0) {
      setImageError("Please upload a primary image, provide a description, and select at least one style.");
      return;
    }

    setIsGeneratingImage(true);
    resetImageOutput();
    resetVideoOutput();
    setVideoSourceImage(null);


    try {
      const result = await generateStyledImage(primaryImage, secondaryImage, description, selectedImageStyles);
      setGeneratedImage(result.imageUrl);
      setGeneratedText(result.text);
    } catch (e) {
      console.error(e);
      setImageError(e instanceof Error ? e.message : "An unknown error occurred. Please check the console.");
    } finally {
      setIsGeneratingImage(false);
    }
  }, [primaryImage, secondaryImage, description, selectedImageStyles]);
  
  const handleSetVideoSource = useCallback((file: UploadedFile) => {
    setVideoSourceImage(file);
    resetVideoOutput();
  }, []);
  
  const handleClearVideoSource = () => {
    setVideoSourceImage(null);
  }

  const handleGenerateVideo = useCallback(async () => {
    const sourceImage = videoSourceImage || primaryImage;
    if (!sourceImage || videoDescription.trim().length === 0) {
      setVideoError("A source image and a video description are required to generate a video.");
      return;
    }
    
    setIsGeneratingVideo(true);
    resetVideoOutput();
    
    try {
      const url = await generateVideoAd(sourceImage, videoDescription, selectedVideoStyles);
      setGeneratedVideoUrl(url);
    } catch (e) {
      console.error(e);
      setVideoError(e instanceof Error ? e.message : "An unknown error occurred during video generation.");
    } finally {
      setIsGeneratingVideo(false);
    }
  }, [primaryImage, videoSourceImage, videoDescription, selectedVideoStyles]);

  const canGenerateImage = primaryImage !== null && description.trim() !== '' && selectedImageStyles.length > 0 && !isGeneratingImage && !isGeneratingVideo;
  const canGenerateVideo = (primaryImage !== null || videoSourceImage !== null) && videoDescription.trim() !== '' && !isGeneratingImage && !isGeneratingVideo;
  const currentVideoSource = videoSourceImage || primaryImage;

  return (
    <>
      <div className="w-full max-w-7xl mx-auto pb-24 sm:pb-0">
        <Header 
          title={<>AI Ad <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Creative</span> Generator</>}
          subtitle="Transform your product photos into stunning image and video ads with Gemini."
        />
        <div className="flex flex-col gap-8">
          {/* Top Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Inputs Card */}
            <div className="flex flex-col space-y-6 p-6 bg-[#161B22] border border-gray-800 rounded-2xl shadow-lg">
              <div>
                <h2 className="text-xl font-semibold text-gray-200 mb-3"><span className="text-cyan-400">1.</span> Upload Photos</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <ImageUploader
                    value={primaryImage}
                    onImageUpload={(file) => handleImageUpload(file, 'primary')}
                    onClear={() => handleClearImage('primary')}
                    label="Primary Product Photo*"
                  />
                  <ImageUploader
                    value={secondaryImage}
                    onImageUpload={(file) => handleImageUpload(file, 'secondary')}
                    onClear={() => handleClearImage('secondary')}
                    label="Context Image (Optional)"
                  />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-200 mb-3"><span className="text-cyan-400">2.</span> Describe Your Ad*</h2>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g., A refreshing drink for a hot summer day, highlighting its natural ingredients."
                  className="w-full h-24 p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
                  maxLength={200}
                  aria-required="true"
                />
                <p className="text-right text-xs text-gray-400 mt-1">{description.length} / 200</p>
              </div>
            </div>
            {/* Image Generation Card */}
            <div className="flex flex-col space-y-4 p-6 bg-[#161B22] border border-gray-800 rounded-2xl shadow-lg">
              <div>
                <h2 className="text-xl font-semibold text-gray-200 mb-3"><span className="text-cyan-400">3.</span> Generate Ad Image</h2>
                <p className="text-sm text-gray-400 mb-4">Choose up to 3 styles to apply to your ad image.</p>
                <StyleSelector
                  styles={IMAGE_STYLE_OPTIONS}
                  selectedStyles={selectedImageStyles}
                  onStyleToggle={handleImageStyleToggle}
                />
              </div>
              <div className="pt-2">
                <Button onClick={handleGenerateImage} disabled={!canGenerateImage}>
                  {isGeneratingImage ? 'Generating...' : '✨ Generate Ad Image'}
                </Button>
              </div>
              <div className="flex-grow flex flex-col">
                <GeneratedImage
                  isGenerating={isGeneratingImage}
                  imageUrl={generatedImage}
                  text={generatedText}
                  error={imageError}
                  onUseForVideo={handleSetVideoSource}
                />
              </div>
            </div>
          </div>
          
          {/* Bottom Row: Video Card */}
          <VideoGenerator
              isGenerating={isGeneratingVideo}
              videoUrl={generatedVideoUrl}
              error={videoError}
              videoDescription={videoDescription}
              onVideoDescriptionChange={setVideoDescription}
              selectedStyles={selectedVideoStyles}
              onStyleToggle={handleVideoStyleToggle}
              onGenerate={handleGenerateVideo}
              disabled={!canGenerateVideo}
              sourceImage={currentVideoSource}
              isCustomSource={!!videoSourceImage}
              onClearCustomSource={handleClearVideoSource}
            />
        </div>
      </div>
      {/* Mobile-only back button */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 p-4 bg-[#0D1117] border-t border-gray-800 z-10">
          <Button onClick={onBackToDashboard} variant="secondary">
              &larr; Back to Dashboard
          </Button>
      </div>
    </>
  );
};

export default AdGeneratorTool;