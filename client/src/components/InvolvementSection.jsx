export function InvolvementSection({ involvement }) {
  return (
    <section className="section involvement-section" id="join">
      <div className="cta-card">
        <div className="section-heading">
          <p className="eyebrow">Get involved</p>
          <h2>Make your contribution practical, visible, and meaningful.</h2>
        </div>
        <div className="involvement-list">
          {involvement.map((item) => (
            <div className="involvement-item" key={item}>
              <span className="bullet" />
              <p>{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
