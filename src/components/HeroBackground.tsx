import { useEffect, useState, useRef } from "react";

interface FloatingIconProps {
  children: React.ReactNode;
  className?: string;
  animated?: boolean;
  delay?: number;
}

const FloatingIcon = ({
  children,
  className = "",
  animated = false,
  delay = 0,
}: FloatingIconProps) => (
  <div
    className={`absolute text-primary/[0.15] dark:text-primary/[0.15] select-none pointer-events-none ${animated ? "animate-icon-fall" : ""} ${className}`}
    style={animated ? { animationDelay: `${delay}s` } : undefined}
  >
    {children}
  </div>
);

// Simple SVG icons as inline components
const ScaleIcon = ({ size = 40 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3v19M5 8l7-5 7 5M5 8l-2 8h4M19 8l2 8h-4M3 16a3 3 0 0 0 3 0M18 16a3 3 0 0 0 3 0" />
  </svg>
);

const ShieldIcon = ({ size = 40 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

const DocIcon = ({ size = 40 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6M8 13h8M8 17h8M8 9h2" />
  </svg>
);

const CheckCircleIcon = ({ size = 40 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

const GavelIcon = ({ size = 40 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 3.5l6 6M4 20l6-6M8.5 8.5l7 7M2 22l2-2M14 4l6 6" />
  </svg>
);

const ParagraphSymbol = ({ size = 40 }: { size?: number }) => (
  <span
    style={{ fontSize: size, lineHeight: 1 }}
    className="font-serif font-bold"
  >
    §
  </span>
);

// Static positioned icons (for idle & results)
const StaticIcons = () => (
  <>
    <FloatingIcon className="top-[8%] left-[5%] rotate-[-15deg]">
      <ShieldIcon size={48} />
    </FloatingIcon>
    <FloatingIcon className="top-[15%] left-[18%] rotate-[10deg]">
      <ParagraphSymbol size={32} />
    </FloatingIcon>
    <FloatingIcon className="top-[5%] right-[8%] rotate-[12deg]">
      <ScaleIcon size={52} />
    </FloatingIcon>
    <FloatingIcon className="top-[18%] right-[22%] rotate-[-8deg]">
      <DocIcon size={36} />
    </FloatingIcon>
    <FloatingIcon className="top-[40%] left-[3%] rotate-[20deg]">
      <DocIcon size={44} />
    </FloatingIcon>
    <FloatingIcon className="top-[55%] left-[12%] rotate-[-5deg]">
      <ParagraphSymbol size={28} />
    </FloatingIcon>
    <FloatingIcon className="top-[38%] right-[4%] rotate-[-18deg]">
      <CheckCircleIcon size={40} />
    </FloatingIcon>
    <FloatingIcon className="top-[52%] right-[15%] rotate-[8deg]">
      <ParagraphSymbol size={24} />
    </FloatingIcon>
    <FloatingIcon className="bottom-[12%] left-[10%] rotate-[15deg]">
      <GavelIcon size={38} />
    </FloatingIcon>
    <FloatingIcon className="bottom-[8%] left-[30%] rotate-[-12deg]">
      <ParagraphSymbol size={36} />
    </FloatingIcon>
    <FloatingIcon className="bottom-[15%] right-[8%] rotate-[22deg]">
      <ShieldIcon size={42} />
    </FloatingIcon>
    <FloatingIcon className="bottom-[5%] right-[25%] rotate-[-10deg]">
      <ScaleIcon size={34} />
    </FloatingIcon>
    <FloatingIcon className="top-[28%] left-[35%] rotate-[5deg]">
      <ParagraphSymbol size={20} />
    </FloatingIcon>
    <FloatingIcon className="top-[65%] right-[35%] rotate-[-15deg]">
      <ParagraphSymbol size={22} />
    </FloatingIcon>
    <FloatingIcon className="top-[75%] left-[45%] rotate-[10deg]">
      <ParagraphSymbol size={18} />
    </FloatingIcon>
  </>
);

// Falling icons configuration for loading animation
const fallingIcons = [
  { Icon: ParagraphSymbol, size: 28, left: "8%", delay: 0, rotate: 15 },
  { Icon: ShieldIcon, size: 36, left: "20%", delay: 1.2, rotate: -10 },
  { Icon: ParagraphSymbol, size: 22, left: "35%", delay: 0.5, rotate: 25 },
  { Icon: ScaleIcon, size: 32, left: "50%", delay: 2.0, rotate: -20 },
  { Icon: DocIcon, size: 30, left: "65%", delay: 0.8, rotate: 12 },
  { Icon: ParagraphSymbol, size: 26, left: "78%", delay: 1.6, rotate: -8 },
  { Icon: CheckCircleIcon, size: 28, left: "90%", delay: 2.5, rotate: 18 },
  { Icon: ParagraphSymbol, size: 20, left: "15%", delay: 3.0, rotate: -15 },
  { Icon: GavelIcon, size: 34, left: "42%", delay: 3.5, rotate: 10 },
  { Icon: ParagraphSymbol, size: 24, left: "72%", delay: 4.0, rotate: -22 },
  { Icon: ShieldIcon, size: 30, left: "55%", delay: 4.5, rotate: 5 },
  { Icon: ParagraphSymbol, size: 18, left: "28%", delay: 5.0, rotate: -12 },
];

const FallingIcons = () => (
  <>
    {fallingIcons.map((item, i) => (
      <div
        key={i}
        className="absolute animate-icon-fall text-primary/[0.15] dark:text-primary/[0.15] select-none pointer-events-none"
        style={{
          left: item.left,
          top: "-60px",
          animationDelay: `${item.delay}s`,
          transform: `rotate(${item.rotate}deg)`,
        }}
      >
        <item.Icon size={item.size} />
      </div>
    ))}
  </>
);

interface HeroBackgroundProps {
  animated?: boolean;
}

export const HeroBackground = ({ animated = false }: HeroBackgroundProps) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.10] via-background to-primary/[0.06] dark:from-primary/[0.12] dark:via-background dark:to-primary/[0.08]" />
      {/* Radial teal glow — stronger in light mode */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-primary/[0.12] dark:bg-primary/[0.10] rounded-full blur-3xl" />
      {/* Corner vignettes */}
      <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-to-br from-primary/[0.10] to-transparent dark:from-primary/[0.08] dark:to-transparent" />
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-primary/[0.10] to-transparent dark:from-primary/[0.08] dark:to-transparent" />
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-primary/[0.06] to-transparent dark:from-primary/[0.06] dark:to-transparent" />
      <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-tl from-primary/[0.06] to-transparent dark:from-primary/[0.06] dark:to-transparent" />

      {/* Icons — static or falling */}
      {animated ? <FallingIcons /> : <StaticIcons />}
    </div>
  );
};
