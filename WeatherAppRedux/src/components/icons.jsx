export function SunIcon({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="32" cy="32" r="13" fill="currentColor" />
      <g stroke="currentColor" strokeWidth="3.5" strokeLinecap="round">
        <line x1="32" y1="14" x2="32" y2="6" />
        <line x1="32" y1="50" x2="32" y2="58" />
        <line x1="14" y1="32" x2="6" y2="32" />
        <line x1="50" y1="32" x2="58" y2="32" />
        <line x1="44.7" y1="19.3" x2="50.4" y2="13.6" />
        <line x1="44.7" y1="44.7" x2="50.4" y2="50.4" />
        <line x1="19.3" y1="44.7" x2="13.6" y2="50.4" />
        <line x1="19.3" y1="19.3" x2="13.6" y2="13.6" />
      </g>
    </svg>
  );
}

export function MoonIcon({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <path
        d="M46 8 a26 26 0 1 0 0 48 a20 20 0 1 1 0 -48 Z"
        fill="currentColor"
      />
    </svg>
  );
}
