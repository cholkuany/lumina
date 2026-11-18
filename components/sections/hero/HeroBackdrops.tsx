import { useId, type ReactNode } from 'react'
import {
  Flower2,
  Leaf,
  Snowflake,
  Sun,
  type LucideIcon,
} from 'lucide-react'

import type { HeroKind } from './hero-collections'

export type Season = 'spring' | 'summer' | 'autumn' | 'winter'

/* -------------------------------------------------------------------------- */
/* Seasons                                                                    */
/* -------------------------------------------------------------------------- */

export function getSeason(date: Date = new Date()): Season {
  const month = date.getMonth()

  if (month >= 2 && month <= 4) return 'spring'
  if (month >= 5 && month <= 7) return 'summer'
  if (month >= 8 && month <= 10) return 'autumn'

  return 'winter'
}

export const SEASONS: Record<Season, { tone: string; Icon: LucideIcon }> = {
  spring: {
    tone: 'from-success via-success-dark to-foreground',
    Icon: Flower2,
  },
  summer: {
    tone: 'from-warning via-accent to-accent-dark',
    Icon: Sun,
  },
  autumn: {
    tone: 'from-warning-dark via-accent-dark to-foreground',
    Icon: Leaf,
  },
  winter: {
    tone: 'from-winter via-winter-dark to-foreground',
    Icon: Snowflake,
  },
}

/* -------------------------------------------------------------------------- */
/* Shared SVG helpers                                                          */
/* -------------------------------------------------------------------------- */

const WHITE = '#fff'
const DARK = '#172033'

function Frame({
  children,
  align = 'xMaxYMid',
}: {
  children: ReactNode
  align?: string
}) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 600 300"
      preserveAspectRatio={`${align} slice`}
      className="pointer-events-none absolute inset-0 -z-10 size-full"
    >
      {children}
    </svg>
  )
}

function Glyph({
  x,
  y,
  s = 1,
  r = 0,
  o = 0.2,
  children,
}: {
  x: number
  y: number
  s?: number
  r?: number
  o?: number
  children: ReactNode
}) {
  return (
    <g
      transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}
      opacity={o}
    >
      {children}
    </g>
  )
}

function Circle({
  x,
  y,
  r,
  opacity = 0.1,
}: {
  x: number
  y: number
  r: number
  opacity?: number
}) {
  return (
    <circle
      cx={x}
      cy={y}
      r={r}
      fill={WHITE}
      fillOpacity={opacity}
    />
  )
}

function Sparkle({
  x,
  y,
  s = 1,
  o = 0.4,
}: {
  x: number
  y: number
  s?: number
  o?: number
}) {
  return (
    <path
      d="M0 -12 Q2 -2 12 0 Q2 2 0 12 Q-2 2 -12 0 Q-2 -2 0 -12Z"
      transform={`translate(${x} ${y}) scale(${s})`}
      fill={WHITE}
      fillOpacity={o}
    />
  )
}

function Dots({
  x,
  y,
  columns = 4,
  rows = 3,
  spacing = 12,
  opacity = 0.2,
}: {
  x: number
  y: number
  columns?: number
  rows?: number
  spacing?: number
  opacity?: number
}) {
  return (
    <g fill={WHITE} fillOpacity={opacity}>
      {Array.from({ length: rows * columns }, (_, i) => (
        <circle
          key={i}
          cx={x + (i % columns) * spacing}
          cy={y + Math.floor(i / columns) * spacing}
          r="2"
        />
      ))}
    </g>
  )
}

function Shadow({
  opacity = 0.12,
}: {
  opacity?: number
}) {
  return (
    <ellipse
      cx="0"
      cy="0"
      rx="55"
      ry="12"
      fill={DARK}
      fillOpacity={opacity}
    />
  )
}

/* -------------------------------------------------------------------------- */
/* Generic decorative shapes                                                   */
/* -------------------------------------------------------------------------- */

function TagShape() {
  return (
    <g>
      <path
        d="M-34 -28 H15 L38 -5 L15 32 H-34 Q-39 32 -39 27 V-23 Q-39 -28 -34 -28Z"
        fill={WHITE}
      />
      <circle cx="-23" cy="-15" r="4" fill="#D97706" fillOpacity=".65" />
    </g>
  )
}

function TicketShape() {
  return (
    <path
      d="M-48 -23 H48 V-9 Q36 0 48 9 V23 H-48 V9 Q-36 0 -48 -9Z"
      fill={WHITE}
    />
  )
}

