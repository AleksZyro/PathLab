export default function PathLabLogo() {
  return (
    <div className="pathlab-logo" aria-hidden="true">
      <svg viewBox="0 0 140 110" role="img">
        <defs>
          <linearGradient id="pathlab-line" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#1d7cff" />
            <stop offset="55%" stopColor="#345cff" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
        </defs>
        <g className="logo-grid-lines">
          <path d="M24 20H112M24 55H112M24 90H112M24 20V90M58 20V90M92 20V90M112 20V90" />
        </g>
        <g className="logo-grid-nodes">
          {[24, 58, 92, 112].map((x) => [20, 55, 90].map((y) => <circle key={`${x}-${y}`} cx={x} cy={y} r="4.5" />))}
        </g>
        <path className="logo-route" d="M24 90H58C66 90 69 87 69 79V58C69 50 72 47 80 47H92C100 47 103 44 103 36V30C103 22 106 20 114 20" />
        <circle className="logo-start-ring" cx="24" cy="90" r="10" />
        <circle className="logo-start-dot" cx="24" cy="90" r="5" />
        <circle className="logo-route-dot" cx="58" cy="90" r="6" />
        <circle className="logo-route-dot" cx="69" cy="58" r="6" />
        <circle className="logo-route-dot" cx="103" cy="55" r="6" />
        <circle className="logo-target-ring" cx="116" cy="20" r="12" />
        <circle className="logo-target-dot" cx="116" cy="20" r="6" />
        <g className="logo-bars">
          <rect x="88" y="88" width="7" height="12" rx="2" />
          <rect x="99" y="79" width="7" height="21" rx="2" />
          <rect x="110" y="70" width="7" height="30" rx="2" />
          <rect x="121" y="61" width="7" height="39" rx="2" />
        </g>
      </svg>
    </div>
  );
}
