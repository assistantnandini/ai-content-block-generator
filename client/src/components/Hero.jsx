function Hero({ heading, subheading }) {
  return (
    <section className="hero">
      <h1>{heading}</h1>

      {subheading && <p>{subheading}</p>}
    </section>
  );
}

export default Hero;