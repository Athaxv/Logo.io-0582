import { Navbar } from "../components/navbar";
import { Hero } from "../components/hero";
import { Clients } from "../components/clients";
import { Features } from "../components/features";
import { CtaSection } from "../components/cta-section";
import { Footer } from "../components/footer";

function Index() {
  return (
    <div className="min-h-screen bg-[#050505]">
      <Navbar />
      <Hero />
      <Clients />
      <Features />
      <CtaSection />
      <Footer />
    </div>
  );
}

export default Index;
