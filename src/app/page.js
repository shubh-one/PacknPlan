import Navbar from '@/components/Navbar/Navbar';
import Hero from '@/components/Hero/Hero';
import Features from '@/components/Features/Features';
import HowItWorks from '@/components/HowItWorks/HowItWorks';
import Destinations from '@/components/Destinations/Destinations';
import Testimonials from '@/components/Testimonials/Testimonials';
import CTA from '@/components/CTA/CTA';
import Footer from '@/components/Footer/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Destinations />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
