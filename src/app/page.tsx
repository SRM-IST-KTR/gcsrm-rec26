import PerksSection from "@/components/PerksSection";
import TeamCultureSection from "@/components/TeamCultureSection";
import RegisterSection from "@/components/RegisterSection";
import FAQSection from "@/components/FAQSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FAF7EE] text-[#1E1B24]">
      {/* ── Sections after 'MORE THAN JUST A CLUB' & Page Sections ── */}
      <PerksSection />
      <TeamCultureSection />
      <RegisterSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </main>
  );
}
