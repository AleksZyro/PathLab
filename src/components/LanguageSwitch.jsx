export default function LanguageSwitch({ language, disabled, onChange }) {
  return (
    <div className="language-switch" aria-label="Language switch">
      <button className={language === 'de' ? 'active flag-button' : 'flag-button'} disabled={disabled} onClick={() => onChange('de')} title="Deutsch" aria-label="Deutsch">
        <span className="flag flag-de" aria-hidden="true" />
      </button>
      <button className={language === 'en' ? 'active flag-button' : 'flag-button'} disabled={disabled} onClick={() => onChange('en')} title="English" aria-label="English">
        <span className="flag flag-uk" aria-hidden="true" />
      </button>
    </div>
  );
}