function PackageShape() {
  return (
    <g>
      <path
        d="M-37 -13 L0 -32 L37 -13 V30 L0 46 L-37 30Z"
        fill={WHITE}
      />
      <path
        d="M-37 -13 L0 6 L37 -13"
        fill="none"
        stroke="#000"
        strokeOpacity=".16"
        strokeWidth="2"
      />
      <path
        d="M0 6 V46"
        stroke="#000"
        strokeOpacity=".18"
        strokeWidth="3"
      />
      <path
        d="M-37 -13 L0 -32 L37 -13 L0 6Z"
        fill={WHITE}
        fillOpacity=".45"
      />
      <path
        d="M-8 -29 C-34 -54 -45 -25 -8 -18 M8 -29 C34 -54 45 -25 8 -18"
        fill="none"
        stroke={WHITE}
        strokeWidth="7"
        strokeLinecap="round"
      />
    </g>
  )
}

function ProductBox() {
  return (
    <g>
      <rect x="-32" y="-18" width="64" height="48" rx="7" fill={WHITE} />
      <path
        d="M-32 -3 H32"
        stroke="#000"
        strokeOpacity=".15"
        strokeWidth="2"
      />
      <rect x="-5" y="-18" width="10" height="48" fill="#000" fillOpacity=".12" />
      <path
        d="M-32 -3 L0 -25 L32 -3"
        fill={WHITE}
        fillOpacity=".35"
      />
    </g>
  )
}

// function MiniStar({
//   x,
//   y,
//   s = 1,
// }: {
//   x: number
//   y: number
//   s?: number
// }) {
//   return (
//     <path
//       d="M0 -10 L3 -3 L10 0 L3 3 L0 10 L-3 3 L-10 0 L-3 -3Z"
//       transform={`translate(${x} ${y}) scale(${s})`}
//       fill={WHITE}
//     />
//   )
// }

/* -------------------------------------------------------------------------- */
/* Deals                                                                       */
/* -------------------------------------------------------------------------- */

