export default function LanguageSwitch({ language, disabled, onChange }) {
  return (
    <div className="language-switch" aria-label="Language switch">
      <button className={language === 'de' ? 'active' : ''} disabled={disabled} onClick={() => onChange('de')}>DE</button>
      <button className={language === 'en' ? 'active' : ''} disabled={disabled} onClick={() => onChange('en')}>EN</button>
    </div>
  );
}
