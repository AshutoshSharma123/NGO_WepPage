import { useState } from "react";

const initialForm = {
  donorName: "",
  email: "",
  amount: "1000",
  purpose: "Education Support"
};

export function DonationSection({ onSubmit, loading, message, certificateUrl }) {
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
    const success = await onSubmit(formData);
    if (success) {
      setFormData(initialForm);
    }
  };

  return (
    <section className="section donation-section" id="donate">
      <div className="cta-card donation-card">
        <div className="section-heading">
          <p className="eyebrow">Donate now</p>
          <h2>Support a cause and instantly issue a donor appreciation certificate.</h2>
          <p className="hero-text">
            Donations now go through Razorpay Checkout. After payment verification,
            the donor receives a certificate page that can be opened or printed.
          </p>
        </div>

        <form className="volunteer-form" onSubmit={handleSubmit}>
          <label>
            Donor name
            <input
              name="donorName"
              type="text"
              value={formData.donorName}
              onChange={handleChange}
              placeholder="Enter donor name"
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
              placeholder="Enter donor email"
              required
            />
          </label>

          <label>
            Donation amount
            <input
              name="amount"
              type="number"
              min="100"
              value={formData.amount}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Donation purpose
            <select name="purpose" value={formData.purpose} onChange={handleChange}>
              <option>Education Support</option>
              <option>Health Camps</option>
              <option>Food Distribution</option>
              <option>Women Empowerment</option>
            </select>
          </label>

          <button className="primary-btn submit-btn" type="submit" disabled={loading}>
            {loading ? "Processing Payment..." : "Donate with Razorpay"}
          </button>

          {message ? <p className="form-message">{message}</p> : null}
          {certificateUrl ? (
            <a className="certificate-link" href={certificateUrl} target="_blank" rel="noreferrer">
              Open appreciation certificate
            </a>
          ) : null}
        </form>
      </div>
    </section>
  );
}
