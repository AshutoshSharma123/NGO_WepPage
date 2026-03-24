export function Hero() {
  return (
    <header className="hero">
      <nav className="navbar">
        <div className="brand">
          <span className="brand-mark">SR</span>
          <div>
            <p>Sri Ram Charitable Trust, Jammu</p>
            <span>Serving communities with care and dignity</span>
          </div>
        </div>
        <div className="nav-links">
          <a href="#impact">Impact</a>
          <a href="#programs">Programs</a>
          <a href="#donate">Donate</a>
          <a href="#join">Get Involved</a>
        </div>
      </nav>

      <div className="hero-content">
        <div className="hero-copy">
          <p className="eyebrow">Helping communities thrive</p>
          <h1>Build a brighter future with Sri Ram Charitable Trust, Jammu.</h1>
          <p className="hero-text">
            Sri Ram Charitable Trust, Jammu connects donors, volunteers, and
            grassroots programs in one clear, inspiring digital experience.
          </p>
          <div className="hero-actions">
            <a className="primary-btn" href="#donate">
              Donate Now
            </a>
            <a className="primary-btn" href="#join">
              Become a Volunteer
            </a>
            <a className="secondary-btn" href="#programs">
              Explore Programs
            </a>
          </div>
        </div>

        <div className="hero-panel">
          <div className="panel-card large">
            <span>Live Campaign</span>
            <strong>Clean Water for 12 villages</strong>
            <p>72% funded with community and partner support this month.</p>
          </div>
          <div className="panel-grid">
            <div className="panel-card">
              <span>Partners</span>
              <strong>34</strong>
            </div>
            <div className="panel-card accent">
              <span>Volunteers Joined</span>
              <strong>+89</strong>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
