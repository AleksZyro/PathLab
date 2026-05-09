function GermanyFlag() {
  return (
    <svg className="flag-svg" viewBox="0 0 36 24" aria-hidden="true" focusable="false">
      <rect width="36" height="8" y="0" fill="#000000" />
      <rect width="36" height="8" y="8" fill="#dd0000" />
      <rect width="36" height="8" y="16" fill="#ffce00" />
    </svg>
  );
}

function UnitedKingdomFlag() {
  return (
    <svg className="flag-svg" viewBox="0 0 36 24" aria-hidden="true" focusable="false">
      <clipPath id="uk-flag-clip">
        <rect width="36" height="24" rx="2" />
      </clipPath>
      <g clipPath="url(#uk-flag-clip)">
        <rect width="36" height="24" fill="#012169" />
        <path d="M0 0L36 24M36 0L0 24" stroke="#ffffff" strokeWidth="5" />
        <path d="M0 0L36 24M36 0L0 24" stroke="#c8102e" strokeWidth="2.5" />
        <path d="M18 0V24M0 12H36" stroke="#ffffff" strokeWidth="8" />
        <path d="M18 0V24M0 12H36" stroke="#c8102e" strokeWidth="4.5" />
      </g>
    </svg>
  );
}

export default function LanguageSwitch({ language, disabled, onChange }) {
  return (
    <div className="language-switch" aria-label="Language switch">
      <button className={language === 'de' ? 'active flag-button' : 'flag-button'} disabled={disabled} onClick={() => onChange('de')} title="Deutsch" aria-label="Deutsch">
        <GermanyFlag />
      </button>
      <button className={language === 'en' ? 'active flag-button' : 'flag-button'} disabled={disabled} onClick={() => onChange('en')} title="English" aria-label="English">
        <UnitedKingdomFlag />
      </button>
    </div>
  );
}
