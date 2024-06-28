import React from 'react';

interface IconProps {
    size?: 'sm' | 'md' | 'lg' | 'xl' | number;
    color?: string;
}

const iconSizes: Record<string, number> = {
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48,
};

export const EraserIcon: React.FC<IconProps> = ({ size = 'md', color = 'white' }) => {
    const iconSize = typeof size === 'number' ? size : iconSizes[size] || 24;

    return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.0002 21.0002L21.3002 12.7002C22.3002 11.8002 22.3002 10.3002 21.3002 9.3002L15.7002 3.7002C14.8002 2.7002 13.3002 2.7002 12.3002 3.7002L2.7002 13.3002C1.7002 14.2002 1.7002 15.7002 2.7002 16.7002L7.0002 21.0002H22.0002" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M5.0002 11.0002L14.0002 20.0002" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M5.4075 3.92583L4.66667 2L3.92583 3.92583L2 4.66667L3.92583 5.4075L4.66667 7.33333L5.4075 5.4075L7.33333 4.66667L5.4075 3.92583Z" stroke={color} strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );
};

export const RedoIcon: React.FC<IconProps> = ({ size = 'md', color = 'white' }) => {
    const iconSize = typeof size === 'number' ? size : iconSizes[size] || 24;

    return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.7333 13.5333L20 9.26667M20 9.26667L15.7333 5M20 9.26667H8.26667C7.13508 9.26667 6.04983 9.71619 5.24968 10.5163C4.44952 11.3165 4 12.4017 4 13.5333C4 14.6649 4.44952 15.7502 5.24968 16.5503C6.04983 17.3505 7.13508 17.8 8.26667 17.8H9.33333" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );
};

export const UndoIcon: React.FC<IconProps> = ({ size = 'md', color = 'white' }) => {
    const iconSize = typeof size === 'number' ? size : iconSizes[size] || 24;

    return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.26667 14.5333L4 10.2667M4 10.2667L8.26667 6M4 10.2667H15.7333C16.8649 10.2667 17.9502 10.7162 18.7503 11.5163C19.5505 12.3165 20 13.4017 20 14.5333C20 15.6649 19.5505 16.7502 18.7503 17.5503C17.9502 18.3505 16.8649 18.8 15.7333 18.8H14.6667" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );
};