import React from "react";

interface VopIconProps {
  name: string;
  size?: number;
  className?: string;
}

const icons: Record<string, React.ReactNode> = {
  "shield-alert": (
    <g>
      <path d="M12 2l8 4v6c0 5.25-3.4 10.1-8 12-4.6-1.9-8-6.75-8-12V6l8-4z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <line x1="12" y1="8" x2="12" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="12" cy="16" r="1" fill="currentColor"/>
    </g>
  ),
  "triangle-alert": (
    <g>
      <path d="M12 3L2 21h20L12 3z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <line x1="12" y1="10" x2="12" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="12" cy="18" r="1" fill="currentColor"/>
    </g>
  ),
  "circle-info": (
    <g>
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="12" y1="11" x2="12" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="12" cy="8" r="1" fill="currentColor"/>
    </g>
  ),
  "star-diamond": (
    <g>
      <path d="M12 2l2.5 7.5H22l-6 4.5 2.5 7.5L12 17l-6.5 4.5L8 14 2 9.5h7.5L12 2z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    </g>
  ),
  "circle-check": (
    <g>
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <polyline points="8,12 11,15 16,9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
  ),
  "circle-x": (
    <g>
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </g>
  ),
  "question-circle": (
    <g>
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M9.5 9.5a2.5 2.5 0 0 1 4.8.8c0 1.7-2.3 2.2-2.3 3.7" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="12" cy="17" r="0.8" fill="currentColor"/>
    </g>
  ),
  cart: (
    <g>
      <path d="M6 6h15l-1.5 9H7.5L6 6z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <line x1="6" y1="6" x2="4" y2="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="9" cy="19" r="1.5" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="18" cy="19" r="1.5" fill="none" stroke="currentColor" strokeWidth="1.5"/>
    </g>
  ),
  store: (
    <g>
      <path d="M3 10V20h18V10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M3 10l1.5-6h15l1.5 6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M3 10c0 1.7 1.3 3 3 3s3-1.3 3-3" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M9 10c0 1.7 1.3 3 3 3s3-1.3 3-3" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M15 10c0 1.7 1.3 3 3 3s3-1.3 3-3" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="9" y="14" width="6" height="6" fill="none" stroke="currentColor" strokeWidth="1.5"/>
    </g>
  ),
  "refresh-circle": (
    <g>
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M16 8l-1.5 3h3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14.5 11A3.5 3.5 0 1 1 8.2 9.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M8 16l1.5-3h-3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9.5 13a3.5 3.5 0 1 1 6.3 1.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </g>
  ),
  ticket: (
    <g>
      <path d="M3 7h18v3a2 2 0 0 0 0 4v3H3v-3a2 2 0 0 0 0-4V7z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <line x1="9" y1="7" x2="9" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="9" y1="15" x2="9" y2="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="9" y1="11" x2="9" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </g>
  ),
  plane: (
    <g>
      <path d="M21 3L10 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M21 3l-7 18-3-7-7-3 18-7z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    </g>
  ),
  bowl: (
    <g>
      <path d="M3 14c0 3.3 4 6 9 6s9-2.7 9-6H3z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <line x1="3" y1="14" x2="21" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M8 9c0-1.5 1-2 0-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M12 9c0-1.5 1-2 0-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M16 9c0-1.5 1-2 0-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </g>
  ),
  train: (
    <g>
      <rect x="5" y="3" width="14" height="14" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="5" y1="11" x2="19" y2="11" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="12" y1="3" x2="12" y2="11" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="8.5" cy="14" r="1" fill="currentColor"/>
      <circle cx="15.5" cy="14" r="1" fill="currentColor"/>
      <line x1="7" y1="17" x2="5" y2="21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="17" y1="17" x2="19" y2="21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </g>
  ),
  "download-circle": (
    <g>
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="12" y1="7" x2="12" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <polyline points="8,13 12,17 16,13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
  ),
  pill: (
    <g>
      <rect x="6" y="2" width="12" height="20" rx="6" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="6" y1="12" x2="18" y2="12" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="12" cy="7" r="1" fill="currentColor"/>
    </g>
  ),
  "badge-ok": (
    <g>
      <path d="M12 2l8 4v6c0 5.25-3.4 10.1-8 12-4.6-1.9-8-6.75-8-12V6l8-4z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <polyline points="8.5,12 11,14.5 15.5,9.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
  ),
  "badge-warn": (
    <g>
      <path d="M12 2l8 4v6c0 5.25-3.4 10.1-8 12-4.6-1.9-8-6.75-8-12V6l8-4z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <line x1="12" y1="8.5" x2="12" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="12" cy="15.5" r="1" fill="currentColor"/>
    </g>
  ),
  "badge-risk": (
    <g>
      <path d="M12 2l8 4v6c0 5.25-3.4 10.1-8 12-4.6-1.9-8-6.75-8-12V6l8-4z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <line x1="9.5" y1="9.5" x2="14.5" y2="14.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="14.5" y1="9.5" x2="9.5" y2="14.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </g>
  ),
  // Section icons
  "seller": (
    <g>
      <circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </g>
  ),
  "return-box": (
    <g>
      <path d="M3 7l9-4 9 4v10l-9 4-9-4V7z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <polyline points="3,7 12,11 21,7" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <line x1="12" y1="11" x2="12" y2="21" stroke="currentColor" strokeWidth="1.5"/>
    </g>
  ),
  wrench: (
    <g>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.3-3.3c.6 1.2.8 2.6.4 4-.7 2.4-2.8 4-5.3 4-0.7 0-1.4-.1-2-.3L7.7 20.1a2 2 0 0 1-2.8 0l-0.8-.8a2 2 0 0 1 0-2.8l6.4-6.4c-.2-.6-.3-1.3-.3-2 0-2.5 1.6-4.6 4-5.3 1.4-.4 2.8-.2 4 .4L14.7 6.3z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    </g>
  ),
  "credit-card": (
    <g>
      <rect x="2" y="5" width="20" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="2" y1="10" x2="22" y2="10" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="6" y1="14" x2="10" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </g>
  ),
  truck: (
    <g>
      <path d="M1 3h15v13H1z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M16 8h4l3 4v4h-7V8z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <circle cx="5.5" cy="18.5" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="18.5" cy="18.5" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.5"/>
    </g>
  ),
  "x-circle": (
    <g>
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </g>
  ),
  shield: (
    <g>
      <path d="M12 2l8 4v6c0 5.25-3.4 10.1-8 12-4.6-1.9-8-6.75-8-12V6l8-4z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    </g>
  ),
  key: (
    <g>
      <circle cx="8" cy="15" r="5" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="12" y1="11" x2="21" y2="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="18" y1="5" x2="21" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </g>
  ),
  "calendar-x": (
    <g>
      <rect x="3" y="4" width="18" height="18" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="9" y1="14" x2="15" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="15" y1="14" x2="9" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </g>
  ),
  "shield-check": (
    <g>
      <path d="M12 2l8 4v6c0 5.25-3.4 10.1-8 12-4.6-1.9-8-6.75-8-12V6l8-4z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <polyline points="8.5,12 11,14.5 15.5,9.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
  ),
  utensils: (
    <g>
      <line x1="7" y1="2" x2="7" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="7" y1="13" x2="7" y2="22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M4 2v5c0 2.2 1.3 3 3 3s3-.8 3-3V2" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M17 2c0 0 0 5-0.5 8s-2.5 3-2.5 3v9" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M20 2c0 0 0 5 0.5 8s-2.5 3-2.5 3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
  ),
  "file-text": (
    <g>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <polyline points="14,2 14,8 20,8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <line x1="8" y1="13" x2="16" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="8" y1="17" x2="14" y2="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </g>
  ),
  "chevron-down": (
    <g>
      <polyline points="6,9 12,15 18,9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
  ),
  "chevron-up": (
    <g>
      <polyline points="6,15 12,9 18,15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
  ),
};

export const VopIcon: React.FC<VopIconProps> = ({ name, size = 24, className = "" }) => {
  const iconContent = icons[name];
  if (!iconContent) return null;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      fill="none"
      aria-hidden="true"
    >
      {iconContent}
    </svg>
  );
};
