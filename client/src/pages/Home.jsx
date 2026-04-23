import Banner from "../compounents/home/Banner"
import Calltoaction from "../compounents/home/Calltoaction";
import Features from "../compounents/home/Features";
import Footer from "../compounents/home/Footer";
import Hero from "../compounents/home/Hero";
import Testimonials from "../compounents/home/Testimonials";
const Home = () => {
  return (
    <div>
      <Banner />
      <Hero />
      <Features />
      <Testimonials/>
      <Calltoaction />
      <Footer />
    </div>
  );
};

export default Home;