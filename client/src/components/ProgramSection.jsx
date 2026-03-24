export function ProgramSection({ programs }) {
  return (
    <section className="section programs-section" id="programs">
      <div className="section-heading">
        <p className="eyebrow">What we do</p>
        <h2>Programs designed for long-term community change.</h2>
      </div>
      <div className="program-grid">
        {programs.map((program) => (
          <article className="program-card" key={program.title}>
            <h3>{program.title}</h3>
            <p>{program.description}</p>
            <a href="#join">Support this initiative</a>
          </article>
        ))}
      </div>
    </section>
  );
}
