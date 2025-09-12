import React from 'react';
import Button from './Button';

interface ToolCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    buttonText: string;
    onButtonClick: () => void;
}

const ToolCard: React.FC<ToolCardProps> = ({ icon, title, description, buttonText, onButtonClick }) => {
    return (
        <div className="flex flex-col justify-between p-6 bg-[#161B22] border border-gray-800 rounded-2xl shadow-lg transition-all duration-300 hover:border-cyan-500/50 hover:shadow-cyan-500/10">
            <div>
                <div className="flex items-center gap-4 mb-3">
                    <div className="bg-gray-800 p-2 rounded-lg">
                        {icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-100">{title}</h3>
                </div>
                <p className="text-sm text-gray-400 mb-6">
                    {description}
                </p>
            </div>
            <Button onClick={onButtonClick} variant="secondary">
                {buttonText}
            </Button>
        </div>
    );
};

export default ToolCard;
