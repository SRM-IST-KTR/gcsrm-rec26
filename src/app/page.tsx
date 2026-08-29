import NavBar from "@/components/shared/Nav";
import WhyWorkWithUs from "@/components/recruitment/WhyWorkWithUs";
import OpenPositions from "@/components/recruitment/OpenPositions";
import HowWeHire from "@/components/recruitment/HowWeHire";
import CompanyValues from "@/components/recruitment/CompanyValues";
import PerksSection from "@/components/PerksSection";
import TeamCultureSection from "@/components/TeamCultureSection";
import RegisterSection from "@/components/RegisterSection";
import FAQSection from "@/components/FAQSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import { HeroSection } from "@/components/hero/hero";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FAF7EE] text-[#1E1B24]">
      {/* ── Sections after 'MORE THAN JUST A CLUB' & Page Sections ── */}
      <NavBar/>
      {/* Recruitment sections - shown first */}
      <div className="flex w-full flex-col items-center overflow-x-hidden bg-[#fffdf0] font-outfit">
        <HeroSection />
        <WhyWorkWithUs />
        <OpenPositions />
        <HowWeHire />
        <CompanyValues />
      </div>
      {/* Existing sections */}
      <PerksSection />
      <TeamCultureSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </main>
  );
}
