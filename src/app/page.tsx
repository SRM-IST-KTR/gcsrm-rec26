import NavBar from "@/components/shared/Nav";
import WhyWorkWithUs from "@/components/recruitment/WhyWorkWithUs";
import OpenPositions from "@/components/recruitment/OpenPositions";
import HowWeHire from "@/components/recruitment/HowWeHire";
// import CompanyValues from "@/components/recruitment/CompanyValues";
// import PerksSection from "@/components/PerksSection";
import TeamCultureSection from "@/components/TeamCultureSection";
import LoginSection from "@/components/LoginSection";
import FAQSection from "@/components/FAQSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import { HeroSection } from "@/components/hero/hero";
import ApplicationStatus from "@/components/ApplicationStatus";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FAF7EE] text-[#1E1B24]">
      {/* ── Sections after 'MORE THAN JUST A CLUB' & Page Sections ── */}
      <NavBar/>
      {/* Recruitment sections - shown first */}
      <div className="flex w-full flex-col items-center overflow-x-hidden bg-[#fffdf0] font-outfit">
        <HeroSection />
        <ApplicationStatus/>
        <div id="about" className="w-full flex flex-col items-center bg-[#fffdf0] border-t-[3px] border-[#1E1B24]">
          <WhyWorkWithUs />
        </div>
        {/* <WhyWorkWithUs /> */}

        <div id="domains" className="w-full flex flex-col items-center bg-[#fffeef] border-t-[3px] border-[#1E1B24]">
          <OpenPositions />
        </div>

        {/* <OpenPositions /> */}
        <div className="w-full flex justify-center bg-[#fffdf0]">
          <HowWeHire />
        </div>
        {/* <div className="w-full flex justify-center bg-[#fffeef] border-t-[3px] border-[#1E1B24]">
          <CompanyValues />
        </div> */}
      </div>
      {/* Existing sections
      <PerksSection /> */}

    <div id="story">
      <TeamCultureSection />
    </div>
      {/* <FAQSection /> */}
      <div id="faqs">
        <FAQSection />
      </div>
      <CTASection />
      <Footer />
    </main>
  );
}