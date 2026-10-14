import React from 'react';

interface MQLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  variant?: 'full' | 'icon' | 'badge';
}

export const MQLogo: React.FC<MQLogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = true,
  variant = 'full',
}) => {
  const iconDimensions = {
    sm: { width: 36, height: 36 },
    md: { width: 48, height: 48 },
    lg: { width: 64, height: 64 },
    xl: { width: 88, height: 88 },
  }[size];

  if (variant === 'icon') {
    return (
      <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
        <svg
          viewBox="0 0 120 120"
          width={iconDimensions.width}
          height={iconDimensions.height}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-sm"
        >
          <defs>
            <linearGradient id="mqBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#0369a1" />
            </linearGradient>
            <linearGradient id="mqTealGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#0d9488" />
            </linearGradient>
            <linearGradient id="mqBloodGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#b91c1c" />
            </linearGradient>
          </defs>

          {/* Letter M */}
          <path
            d="M 16 95 L 16 35 L 36 68 L 56 35 L 56 95 L 42 95 L 42 58 L 36 68 L 30 58 L 30 95 Z"
            fill="url(#mqBlueGrad)"
          />

          {/* Dynamic Swoosh Bridge connecting M and Q */}
          <path
            d="M 22 76 C 45 60 70 56 94 66 C 80 62 55 65 30 79 Z"
            fill="url(#mqTealGrad)"
          />

          {/* Letter Q Outer Ring */}
          <circle cx="82" cy="62" r="28" stroke="url(#mqTealGrad)" strokeWidth="12" fill="none" />
          {/* Q Tail */}
          <path
            d="M 88 78 L 108 98 L 98 108 L 78 88 Z"
            fill="url(#mqTealGrad)"
          />

          {/* Blood Drop inside Q */}
          <path
            d="M 82 46 C 82 46 72 58 72 65 C 72 70.5 76.5 75 82 75 C 87.5 75 92 70.5 92 65 C 92 58 82 46 82 46 Z"
            fill="url(#mqBloodGrad)"
          />

          {/* Medical Cross above Q */}
          <rect x="96" y="18" width="6" height="18" rx="2" fill="#0d9488" />
          <rect x="90" y="24" width="18" height="6" rx="2" fill="#0d9488" />
        </svg>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Visual Logo Mark */}
      <div className="relative shrink-0 flex items-center justify-center">
        <svg
          viewBox="0 0 120 120"
          width={iconDimensions.width}
          height={iconDimensions.height}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-sm transition-transform hover:scale-105 duration-200"
        >
          <defs>
            <linearGradient id="mqBlueGradF" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#0369a1" />
            </linearGradient>
            <linearGradient id="mqTealGradF" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#0d9488" />
            </linearGradient>
            <linearGradient id="mqBloodGradF" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#b91c1c" />
            </linearGradient>
          </defs>

          {/* Letter M */}
          <path
            d="M 16 95 L 16 35 L 36 68 L 56 35 L 56 95 L 42 95 L 42 58 L 36 68 L 30 58 L 30 95 Z"
            fill="url(#mqBlueGradF)"
          />

          {/* Dynamic Swoosh Bridge connecting M and Q */}
          <path
            d="M 22 76 C 45 60 70 56 94 66 C 80 62 55 65 30 79 Z"
            fill="url(#mqTealGradF)"
          />

          {/* Letter Q Outer Ring */}
          <circle cx="82" cy="62" r="28" stroke="url(#mqTealGradF)" strokeWidth="12" fill="none" />
          {/* Q Tail */}
          <path
            d="M 88 78 L 108 98 L 98 108 L 78 88 Z"
            fill="url(#mqTealGradF)"
          />

          {/* Blood Drop inside Q */}
          <path
            d="M 82 46 C 82 46 72 58 72 65 C 72 70.5 76.5 75 82 75 C 87.5 75 92 70.5 92 65 C 92 58 82 46 82 46 Z"
            fill="url(#mqBloodGradF)"
          />

          {/* Medical Cross above Q */}
          <rect x="96" y="18" width="6" height="18" rx="2" fill="#0d9488" />
          <rect x="90" y="24" width="18" height="6" rx="2" fill="#0d9488" />
        </svg>
      </div>

      {/* Typography */}
      <div className="flex flex-col leading-tight">
        <div className="flex items-center gap-1.5">
          <span className="font-black text-slate-900 tracking-tight text-xl md:text-2xl font-sans">
            MQ
          </span>
          <span className="font-extrabold text-sky-700 tracking-tight text-xl md:text-2xl">
            DIAGNOSTIC
          </span>
          <span className="font-extrabold text-teal-600 tracking-tight text-xl md:text-2xl">
            CARE
          </span>
        </div>

        {showSubtitle && (
          <div className="flex flex-col">
            <span className="text-[10px] md:text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Accurate Testing • Healthier Tomorrow
            </span>
            <span className="text-[9px] md:text-[10px] font-bold text-teal-700 uppercase tracking-widest flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Sample Collection Center • Trisulia, Baranga
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
