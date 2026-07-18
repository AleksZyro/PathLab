export default function PathLabLogo() {
  return (
    <div className="pathlab-logo" aria-hidden="true">
      <svg viewBox="0 0 64 64" role="img">
        <rect className="logo-tile" x="2" y="2" width="60" height="60" rx="14" />
        <path className="logo-grid-lines" d="M18 16H46M18 31H46M18 16V46M32 16V46M46 16V46" />
        <path className="logo-route" d="M14 48H28C34 48 37 45 37 39V27C37 22 40 19 45 19H50" />
        <circle className="logo-start-dot" cx="14" cy="48" r="6" />
        <circle className="logo-target-dot" cx="50" cy="19" r="6" />
      </svg>
    </div>
  );
}
