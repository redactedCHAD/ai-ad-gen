import React from 'react';
import ToolLinkCard from '../components/ToolLinkCard';
import PromoCard from '../components/PromoCard';
import { POST_TYPES } from '../constants';
import type { Tool } from '../types';

// Icons for the ToolLinkCards
const ImageIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" /></svg>;
const VideoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 001.553.832l3-2a1 1 0 000-1.664l-3-2z" /></svg>;
const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zm0 14a1 1 0 00-1 1v1a1 1 0 002 0v-1a1 1 0 00-1-1zm10-14a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zm0 14a1 1 0 00-1 1v1a1 1 0 002 0v-1a1 1 0 00-1-1zM9 5a1 1 0 00-1 1v8a1 1 0 002 0V6a1 1 0 00-1-1zm2-3a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zm-4 9a1 1 0 00-1 1v1a1 1 0 002 0v-1a1 1 0 00-1-1zm8-1a1 1 0 00-1 1v1a1 1 0 002 0v-1a1 1 0 00-1-1z" clipRule="evenodd" /></svg>;
const XLogo = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="w-5 h-5" viewBox="0 0 16 16"><path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.6.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z"/></svg>;
const LinkedInLogo = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="w-5 h-5" viewBox="0 0 16 16"><path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/></svg>;
const InstagramLogo = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="w-5 h-5" viewBox="0 0 16 16"><path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.703.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 8 0zm0 1.442c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.282.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.282.11-.705.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.231 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.275-1.486.145-.373.319-.64.599-.92.28-.28.546.453.92-.598.282-.11.705.24 1.485-.276.843-.038 1.096-.047 3.232-.047zM8 4.658a3.342 3.342 0 1 0 0 6.684 3.342 3.342 0 0 0 0-6.684zm0 5.432a2.09 2.09 0 1 1 0-4.18 2.09 2.09 0 0 1 0 4.18zm4.35-4.748a.938.938 0 1 1-1.876 0 .938.938 0 0 1 1.876 0z"/></svg>;
const ChatIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM9 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 10-2 0 1 1 0 002 0zm-7 4a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>;
const DocumentIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" /></svg>;
const KeyboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 8a2 2 0 00-2-2H4a2 2 0 00-2 2v4a2 2 0 002 2h12a2 2 0 002-2V8zM5 10a1 1 0 100 2h1a1 1 0 100-2H5zM8 10a1 1 0 100 2h1a1 1 0 100-2H8zM12 10a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" /></svg>;

const HeroIllustration: React.FC = () => (
    <div className="absolute inset-x-0 top-0 -z-10 opacity-20 dark:opacity-20 transform-gpu overflow-hidden blur-3xl" aria-hidden="true">
        <div 
            className="relative left-1/2 -translate-x-1/2 aspect-[1.7] w-[80rem] bg-gradient-to-tr from-[#2dd4bf] to-[#0ea5e9]" 
            style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}
        />
    </div>
);

// Icons for PromoCards
const SparklesIconLarge = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-800 dark:text-gray-300" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zm0 14a1 1 0 00-1 1v1a1 1 0 002 0v-1a1 1 0 00-1-1zm10-14a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zm0 14a1 1 0 00-1 1v1a1 1 0 002 0v-1a1 1 0 00-1-1zM9 5a1 1 0 00-1 1v8a1 1 0 002 0V6a1 1 0 00-1-1zm2-3a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zm-4 9a1 1 0 00-1 1v1a1 1 0 002 0v-1a1 1 0 00-1-1zm8-1a1 1 0 00-1 1v1a1 1 0 002 0v-1a1 1 0 00-1-1z" clipRule="evenodd" /></svg>;
const DocumentIconLarge = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-800 dark:text-gray-300" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" /></svg>;
const ResearchIconSmall = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>;
const PenIconSmall = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>;

// Small Platform Icons for PromoCards
const XLogoSmall = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="w-4 h-4" viewBox="0 0 16 16"><path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.6.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z"/></svg>;
const LinkedInLogoSmall = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="w-4 h-4" viewBox="0 0 16 16"><path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/></svg>;
const InstagramLogoSmall = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="w-4 h-4" viewBox="0 0 16 16"><path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.703.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 8 0zm0 1.442c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.282.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.282.11-.705.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.231 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.275-1.486.145-.373.319-.64.599-.92.28-.28.546.453.92-.598.282-.11.705.24 1.485-.276.843-.038 1.096-.047 3.232-.047zM8 4.658a3.342 3.342 0 1 0 0 6.684 3.342 3.342 0 0 0 0-6.684zm0 5.432a2.09 2.09 0 1 1 0-4.18 2.09 2.09 0 0 1 0 4.18zm4.35-4.748a.938.938 0 1 1-1.876 0 .938.938 0 0 1 1.876 0z"/></svg>;
const DocumentIconSmall = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" /></svg>;

