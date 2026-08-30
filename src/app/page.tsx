import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import NavBar from "@/components/shared/Nav";
import WhyWorkWithUs from "@/components/recruitment/WhyWorkWithUs";
import OpenPositions from "@/components/recruitment/OpenPositions";
import HowWeHire from "@/components/recruitment/HowWeHire";
import TeamCultureSection from "@/components/TeamCultureSection";
import FAQSection from "@/components/FAQSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import { HeroSection } from "@/components/hero/hero";
import ApplicationStatus from "@/components/ApplicationStatus";

export default async function Home() {
  const gateEnabled = process.env.ACCESS_GATE_ENABLED === "true" || process.env.NEXT_PUBLIC_ACCESS_GATE_ENABLED === "true";

  if (gateEnabled) {
    const cookieStore = await cookies();
    const savedPassword = cookieStore.get("gcsrm_team_password")?.value;

    if (!savedPassword) {
      redirect("/locked");
    }

    const expectedPassword = process.env.RECRUITMENT_PASSWORD;
    if (!expectedPassword || savedPassword !== expectedPassword) {
      redirect("/locked");
    }
  }

  return (
    <main className="min-h-screen bg-[#FAF7EE] text-[#1E1B24]">
      <NavBar />
      <div className="flex w-full flex-col items-center overflow-x-hidden bg-[#fffdf0] font-outfit">
        <HeroSection />
        <ApplicationStatus />
        <div id="about" className="w-full flex flex-col items-center bg-[#fffdf0] border-t-[3px] border-[#1E1B24]">
          <WhyWorkWithUs />
        </div>
        <div id="domains" className="w-full flex flex-col items-center bg-[#fffeef] border-t-[3px] border-[#1E1B24]">
          <OpenPositions />
        </div>
        <div className="w-full flex justify-center bg-[#fffdf0]">
          <HowWeHire />
        </div>
      </div>
      <div id="story">
        <TeamCultureSection />
      </div>
      <div id="faqs">
        <FAQSection />
      </div>
      <CTASection />
      <Footer />
    </main>
  );
}