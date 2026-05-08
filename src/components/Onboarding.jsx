export default function Onboarding({ dictionary, onDismiss }) {
  return (
    <section className="onboarding-card">
      <div>
        <p className="eyebrow">Tutorial</p>
        <h2>{dictionary.onboarding.title}</h2>
        <p>{dictionary.onboarding.text}</p>
        <ul>
          {dictionary.onboarding.steps.map((step) => <li key={step}>{step}</li>)}
        </ul>
      </div>
      <button className="primary" onClick={onDismiss}>{dictionary.onboarding.dismiss}</button>
    </section>
  );
}