const PlatformIcon: React.FC<{ bgColor: string; children: React.ReactNode }> = ({ bgColor, children }) => (
    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white ${bgColor}`}>{children}</div>
);

interface DashboardProps {
    onNavClick: (tool: Tool, options?: { postType: string }) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavClick }) => {
    
    const adPlatformIcons = [
        <PlatformIcon key="x" bgColor="bg-gray-900"><XLogoSmall /></PlatformIcon>,
        <PlatformIcon key="insta" bgColor="bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500"><InstagramLogoSmall /></PlatformIcon>,
        <PlatformIcon key="linkedin" bgColor="bg-blue-600"><LinkedInLogoSmall /></PlatformIcon>,
    ];

    const contentPlatformIcons = [
        ...adPlatformIcons,
        <PlatformIcon key="blog" bgColor="bg-orange-600"><DocumentIconSmall /></PlatformIcon>,
    ];
    
    return (
        <div className="w-full max-w-7xl mx-auto space-y-12 relative isolate">
            <HeroIllustration />
            <div className="text-center pt-8">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
                    Content Koala <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Marketing Suite</span>
                </h1>
                <p className="mt-6 text-lg max-w-2xl mx-auto text-gray-500 dark:text-gray-400">
                    Your command center for creating stunning ad creatives and compelling social media content. Let's build something amazing.
                </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
                <ToolLinkCard 
                    icons={[<SparklesIcon />, <ImageIcon />, <VideoIcon />]}
                    title="Ad Creative Generator"
                    colorClasses="text-white bg-cyan-600 hover:bg-cyan-500 focus:ring-cyan-400"
                    onClick={() => onNavClick('ad-generator')}
                />
                 <ToolLinkCard 
                    icons={[<XLogo />, <ChatIcon />]}
                    title="Generate X Post"
                    colorClasses="bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                    onClick={() => onNavClick('social-posts', { postType: POST_TYPES.X })}
                />
                 <ToolLinkCard 
                    icons={[<XLogo />, <ImageIcon />]}
                    title="Generate X Image"
                    colorClasses="bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                    onClick={() => onNavClick('ad-generator')}
                />
                <ToolLinkCard 
                    icons={[<XLogo />, <VideoIcon />]}
                    title="Generate X Video"
                    colorClasses="bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                    onClick={() => onNavClick('ad-generator')}
                />
                <ToolLinkCard 
                    icons={[<InstagramLogo />, <ChatIcon />]}
                    title="Generate Instagram Post"
                    colorClasses="text-white bg-fuchsia-700 hover:bg-fuchsia-600 focus:ring-fuchsia-500"
                    onClick={() => onNavClick('social-posts', { postType: POST_TYPES.INSTAGRAM })}
                />
                <ToolLinkCard 
                    icons={[<InstagramLogo />, <ImageIcon />]}
                    title="Generate Instagram Image"
                    colorClasses="text-white bg-fuchsia-700 hover:bg-fuchsia-600 focus:ring-fuchsia-500"
                    onClick={() => onNavClick('ad-generator')}
                />
                <ToolLinkCard 
                    icons={[<InstagramLogo />, <VideoIcon />]}
                    title="Generate Reels Video"
                    colorClasses="text-white bg-fuchsia-700 hover:bg-fuchsia-600 focus:ring-fuchsia-500"
                    onClick={() => onNavClick('ad-generator')}
                />
                <ToolLinkCard 
                    icons={[<LinkedInLogo />, <ChatIcon />]}
                    title="Generate LinkedIn Post"
                    colorClasses="text-white bg-blue-700 hover:bg-blue-600 focus:ring-blue-500"
                    onClick={() => onNavClick('social-posts', { postType: POST_TYPES.LINKEDIN })}
                />
                 <ToolLinkCard 
                    icons={[<DocumentIcon />, <KeyboardIcon />]}
                    title="Write a Blog Post"
                    colorClasses="text-white bg-orange-600 hover:bg-orange-500 focus:ring-orange-500"
                    onClick={() => onNavClick('social-posts', { postType: POST_TYPES.BLOG })}
                />
            </div>

            <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
                <PromoCard 
                    tag="CREATIVE TOOL"
                    icon={<SparklesIconLarge />}
                    title="Generate High-Performance Ad Creatives"
                    description="Transform your product photos into professional-grade image and video ads. Perfect for social media, marketing campaigns, and e-commerce."
                    buttonContent={<><ResearchIconSmall /> Generate Ads</>}
                    onButtonClick={() => onNavClick('ad-generator')}
                    platformIcons={adPlatformIcons}
                />
                <PromoCard
                    tag="CONTENT TOOL"
                    icon={<DocumentIconLarge />}
                    title="Write Engaging Social Media Content"
                    description="From viral X posts to in-depth blog articles, generate compelling content in seconds. Just provide a topic or URL and let our AI do the rest."
                    buttonContent={<><PenIconSmall /> Write Posts</>}
                    onButtonClick={() => onNavClick('social-posts')}
                    platformIcons={contentPlatformIcons}
                />
            </div>
        </div>
    );
};

export default Dashboard;