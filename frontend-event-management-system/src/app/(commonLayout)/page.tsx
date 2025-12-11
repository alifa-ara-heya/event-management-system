import { Hero } from "@/components/modules/Home/Hero";
import EventCategories from "@/components/modules/Home/EventCategories";
import HowItWorks from "@/components/modules/Home/HowItWorks";
import FeaturedEvents from "@/components/modules/Home/FeaturedEvents";
import Testimonials from "@/components/modules/Home/Testimonials";

export default function Home() {
  return (
    <main>
      <Hero />
      <EventCategories />
      <HowItWorks />
      <FeaturedEvents />
      <Testimonials />
      </main>
  );
}
