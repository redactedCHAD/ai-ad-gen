import React, { useState, useCallback } from 'react';
import Header from '../components/Header';
import Button from '../components/Button';
import Spinner from '../components/Spinner';
import { generateSocialPost, generateBlogHeroImage } from '../services/geminiService';
import { POST_TYPES, TONE_OPTIONS, LENGTH_OPTIONS } from '../constants';

type InputType = 'topic' | 'url';

interface SocialPostWriterToolProps {
    onBackToDashboard: () => void;
}

const XLogo: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="w-4 h-4" viewBox="0 0 16 16">
        <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.6.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z"/>
    </svg>
);

const LinkedInLogo: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="w-4 h-4" viewBox="0 0 16 16">
        <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>
    </svg>
);


const OptionButton: React.FC<{
    label: string;
    isSelected: boolean;
    onClick: () => void;
}> = ({ label, isSelected, onClick }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2.5 rounded-lg text-sm font-semibold text-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500
            ${isSelected
                ? 'bg-cyan-500 text-white shadow-md'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
    >
        {label}
    </button>
);

const SocialPostWriterTool: React.FC<SocialPostWriterToolProps> = ({ onBackToDashboard }) => {
    const [inputType, setInputType] = useState<InputType>('topic');
    const [inputValue, setInputValue] = useState('');
    const [postType, setPostType] = useState<string>(POST_TYPES.LINKEDIN);
    const [tone, setTone] = useState<string>(TONE_OPTIONS[0]);
    const [length, setLength] = useState<string>(LENGTH_OPTIONS[1]);
    
    const [generatedContent, setGeneratedContent] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [heroImageUrl, setHeroImageUrl] = useState<string | null>(null);
    const [isGeneratingHeroImage, setIsGeneratingHeroImage] = useState(false);
    const [heroImageError, setHeroImageError] = useState<string | null>(null);

    const [copied, setCopied] = useState(false);

    const handleGenerate = useCallback(async () => {
        if (inputValue.trim() === '') {
            setError('Please enter a topic or URL.');
            return;
        }

        setIsGenerating(true);
        setError(null);
        setGeneratedContent('');
        setHeroImageUrl(null);
        setHeroImageError(null);

        try {
            const result = await generateSocialPost({
                inputType,
                inputValue,
                postType,
                tone,
                length
            });
            setGeneratedContent(result);
        } catch (e) {
            console.error(e);
            setError(e instanceof Error ? e.message : 'An unknown error occurred.');
        } finally {
            setIsGenerating(false);
        }
    }, [inputType, inputValue, postType, tone, length]);

    const handleGenerateHeroImage = useCallback(async () => {
        if (!generatedContent) return;
    
        setIsGeneratingHeroImage(true);
        setHeroImageError(null);
        
        try {
            const imageUrl = await generateBlogHeroImage(generatedContent);
            setHeroImageUrl(imageUrl);
        } catch (e) {
            console.error(e);
            setHeroImageError(e instanceof Error ? e.message : 'An unknown error occurred while generating the hero image.');
        } finally {
            setIsGeneratingHeroImage(false);
        }
    }, [generatedContent]);
    
    const handleCopy = () => {
        if(generatedContent) {
            navigator.clipboard.writeText(generatedContent);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleShareToX = useCallback(() => {
        if (!generatedContent) return;
        const tweetText = generatedContent.length > 275 
            ? generatedContent.substring(0, 275) + '...'
            : generatedContent;
        const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
        window.open(tweetUrl, '_blank', 'noopener,noreferrer');
    }, [generatedContent]);

    const handleShareToLinkedIn = useCallback(() => {
        if (!generatedContent) return;
        navigator.clipboard.writeText(generatedContent);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        // There's no reliable way to pre-fill LinkedIn posts, so we copy the text and open the feed.
        window.open('https://www.linkedin.com/feed/', '_blank', 'noopener,noreferrer');
    }, [generatedContent]);

    const isGenerateDisabled = inputValue.trim() === '' || isGenerating;
    
    const renderOutput = () => {
        if (isGenerating) {
            return (
                <div className="text-center">
                    <Spinner />
                    <p className="mt-4 text-cyan-400">Crafting your social post...</p>
                </div>
            );
        }
        
        if(error) {
            return (
                <div className="text-center text-red-400 bg-red-900/50 p-4 rounded-lg">
                    <h3 className="font-bold">Generation Failed</h3>
                    <p className="mt-2 text-sm">{error}</p>
                </div>
            );
        }

        if (generatedContent) {
            return (
                <div className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap w-full">{generatedContent}</div>
            );
        }
        
        // Don't show placeholder if image is being generated or exists
        if (isGeneratingHeroImage || heroImageUrl) return null;

        return (
            <div className="text-center text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
                </svg>
                <p className="mt-4">Your generated post will appear here.</p>
            </div>
        );
    };

    return (
        <>
            <div className="w-full max-w-7xl mx-auto pb-24 sm:pb-0">
                <Header 
                    title={<>Social Post <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Writer</span></>}
                    subtitle="Generate engaging content for your social media platforms in seconds."
                />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Side: Inputs */}
                    <div className="flex flex-col space-y-6 p-6 bg-[#161B22] border border-gray-800 rounded-2xl shadow-lg">
                        {/* Input Type */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-200 mb-3"><span className="text-cyan-400">1.</span> Provide Context</h2>
                            <div className="flex space-x-2 rounded-lg bg-gray-800 p-1">
                                <button onClick={() => setInputType('topic')} className={`w-full py-2 text-sm font-medium rounded-md transition-colors ${inputType === 'topic' ? 'bg-cyan-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>Subject / Topic</button>
                                <button onClick={() => setInputType('url')} className={`w-full py-2 text-sm font-medium rounded-md transition-colors ${inputType === 'url' ? 'bg-cyan-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>URL (Website/Video)</button>
                            </div>
                            {inputType === 'topic' ? (
                                <textarea
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="e.g., The benefits of using our new productivity app for small teams."
                                    className="mt-3 w-full h-28 p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
                                />
                            ) : (
                                <input
                                    type="url"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="e.g., https://my-awesome-product.com/features"
                                    className="mt-3 w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
                                />
                            )}
                        </div>
                        {/* Platform */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-200 mb-3"><span className="text-cyan-400">2.</span> Choose Platform</h2>
                            <div className="grid grid-cols-3 gap-3">
                                {Object.values(POST_TYPES).map(type => (
                                    <OptionButton key={type} label={type} isSelected={postType === type} onClick={() => setPostType(type)} />
                                ))}
                            </div>
                        </div>
                         {/* Attributes */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-200 mb-3"><span className="text-cyan-400">3.</span> Set Attributes</h2>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-medium text-gray-400 mb-2 text-sm">Tone of Voice</h3>
                                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                                        {TONE_OPTIONS.map(opt => <OptionButton key={opt} label={opt} isSelected={tone === opt} onClick={() => setTone(opt)} />)}
                                    </div>
                                </div>
                                 <div>
                                    <h3 className="font-medium text-gray-400 mb-2 text-sm">Length</h3>
                                    <div className="grid grid-cols-3 gap-2">
                                        {LENGTH_OPTIONS.map(opt => <OptionButton key={opt} label={opt} isSelected={length === opt} onClick={() => setLength(opt)} />)}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Generate Button */}
                        <div className="pt-4">
                            <Button onClick={handleGenerate} disabled={isGenerateDisabled}>
                                {isGenerating ? 'Generating...' : '✍️ Generate Post'}
                            </Button>
                        </div>
                    </div>
                    {/* Right Side: Output */}
                    <div className="flex flex-col space-y-4 p-6 bg-[#161B22] border border-gray-800 rounded-2xl shadow-lg">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <h2 className="text-xl font-semibold text-gray-200 shrink-0">Generated Content</h2>
                            <div className="flex flex-wrap items-center gap-2">
                                {postType === POST_TYPES.BLOG && generatedContent && !isGenerating && (
                                    <Button
                                        onClick={handleGenerateHeroImage}
                                        disabled={isGeneratingHeroImage || isGenerating}
                                        variant="secondary"
                                        className="w-auto py-2 px-3 text-sm"
                                    >
                                        {isGeneratingHeroImage ? 'Generating...' : '🖼️ Generate Hero Image'}
                                    </Button>
                                )}
                                <Button onClick={handleCopy} disabled={!generatedContent || isGenerating} variant="secondary" className="w-auto py-2 px-3 text-sm">
                                    {copied ? 'Copied!' : '📋 Copy Text'}
                                </Button>
                                <Button onClick={handleShareToX} disabled={!generatedContent || isGenerating} variant="secondary" className="w-auto py-2 px-3 text-sm flex items-center gap-1.5">
                                    <XLogo />
                                    Share on X
                                </Button>
                                <Button onClick={handleShareToLinkedIn} disabled={!generatedContent || isGenerating} variant="secondary" className="w-auto py-2 px-3 text-sm flex items-center gap-1.5">
                                    <LinkedInLogo />
                                    Share on LinkedIn
                                </Button>
                            </div>
                        </div>
                        <div className="flex-grow w-full flex flex-col items-stretch justify-start bg-black/20 rounded-lg p-4 min-h-[400px] overflow-y-auto space-y-4">
                            {/* Hero Image Section */}
                            {isGeneratingHeroImage && (
                                <div className="text-center">
                                    <Spinner />
                                    <p className="mt-4 text-cyan-400">Generating hero image...</p>
                                </div>
                            )}
                            {heroImageError && (
                                <div className="text-center text-red-400 bg-red-900/50 p-4 rounded-lg">
                                    <h3 className="font-bold">Image Generation Failed</h3>
                                    <p className="mt-2 text-sm">{heroImageError}</p>
                                </div>
                            )}
                            {heroImageUrl && (
                                <img src={heroImageUrl} alt="Generated blog hero" className="w-full rounded-lg shadow-lg" />
                            )}
                            
                            {/* Text Section */}
                            <div className={`w-full flex-grow flex items-center justify-center`}>
                                {renderOutput()}
                            </div>
                        </div>
                    </div>
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

export default SocialPostWriterTool;