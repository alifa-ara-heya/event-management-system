import { Hero } from "@/components/modules/Home/Hero";
import EventCategories from "@/components/modules/Home/EventCategories";
import WhyChooseUs from "@/components/modules/Home/WhyChooseUs";
import HowItWorks from "@/components/modules/Home/HowItWorks";
import FeaturedEvents from "@/components/modules/Home/FeaturedEvents";
import Testimonials from "@/components/modules/Home/Testimonials";

// Force dynamic rendering since we use server components that may need cookies
export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <main>
      <Hero />
      <EventCategories />
      <WhyChooseUs />
      <HowItWorks />
      <FeaturedEvents />
      <Testimonials />
    </main>
  );
}