function DealsArtwork({ id }: { id: string }) {
  return (
    <Frame>
      <defs>
        <linearGradient id={`${id}-deal-light`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".2" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>

        <pattern
          id={`${id}-deal-pattern`}
          width="34"
          height="34"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(35)"
        >
          <rect width="15" height="34" fill={WHITE} fillOpacity=".07" />
        </pattern>
      </defs>

      {/* Background atmosphere */}
      <rect width="600" height="300" fill={`url(#${id}-deal-pattern)`} />

      <circle cx="472" cy="152" r="190" fill={`url(#${id}-deal-light)`} />
      <Circle x={470} y={150} r={125} opacity={0.08} />
      <Circle x={470} y={150} r={100} opacity={0.06} />

      {/* Radial sale burst */}
      <g
        transform="translate(465 150)"
        fill={WHITE}
        fillOpacity=".10"
      >
        {Array.from({ length: 18 }, (_, i) => (
          <path
            key={i}
            d="M-8 -125 L8 -125 L22 -48 L-22 -48Z"
            transform={`rotate(${i * 20})`}
          />
        ))}
      </g>

      {/* Main discount tag */}
      <Glyph x={460} y={155} s={2.5} r={-12} o={0.95}>
        <TagShape />
        <text
          x="0"
          y="9"
          fontSize="28"
          fontWeight="900"
          textAnchor="middle"
          className='fill-accent-dark'
        >
          %
        </text>
      </Glyph>

      {/* Secondary coupon */}
      <Glyph x={350} y={76} s={1.1} r={-12} o={0.25}>
        <TicketShape />
        <path
          d="M24 -18 V18"
          stroke="#000"
          strokeOpacity=".35"
          strokeDasharray="3 4"
        />
      </Glyph>

      <Glyph x={545} y={246} s={0.8} r={15} o={0.23}>
        <TagShape />
      </Glyph>

      <Glyph x={350} y={244} s={0.65} r={12} o={0.17}>
        <TicketShape />
      </Glyph>

      {/* Decorative typography */}
      <g
        fill={WHITE}
        fontWeight="900"
        fontFamily="sans-serif"
      >
        <text x="535" y="73" fontSize="42" fillOpacity=".25">%</text>
        <text x="322" y="165" fontSize="22" fillOpacity=".2">%</text>
        <text x="560" y="180" fontSize="24" fillOpacity=".18">%</text>
      </g>

      <Sparkle x={390} y={40} s={1.2} />
      <Sparkle x={570} y={112} s={0.7} o={0.3} />
      <Sparkle x={390} y={278} s={0.8} o={0.3} />
      <Dots x={520} y={30} columns={4} rows={3} opacity={0.23} />
    </Frame>
  )
}

/* -------------------------------------------------------------------------- */
/* Trending                                                                   */
/* -------------------------------------------------------------------------- */

function TrendingArtwork({ id }: { id: string }) {
  return (
    <Frame>
      <defs>
        <radialGradient id={`${id}-trend-glow`} cx="70%" cy="50%" r="65%">
          <stop offset="0" stopColor="#fff" stopOpacity=".28" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>

      <Circle x={465} y={148} r={150} opacity={0.07} />
      <circle cx="465" cy="148" r="125" fill={`url(#${id}-trend-glow)`} />

      {/* Abstract popularity rings */}
      <g
        transform="translate(465 155)"
        fill="none"
        stroke={WHITE}
        strokeWidth="2"
      >
        <circle r="92" strokeOpacity=".12" />
        <circle r="72" strokeOpacity=".16" strokeDasharray="5 9" />
        <circle r="52" strokeOpacity=".2" strokeDasharray="3 7" />
      </g>

      {/* Rising bar chart */}
      <g transform="translate(330 246)" fill={WHITE}>
        <rect x="0" y="-22" width="19" height="32" rx="5" fillOpacity=".22" />
        <rect x="29" y="-52" width="19" height="62" rx="5" fillOpacity=".3" />
        <rect x="58" y="-87" width="19" height="97" rx="5" fillOpacity=".4" />
      </g>

      {/* Growth line */}
      <path
        d="M322 200 L355 177 L385 150 L410 120"
        fill="none"
        stroke={WHITE}
        strokeOpacity=".75"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M394 120 H410 V136"
        fill="none"
        stroke={WHITE}
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Main popularity badge */}
      <Glyph x={470} y={145} s={1.9} o={0.92}>
        <circle r="39" fill={WHITE} />
        <circle r="32" fill="none" stroke="#E35B43" strokeWidth="2" strokeDasharray="3 4" />
        <path
          d="M0 -19 L6 -5 L21 -4 L10 6 L13 21 L0 13 L-13 21 L-10 6 L-21 -4 L-6 -5Z"
          className='fill-category-fashion'
        />
      </Glyph>

      {/* Floating rating and heart-like popularity markers */}
      <Glyph x={555} y={65} s={0.85} r={10} o={0.8}>
        <circle r="22" fill={WHITE} />
        <path d="M0 -12 L4 -3 L14 -2 L6 5 L8 15 L0 10 L-8 15 L-6 5 L-14 -2 L-4 -3Z" className='fill-category-fashion' />
      </Glyph>

      <Glyph x={370} y={65} s={0.75} o={0.28}>
        <circle r="22" fill={WHITE} />
        <path d="M0 -12 L4 -3 L14 -2 L6 5 L8 15 L0 10 L-8 15 L-6 5 L-14 -2 L-4 -3Z" className='fill-category-fashion' />
      </Glyph>

      <Glyph x={565} y={232} s={0.7} o={0.25}>
        <circle r="25" fill={WHITE} />
        <path d="M-12 0 L-3 9 L14 -10" fill="none" strokeWidth="5" strokeLinecap="round" className='stroke-category-fashion' />
      </Glyph>

      <Sparkle x={425} y={40} s={1.1} />
      <Sparkle x={580} y={145} s={0.7} o={0.4} />
      <Dots x={300} y={35} columns={4} rows={3} />
    </Frame>
  )
}

/* -------------------------------------------------------------------------- */
/* Essentials                                                                  */
/* -------------------------------------------------------------------------- */

