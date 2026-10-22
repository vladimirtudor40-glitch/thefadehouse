import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { AboutCraft } from "@/components/AboutCraft";
import { ServicesMenu } from "@/components/ServicesMenu";
import { LookbookGallery } from "@/components/LookbookGallery";
import { ReviewsMarquee } from "@/components/ReviewsMarquee";
import { LocationSchedule } from "@/components/LocationSchedule";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <AboutCraft />
        <ServicesMenu />
        <LookbookGallery />
        <ReviewsMarquee />
        <LocationSchedule />
      </main>
      <Footer />
    </>
  );
}
