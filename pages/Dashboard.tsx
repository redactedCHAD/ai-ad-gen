import React, { useState, useMemo } from 'react';
import Header from '../components/Header';
import Button from '../components/Button';
import Modal from '../components/Modal';
import ToolCard from '../components/ToolCard';
import { MOCK_CALENDAR_EVENTS, PLATFORM_INFO, STATUS_INFO } from '../constants';
import type { CalendarEvent, Platform, Status, Tool } from '../types';

const CalendarHeader: React.FC<{
    currentDate: Date;
    onPrevMonth: () => void;
    onNextMonth: () => void;
    onToday: () => void;
}> = ({ currentDate, onPrevMonth, onNextMonth, onToday }) => (
    <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">
            {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
        </h2>
        <div className="flex items-center gap-2">
            <Button onClick={onToday} variant="secondary" className="w-auto py-2 px-3 text-sm">Today</Button>
            <button onClick={onPrevMonth} className="p-2 rounded-md bg-gray-800 hover:bg-gray-700 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg></button>
            <button onClick={onNextMonth} className="p-2 rounded-md bg-gray-800 hover:bg-gray-700 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg></button>
        </div>
    </div>
);

interface DashboardProps {
    onNavClick: (tool: Tool) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavClick }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState<CalendarEvent[]>(MOCK_CALENDAR_EVENTS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    const handleToday = () => setCurrentDate(new Date());

    const openAddModal = (date: Date) => {
        setSelectedDate(date);
        setIsModalOpen(true);
    };

    const calendarGrid = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const grid: (Date | null)[] = [];
        // Add padding days from previous month
        for (let i = 0; i < firstDayOfMonth; i++) {
            grid.push(null);
        }
        // Add days of the current month
        for (let i = 1; i <= daysInMonth; i++) {
            grid.push(new Date(year, month, i));
        }
        return grid;
    }, [currentDate]);

    const isSameDay = (d1: Date, d2: Date) => d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
    const today = new Date();

    return (
        <div className="w-full max-w-7xl mx-auto space-y-8">
            <Header
                title={<>Dashboard</>}
                subtitle="Your marketing command center. Create content and visualize your strategy."
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ToolCard 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" /></svg>}
                    title="Ad Creative Generator"
                    description="Transform product photos into stunning, styled ad images and videos using generative AI."
                    buttonText="Create Ad ✨"
                    onButtonClick={() => onNavClick('ad-generator')}
                />
                <ToolCard 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-400" viewBox="0 0 20 20" fill="currentColor"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" /></svg>}
                    title="Social Post Writer"
                    description="Generate engaging social media posts, from short tweets to full blog articles, in any tone."
                    buttonText="Write Post ✍️"
                    onButtonClick={() => onNavClick('social-posts')}
                />
            </div>

            <div className="p-6 bg-[#161B22] border border-gray-800 rounded-2xl shadow-lg">
                <CalendarHeader currentDate={currentDate} onPrevMonth={handlePrevMonth} onNextMonth={handleNextMonth} onToday={handleToday} />
                <div className="grid grid-cols-7 gap-px bg-gray-800 border border-gray-800 rounded-lg overflow-hidden">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="text-center text-xs font-semibold text-gray-400 py-3 bg-[#161B22]">
                            {day}
                        </div>
                    ))}
                    {calendarGrid.map((date, index) => {
                        const isToday = date && isSameDay(date, today);
                        const eventsForDay = date ? events.filter(e => isSameDay(e.date, date)) : [];
                        return (
                            <div
                                key={index}
                                onClick={() => date && openAddModal(date)}
                                className="relative bg-[#0D1117] min-h-[120px] p-2 flex flex-col group hover:bg-gray-800/50 transition-colors duration-200 cursor-pointer"
                            >
                                {date && (
                                    <>
                                        <time dateTime={date.toISOString()} className={`text-sm font-semibold ${isToday ? 'bg-cyan-500 text-white rounded-full flex items-center justify-center h-7 w-7' : 'text-gray-300'}`}>
                                            {date.getDate()}
                                        </time>
                                        <div className="flex-grow mt-1 space-y-1 overflow-y-auto">
                                            {eventsForDay.map(event => (
                                                <div key={event.id} className="text-xs p-1.5 rounded-md text-white/90" style={{backgroundColor: PLATFORM_INFO[event.platform].color}}>
                                                    <div className="flex items-center gap-1.5">
                                                        <span className={`h-2 w-2 rounded-full ${STATUS_INFO[event.status].color} flex-shrink-0`}></span>
                                                        <span className="truncate">{event.title}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <button onClick={(e) => { e.stopPropagation(); openAddModal(date); }} className="absolute top-2 right-2 h-6 w-6 rounded-full bg-cyan-600/50 text-white items-center justify-center opacity-0 group-hover:opacity-100 hidden sm:flex transition-opacity" aria-label="Add event">
                                           +
                                        </button>
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Add Post for ${selectedDate?.toLocaleDateString()}`}>
                <form className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                        <input type="text" id="title" placeholder="e.g., Weekly product update" className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-500" />
                    </div>
                    <div>
                        <label htmlFor="platform" className="block text-sm font-medium text-gray-300 mb-1">Platform</label>
                        <select id="platform" className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-500">
                           {Object.keys(PLATFORM_INFO).map(p => <option key={p}>{p}</option>)}
                        </select>
                    </div>
                     <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                        <select id="status" className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-500">
                           {Object.keys(STATUS_INFO).map(s => <option key={s}>{s}</option>)}
                        </select>
                    </div>
                    <div className="pt-2">
                        <Button type="button" onClick={() => setIsModalOpen(false)}>Save Post</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Dashboard;