function EssentialsArtwork({ id }: { id: string }) {
  return (
    <Frame>
      <defs>
        <pattern
          id={`${id}-ess-check`}
          width="44"
          height="44"
          patternUnits="userSpaceOnUse"
        >
          <rect width="22" height="44" fill={WHITE} fillOpacity=".045" />
          <rect width="44" height="22" fill={WHITE} fillOpacity=".045" />
        </pattern>
      </defs>

      <rect width="600" height="300" fill={`url(#${id}-ess-check)`} />

      <Circle x={465} y={160} r={145} opacity={0.09} />

      {/* Main grocery basket */}
      <Glyph x={465} y={195} s={2.15} o={0.95}>
        <Shadow />
        {/* Basket body */}
        <path
          d="M-55 -8 H55 L43 42 Q41 48 34 48 H-34 Q-41 48 -43 42Z"
          fill={WHITE}
        />
        <path
          d="M-35 -8 V42 M-12 -8 V46 M12 -8 V46 M35 -8 V42"
          fill="none"
          strokeOpacity=".35"
          strokeWidth="4"
          className='stroke-secondary-dark'
        />
        {/* Handle */}
        <path
          d="M-35 -9 Q-35 -68 0 -68 Q35 -68 35 -9"
          fill="none"
          stroke={WHITE}
          strokeWidth="8"
          strokeLinecap="round"
        />
      </Glyph>

      {/* Produce */}
      <Glyph x={395} y={94} s={1.25} r={-14} o={0.9}>
        <path d="M0 -24 C-25 -28 -29 0 -22 20 C-12 39 10 39 22 20 C30 0 25 -28 0 -24Z" fill={WHITE} />
        <path d="M0 -23 Q0 -42 15 -45 Q18 -29 0 -23Z" fill="#B7F0C9" />
      </Glyph>

      {/* Milk carton */}
      <Glyph x={495} y={91} s={1.1} r={8} o={0.9}>
        <path d="M-19 -20 L-11 -38 H11 L19 -20 V34 H-19Z" fill={WHITE} />
        <path d="M-11 -38 L0 -29 L11 -38" fill="none" stroke="#218A63" strokeWidth="2" />
        <rect x="-11" y="-4" width="22" height="18" rx="3" fill="#218A63" fillOpacity=".45" />
      </Glyph>

      {/* Bread */}
      <Glyph x={552} y={157} s={0.9} r={18} o={0.85}>
        <path d="M-30 13 C-39 -12 -18 -28 0 -28 C18 -28 39 -12 30 13 L28 26 H-28Z" fill={WHITE} />
        <path d="M-15 -13 L-8 5 M0 -17 L7 3 M15 -13 L22 5" strokeOpacity=".4" strokeWidth="3" className='stroke-secondary-dark' />
      </Glyph>

      {/* Carrot */}
      <Glyph x={345} y={215} s={0.85} r={-28} o={0.8}>
        <path d="M0 -18 L17 -8 L3 42 Q0 47 -3 42 L-17 -8Z" fill={WHITE} />
        <path d="M0 -17 Q-12 -37 -19 -30 M0 -17 Q0 -41 6 -42 M0 -17 Q13 -35 20 -30" stroke={WHITE} strokeWidth="4" fill="none" strokeLinecap="round" />
      </Glyph>

      <Sparkle x={570} y={46} />
      <Sparkle x={330} y={120} s={0.7} />
      <Dots x={530} y={260} columns={3} rows={2} opacity={0.25} />
    </Frame>
  )
}

/* -------------------------------------------------------------------------- */
/* New arrivals                                                                */
/* -------------------------------------------------------------------------- */

