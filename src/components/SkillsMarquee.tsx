import { useState } from 'react';

const skills = [
  { name: 'React', icon: '⚛️' },
  { name: 'Next.js', icon: '▲' },
  { name: 'TypeScript', icon: 'TS' },
  { name: 'JavaScript', icon: 'JS' },
  { name: 'Tailwind CSS', icon: '✦' },
  { name: 'HTML', icon: '</>' },
  { name: 'CSS', icon: '🎨' },
  { name: 'Python', icon: '🐍' },
  { name: 'Shopify', icon: '🛒' },
  { name: 'WordPress', icon: 'W' },
  { name: 'Figma', icon: '◈' },
  { name: 'SEO', icon: '📈' },
];

interface MarqueeRowProps {
  skills: typeof skills;
  direction: 'left' | 'right';
  duration?: number;
  rowIndex: number;
}

function MarqueeRow({ skills: rowSkills, direction, duration = 35, rowIndex }: MarqueeRowProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const isPaused = hoveredIndex !== null;

  const animationClass = direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right';

  // Duplicate items for seamless infinite loop
  const items = [...rowSkills, ...rowSkills];

  return (
    <div className="relative overflow-x-clip overflow-y-visible py-2">
      {/* Left gradient fade */}
      <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-16 md:w-32 bg-gradient-to-r from-[#0f0f0f] to-transparent z-10 pointer-events-none" />
      {/* Right gradient fade */}
      <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-16 md:w-32 bg-gradient-to-l from-[#0f0f0f] to-transparent z-10 pointer-events-none" />

      <div
        className={`flex gap-3 sm:gap-4 w-max ${animationClass} ${isPaused ? 'marquee-paused' : ''}`}
        style={{ '--marquee-duration': `${duration}s` } as React.CSSProperties}
      >
        {items.map((skill, i) => {
          const isHovered = hoveredIndex === i;
          const isAnyHovered = isPaused;

          return (
            <div
              key={`row${rowIndex}-${skill.name}-${i}`}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`
                flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-2.5 sm:py-3.5 rounded-lg sm:rounded-xl border shrink-0
                transition-all duration-300 cursor-default select-none
                ${isHovered
                  ? 'bg-indigo-500/15 border-indigo-500/50 shadow-lg shadow-indigo-500/25 scale-105'
                  : isAnyHovered
                    ? 'bg-white/[0.02] border-white/[0.05] opacity-40'
                    : 'bg-white/5 border-white/10 hover:bg-white/[0.08]'
                }
              `}
            >
              <span
                className={`text-sm sm:text-lg transition-transform duration-300 ${
                  isHovered ? 'scale-125' : ''
                }`}
              >
                {skill.icon}
              </span>
              <span
                className={`text-xs sm:text-sm font-medium whitespace-nowrap transition-colors duration-300 ${
                  isHovered ? 'text-white' : 'text-gray-400'
                }`}
              >
                {skill.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function SkillsMarquee() {
  const reversedSkills = [...skills].reverse();

  return (
    <div className="w-full space-y-3 sm:space-y-4">
      <MarqueeRow skills={skills} direction="left" duration={35} rowIndex={0} />
      <MarqueeRow skills={reversedSkills} direction="right" duration={30} rowIndex={1} />
    </div>
  );
}
