const FloatingIcon = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`absolute text-primary/[0.12] dark:text-primary/[0.15] select-none pointer-events-none ${className}`}
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

export const HeroBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Gradient background — darker edges fading to lighter center */}
      <div className="absolute inset-0 bg-gradient-to-b from-accent/50 via-background to-accent/30 dark:from-primary/[0.12] dark:via-background dark:to-primary/[0.08]" />
      {/* Radial glow in center for the "lighter middle" effect */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-primary/[0.08] dark:bg-primary/[0.10] rounded-full blur-3xl" />
      {/* Corner vignettes for darker edges */}
      <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-to-br from-primary/[0.06] to-transparent dark:from-primary/[0.08] dark:to-transparent" />
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-primary/[0.06] to-transparent dark:from-primary/[0.08] dark:to-transparent" />
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-primary/[0.04] to-transparent dark:from-primary/[0.06] dark:to-transparent" />
      <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-tl from-primary/[0.04] to-transparent dark:from-primary/[0.06] dark:to-transparent" />

      {/* Floating decorative icons */}
      {/* Top left area */}
      <FloatingIcon className="top-[8%] left-[5%] rotate-[-15deg]">
        <ShieldIcon size={48} />
      </FloatingIcon>
      <FloatingIcon className="top-[15%] left-[18%] rotate-[10deg]">
        <ParagraphSymbol size={32} />
      </FloatingIcon>

      {/* Top right area */}
      <FloatingIcon className="top-[5%] right-[8%] rotate-[12deg]">
        <ScaleIcon size={52} />
      </FloatingIcon>
      <FloatingIcon className="top-[18%] right-[22%] rotate-[-8deg]">
        <DocIcon size={36} />
      </FloatingIcon>

      {/* Middle left */}
      <FloatingIcon className="top-[40%] left-[3%] rotate-[20deg]">
        <DocIcon size={44} />
      </FloatingIcon>
      <FloatingIcon className="top-[55%] left-[12%] rotate-[-5deg]">
        <ParagraphSymbol size={28} />
      </FloatingIcon>

      {/* Middle right */}
      <FloatingIcon className="top-[38%] right-[4%] rotate-[-18deg]">
        <CheckCircleIcon size={40} />
      </FloatingIcon>
      <FloatingIcon className="top-[52%] right-[15%] rotate-[8deg]">
        <ParagraphSymbol size={24} />
      </FloatingIcon>

      {/* Bottom area */}
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

      {/* Extra § symbols scattered */}
      <FloatingIcon className="top-[28%] left-[35%] rotate-[5deg]">
        <ParagraphSymbol size={20} />
      </FloatingIcon>
      <FloatingIcon className="top-[65%] right-[35%] rotate-[-15deg]">
        <ParagraphSymbol size={22} />
      </FloatingIcon>
      <FloatingIcon className="top-[75%] left-[45%] rotate-[10deg]">
        <ParagraphSymbol size={18} />
      </FloatingIcon>
    </div>
  );
};