function NewArtwork({ id }: { id: string }) {
  return (
    <Frame>
      <defs>
        <radialGradient id={`${id}-new-glow`} cx="75%" cy="50%" r="60%">
          <stop offset="0" stopColor="#fff" stopOpacity=".35" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="600" height="300" fill={`url(#${id}-new-glow)`} />

      <Circle x={460} y={155} r={135} opacity={0.09} />
      <Circle x={460} y={155} r={100} opacity={0.07} />

      {/* Spotlight rays */}
      <g
        transform="translate(455 150)"
        fill={WHITE}
        fillOpacity=".12"
      >
        {Array.from({ length: 11 }, (_, i) => (
          <path
            key={i}
            d="M-7 -120 L7 -120 L25 -40 L-25 -40Z"
            transform={`rotate(${(i - 5) * 17})`}
          />
        ))}
      </g>

      {/* Main product reveal */}
      <Glyph x={455} y={184} s={1.95} o={0.96}>
        <ellipse cx="0" cy="62" rx="65" ry="12" fill="#000" fillOpacity=".15" />
        <circle cx="0" cy="-24" r="50" fill={WHITE} fillOpacity=".15" />
        <PackageShape />
      </Glyph>

      {/* Secondary packages */}
      <Glyph x={350} y={245} s={0.75} r={-12} o={0.65}>
        <ProductBox />
      </Glyph>

      <Glyph x={565} y={91} s={0.7} r={12} o={0.5}>
        <PackageShape />
      </Glyph>

      {/* Generic NEW label */}
      <g transform="translate(545 214) rotate(10)">
        <rect x="-46" y="-15" width="92" height="30" rx="15" fill={WHITE} fillOpacity=".95" />
        <text
          textAnchor="middle"
          y="5"
          fontSize="14"
          fontWeight="900"
          letterSpacing="2"
          className='fill-primary-dark'
        >
          NEW
        </text>
      </g>

      {/* Confetti */}
      <g fill={WHITE}>
        <rect x="330" y="53" width="7" height="24" rx="3" transform="rotate(28 330 53)" fillOpacity=".65" />
        <rect x="560" y="40" width="7" height="24" rx="3" transform="rotate(-30 560 40)" fillOpacity=".55" />
        <rect x="310" y="170" width="7" height="20" rx="3" transform="rotate(55 310 170)" fillOpacity=".5" />
        <circle cx="520" cy="38" r="5" fillOpacity=".7" />
        <circle cx="590" cy="170" r="5" fillOpacity=".6" />
        <circle cx="395" cy="280" r="4" fillOpacity=".5" />
      </g>

      <Sparkle x={440} y={32} s={1.5} />
      <Sparkle x={585} y={125} s={0.7} />
      <Sparkle x={355} y={110} s={0.9} />
    </Frame>
  )
}

/* -------------------------------------------------------------------------- */
/* Seasonal artwork                                                            */
/* -------------------------------------------------------------------------- */

function MapleLeaf() {
  return (
    <g>
      <path
        d="M0 -36 L8 -19 L20 -26 L16 -9 L34 -13 L24 1 L37 10 L19 16 L23 32 L5 23 L0 43 L-5 23 L-23 32 L-19 16 L-37 10 L-24 1 L-34 -13 L-16 -9 L-20 -26 L-8 -19Z"
        fill={WHITE}
      />
      <path
        d="M0 43 V-19 M0 13 L-18 -3 M0 13 L18 -3"
        stroke="#000"
        strokeOpacity=".22"
        strokeWidth="2"
        fill="none"
      />
    </g>
  )
}

function Pumpkin() {
  return (
    <g>
      <ellipse cx="-20" cy="0" rx="24" ry="36" fill={WHITE} />
      <ellipse cx="20" cy="0" rx="24" ry="36" fill={WHITE} />
      <ellipse cx="0" cy="0" rx="22" ry="39" fill={WHITE} />
      <path
        d="M0 -35 Q0 -48 12 -49 L15 -42 Q7 -38 8 -31"
        stroke={WHITE}
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M-15 -26 Q-7 0 -15 28 M15 -26 Q7 0 15 28"
        fill="none"
        stroke="#000"
        strokeOpacity=".17"
        strokeWidth="2"
      />
    </g>
  )
}

function SnowflakeArtwork({ size = 1 }: { size?: number }) {
  return (
    <g
      transform={`scale(${size})`}
      stroke={WHITE}
      strokeWidth="2.5"
      strokeLinecap="round"
      fill="none"
    >
      <path d="M0 -22 V22 M-19 -11 L19 11 M-19 11 L19 -11" />
      <path d="M-5 -17 L0 -12 L5 -17 M-5 17 L0 12 L5 17" />
      <path d="M-19 -11 L-11 -10 M-19 -11 L-16 -3 M19 11 L11 10 M19 11 L16 3" />
      <path d="M-19 11 L-11 10 M-19 11 L-16 3 M19 -11 L11 -10 M19 -11 L16 -3" />
    </g>
  )
}

function PineTree() {
  return (
    <g>
      <path d="M0 -48 L-22 -14 H-10 L-29 13 H-12 L-36 39 H36 L12 13 H29 L10 -14 H22Z" fill={WHITE} />
      <rect x="-5" y="38" width="10" height="14" rx="2" fill={WHITE} />
    </g>
  )
}

function SpringFlower() {
  return (
    <g>
      {[0, 72, 144, 216, 288].map((angle) => (
        <ellipse
          key={angle}
          cx="0"
          cy="-19"
          rx="12"
          ry="20"
          transform={`rotate(${angle})`}
          fill={WHITE}
        />
      ))}
      <circle r="10" fill="#F9D56E" />
    </g>
  )
}

