import { useState } from "react";

const initialForm = {
  name: "",
  email: "",
  interest: "Education Access"
};

export function VolunteerForm({ onSubmit, loading, message }) {
  const [formData, setFormData] = useState(initialForm);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit(formData);
    setFormData(initialForm);
  };

  return (
    <section className="section form-section">
      <div className="form-layout">
        <div className="section-heading">
          <p className="eyebrow">Volunteer now</p>
          <h2>Turn interest into action with one clean signup flow.</h2>
          <p className="hero-text">
            This starter includes a real API-backed form so your NGO site can begin
            collecting volunteer leads immediately.
          </p>
        </div>

        <form className="volunteer-form" onSubmit={handleSubmit}>
          <label>
            Full name
            <input
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />
          </label>

          <label>
            Email address
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </label>

          <label>
            Area of interest
            <select name="interest" value={formData.interest} onChange={handleChange}>
              <option>Education Access</option>
              <option>Health Outreach</option>
              <option>Women Empowerment</option>
            </select>
          </label>

          <button className="primary-btn submit-btn" type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Join the Mission"}
          </button>

          {message ? <p className="form-message">{message}</p> : null}
        </form>
      </div>
    </section>
  );
}
