import "./PricingList.css";

const plans = [
  {
    label: "Plan 1",
    name: "For Individual",
    price: "$2/month",
    features: ["Task Management", "Basic Analytics", "Email Support"]
  },
  {
    label: "Plan 2",
    name: "For Medium Teams",
    price: "$5/month",
    features: ["Task Management", "Team Collaboration", "Priority Support"]
  },
  {
    label: "Plan 3",
    name: "For Large Teams",
    price: "$10/month",
    features: ["All Features", "Advanced Analytics", "Dedicated Support"]
  }
];

function PricingList() {
  return (
    <section className="pricing-section">
      <h2 className="pricing-header">PRICING PLANS</h2>
      <div className="pricing-grid">
        {plans.map((plan, index) => (
          <div className="pricing-card" key={index}>
            <span className="plan-label">{plan.label}</span>
            <h3 className="plan-name">{plan.name}</h3>
            <p className="price">{plan.price}</p>
            <ul className="features">
              {plan.features.map((feature, idx) => (
                <li key={idx}>
                  <span className="check">✔</span>
                  {feature}
                </li>
              ))}
            </ul>
            <button className="pricing-button">Choose Plan</button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default PricingList;
