import nusLogo from "../assets/nus-logo.jpg";

function Home() {
  return (
    <section className="home">
      <img
        src={nusLogo}
        alt="National University of Singapore logo"
        className="home__logo"
      />
      <h1 className="home__tagline">NUS is a leading research university in Asia</h1>
    </section>
  );
}

export default Home;