function Sunflower() {
  return (
    <g>
      {Array.from({ length: 12 }, (_, i) => (
        <ellipse
          key={i}
          cx="0"
          cy="-30"
          rx="9"
          ry="18"
          transform={`rotate(${i * 30})`}
          fill={WHITE}
        />
      ))}
      <circle r="21" fill="#F8D56C" />
    </g>
  )
}

function Wave() {
  return (
    <path
      d="M-100 0 Q-75 -22 -50 0 T0 0 T50 0 T100 0"
      stroke={WHITE}
      strokeWidth="5"
      fill="none"
      strokeLinecap="round"
    />
  )
}

/* -- Autumn ---------------------------------------------------------------- */

function Autumn({ id }: { id: string }) {
  return (
    <Frame align="xMidYMax">
      <defs>
        <radialGradient id={`${id}-autumn-glow`}>
          <stop offset="0" stopColor="#fff" stopOpacity=".2" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="470" cy="155" r="175" fill={`url(#${id}-autumn-glow)`} />

      <Circle x={465} y={150} r={120} opacity={0.07} />

      <Glyph x={465} y={192} s={2.15} o={0.94}>
        <Pumpkin />
      </Glyph>

      <Glyph x={342} y={64} s={1.05} r={-15} o={0.3}>
        <MapleLeaf />
      </Glyph>

      <Glyph x={555} y={65} s={0.85} r={24} o={0.26}>
        <MapleLeaf />
      </Glyph>

      <Glyph x={330} y={208} s={0.7} r={35} o={0.23}>
        <MapleLeaf />
      </Glyph>

      <Glyph x={570} y={190} s={0.85} r={-25} o={0.25}>
        <MapleLeaf />
      </Glyph>

      <path
        d="M200 300 Q300 250 380 270 Q490 230 600 245 V300Z"
        fill={WHITE}
        fillOpacity=".12"
      />

      <Sparkle x={405} y={35} />
      <Sparkle x={580} y={125} s={0.7} />
      <Dots x={315} y={115} opacity={0.22} />
    </Frame>
  )
}

/* -- Winter ---------------------------------------------------------------- */

function Winter({ id }: { id: string }) {
  return (
    <Frame align="xMidYMax">
      <defs>
        <linearGradient id={`${id}-winter-glow`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".18" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>

      <circle cx="465" cy="140" r="170" fill={`url(#${id}-winter-glow)`} />

      <Glyph x={460} y={178} s={1.75} o={0.65}>
        <PineTree />
      </Glyph>

      <Glyph x={555} y={215} s={1.2} o={0.35}>
        <PineTree />
      </Glyph>

      <Glyph x={338} y={57} s={1.1} o={0.55}>
        <SnowflakeArtwork />
      </Glyph>

      <Glyph x={530} y={52} s={0.8} o={0.4}>
        <SnowflakeArtwork />
      </Glyph>

      <Glyph x={578} y={135} s={1.3} o={0.45}>
        <SnowflakeArtwork />
      </Glyph>

      <Glyph x={400} y={35} s={0.6} o={0.45}>
        <SnowflakeArtwork />
      </Glyph>

      {/* Snow-covered ground */}
      <path
        d="M200 300 Q310 250 390 274 Q500 236 600 246 V300Z"
        fill={WHITE}
        fillOpacity=".17"
      />

      <path
        d="M250 300 Q370 270 460 285 Q530 265 600 265 V300Z"
        fill={WHITE}
        fillOpacity=".12"
      />

      {/* Snowfall */}
      <g fill={WHITE}>
        {[
          [310, 140, 3],
          [370, 185, 2],
          [420, 90, 3],
          [520, 110, 2],
          [575, 45, 3],
          [350, 255, 2],
          [590, 220, 3],
        ].map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} fillOpacity=".65" />
        ))}
      </g>
    </Frame>
  )
}

/* -- Spring ---------------------------------------------------------------- */

