
import type { Platform, Status, CalendarEvent } from './types';

export const IMAGE_STYLE_OPTIONS: string[] = [
  'UGC',
  'Studio Quality',
  'Vibrant',
  'Minimalist',
  'Futuristic',
  'Earthy',
  'Luxury',
  'Playful'
];

export const VIDEO_STYLE_OPTIONS: string[] = [
  'Cinematic',
  'Dynamic',
  'Stop Motion',
  'Hyperlapse',
  'Product Focus',
  'Minimalist',
  'Surreal',
  'Vintage'
];

export const VIDEO_LOADING_MESSAGES: string[] = [
    'Initializing video generation engine...',
    'Scripting the first few scenes...',
    'Rendering high-resolution frames...',
    'This can take a few minutes. Great things are worth the wait!',
    'Applying visual effects and color grading...',
    'Almost there, compressing video for web...',
];

// Social Post Writer Constants
export const POST_TYPES = {
    LINKEDIN: 'LinkedIn Post',
    X: 'X (Twitter) Post',
    BLOG: 'Blog Post'
};

export const TONE_OPTIONS: string[] = [
    'Professional',
    'Casual',
    'Witty',
    'Persuasive',
    'Informative'
];

export const LENGTH_OPTIONS: string[] = [
    'Short',
    'Medium',
    'Long'
];

// Content Calendar Constants
export const PLATFORM_INFO: Record<Platform, { icon: string; color: string }> = {
    LinkedIn: { icon: '💼', color: 'bg-blue-500' },
    X: { icon: '🐦', color: 'bg-gray-400' },
    Blog: { icon: '📝', color: 'bg-orange-500' },
};

export const STATUS_INFO: Record<Status, { color: string }> = {
    Draft: { color: 'bg-gray-500' },
    Scheduled: { color: 'bg-yellow-500' },
    Published: { color: 'bg-green-500' },
};

export const MOCK_CALENDAR_EVENTS: CalendarEvent[] = (() => {
    const today = new Date();
    // FIX: Explicitly type the events array to ensure type compatibility with CalendarEvent.
    const events: CalendarEvent[] = [
        { id: 1, date: new Date(today.getFullYear(), today.getMonth(), 2), title: 'New Feature Announcement', platform: 'LinkedIn', status: 'Published' },
        { id: 2, date: new Date(today.getFullYear(), today.getMonth(), 2), title: 'Teaser for upcoming update', platform: 'X', status: 'Published' },
        { id: 3, date: new Date(today.getFullYear(), today.getMonth(), 8), title: 'Deep Dive: The Tech Behind Our AI', platform: 'Blog', status: 'Scheduled' },
        { id: 4, date: new Date(today.getFullYear(), today.getMonth(), 15), title: 'Weekly Roundup', platform: 'X', status: 'Scheduled' },
        { id: 5, date: new Date(today.getFullYear(), today.getMonth(), 15), title: 'Hiring: Senior Frontend Engineer', platform: 'LinkedIn', status: 'Scheduled' },
        { id: 6, date: new Date(today.getFullYear(), today.getMonth(), 21), title: 'Case Study: How Company X Increased ROI', platform: 'Blog', status: 'Draft' },
        { id: 7, date: new Date(today.getFullYear(), today.getMonth(), 28), title: 'Next month preview', platform: 'X', status: 'Draft' },
    ];
    // Add an event for today
    events.push({ id: 8, date: today, title: 'Live Q&A Session Today!', platform: 'LinkedIn', status: 'Published' });
    return events;
})();
