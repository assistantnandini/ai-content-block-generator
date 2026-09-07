function Features({ items }) {
  return (
    <section className="features">
      <h2>What We Offer</h2>

      <div className="features-grid">
        {items.map((item, index) => (
          <div className="feature-card" key={index}>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Features;