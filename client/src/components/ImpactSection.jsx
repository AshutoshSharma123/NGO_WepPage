export function ImpactSection({ items }) {
  return (
    <section className="section impact-section" id="impact">
      <div className="section-heading">
        <p className="eyebrow">Our footprint</p>
        <h2>Impact you can understand at a glance.</h2>
      </div>
      <div className="impact-grid">
        {items.map((item) => (
          <article className="impact-card" key={item.label}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </article>
        ))}
      </div>
    </section>
  );
}
