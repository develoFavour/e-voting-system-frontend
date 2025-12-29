import { HeroSection } from "@/components/landing/hero-section";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/landing/footer";


export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <HowItWorks />
      <Footer />
    </main>
  )
}