function Spring({ id }: { id: string }) {
  return (
    <Frame align="xMidYMax">
      <defs>
        <radialGradient id={`${id}-spring-glow`}>
          <stop offset="0" stopColor="#fff" stopOpacity=".22" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="465" cy="145" r="175" fill={`url(#${id}-spring-glow)`} />

      {/* Main flower */}
      <Glyph x={465} y={160} s={2.25} r={12} o={0.85}>
        <SpringFlower />
      </Glyph>

      {/* Smaller blossoms */}
      <Glyph x={338} y={62} s={0.9} r={-15} o={0.35}>
        <SpringFlower />
      </Glyph>

      <Glyph x={555} y={72} s={0.7} r={20} o={0.3}>
        <SpringFlower />
      </Glyph>

      <Glyph x={575} y={235} s={0.95} r={-10} o={0.3}>
        <SpringFlower />
      </Glyph>

      <Glyph x={345} y={245} s={0.65} r={20} o={0.28}>
        <SpringFlower />
      </Glyph>

      {/* Fresh green leaves */}
      <g fill="#D5FFD9" fillOpacity=".38">
        <path d="M310 190 Q330 135 375 145 Q355 185 310 190Z" />
        <path d="M550 275 Q570 220 600 215 Q590 260 550 275Z" />
        <path d="M390 290 Q420 245 450 252 Q430 283 390 290Z" />
      </g>

      {/* Rain droplets */}
      <g fill={WHITE} fillOpacity=".45">
        <path d="M300 105 Q312 120 312 126 A7 7 0 0 1 298 126 Q298 120 300 105Z" />
        <path d="M590 110 Q598 122 598 128 A6 6 0 0 1 586 128 Q586 122 590 110Z" />
      </g>

      <path
        d="M200 300 Q310 248 390 272 Q500 232 600 245 V300Z"
        fill={WHITE}
        fillOpacity=".12"
      />

      <Sparkle x={420} y={35} />
      <Sparkle x={575} y={160} s={0.7} />
    </Frame>
  )
}

/* -- Summer ---------------------------------------------------------------- */

function Summer({ id }: { id: string }) {
  return (
    <Frame align="xMidYMax">
      <defs>
        <radialGradient id={`${id}-summer-glow`}>
          <stop offset="0" stopColor="#fff" stopOpacity=".32" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="470" cy="135" r="180" fill={`url(#${id}-summer-glow)`} />

      {/* Main sun */}
      <Glyph x={470} y={132} s={2.05} o={0.9}>
        <Sunflower />
      </Glyph>

      {/* Smaller sun */}
      <Glyph x={335} y={65} s={0.75} o={0.3}>
        <Sunflower />
      </Glyph>

      {/* Summer waves */}
      <Glyph x={350} y={245} s={0.8} o={0.4}>
        <Wave />
      </Glyph>

      <Glyph x={510} y={245} s={0.8} o={0.35}>
        <Wave />
      </Glyph>

      <Glyph x={410} y={278} s={0.7} o={0.25}>
        <Wave />
      </Glyph>

      <Glyph x={570} y={278} s={0.7} o={0.25}>
        <Wave />
      </Glyph>

      {/* Sun rays */}
      <g
        transform="translate(470 132)"
        stroke={WHITE}
        strokeWidth="5"
        strokeLinecap="round"
        strokeOpacity=".35"
      >
        {Array.from({ length: 12 }, (_, i) => (
          <path
            key={i}
            d="M0 -66 V-87"
            transform={`rotate(${i * 30})`}
          />
        ))}
      </g>

      <Sparkle x={565} y={53} s={1.2} />
      <Sparkle x={325} y={155} />
      <Sparkle x={405} y={32} s={0.7} />
      <Dots x={540} y={195} opacity={0.2} />
    </Frame>
  )
}

/* -------------------------------------------------------------------------- */
/* Scene registry                                                              */
/* -------------------------------------------------------------------------- */

type ArtworkProps = { id: string }

const BACKDROPS: Record<
  Exclude<HeroKind, 'seasonal'>,
  (props: ArtworkProps) => ReactNode
> = {
  deals: DealsArtwork,
  trending: TrendingArtwork,
  essentials: EssentialsArtwork,
  new: NewArtwork,
}

const SEASON_SCENES: Record<
  Season,
  (props: ArtworkProps) => ReactNode
> = {
  spring: Spring,
  summer: Summer,
  autumn: Autumn,
  winter: Winter,
}

/* -------------------------------------------------------------------------- */
/* Public component                                                            */
/* -------------------------------------------------------------------------- */

export function Backdrop({
  kind,
  season,
}: {
  kind: HeroKind
  season?: Season
}) {
  const reactId = useId()
  const id = `hero-${reactId.replace(/:/g, '')}`

  if (kind === 'seasonal') {
    const Scene = SEASON_SCENES[season ?? getSeason()]
    return <Scene id={id} />
  }

  const Art = BACKDROPS[kind]

  return Art ? <Art id={id} /> : null
}
