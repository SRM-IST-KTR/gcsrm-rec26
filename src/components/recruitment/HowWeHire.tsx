import SectionBadge from "@/components/common/SectionBadge";
import StepCard from "./StepCard";

const HowWeHire = () => {
  return (
    <section
      id="process"
      className="relative w-full border-t-[3px] border-[#1E1B24] bg-[#fffdf0] py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 overflow-visible"
    >
      <div className="w-full max-w-7xl mx-auto flex flex-col items-center relative z-20">
        {/* Section Header */}
        <div className="flex flex-col items-center gap-4 text-center mb-12 sm:mb-16 max-w-[800px] mx-auto relative z-10">
          <SectionBadge label="Our Fun Process" variant="green" bgColor="#4ec37b" />
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-center text-[#1e1b24] tracking-[-1.5px] leading-[1.1]">
            Your Path to the Playground
          </h2>
          <p className="text-base sm:text-lg font-rubik font-medium text-center text-[#5c5866] leading-relaxed max-w-[640px]">
            No boring multi-stage panels here. We keep our application cycle as short and joyful as a standard play session!
          </p>
        </div>

        {/* Process Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 w-full relative z-10">
          <StepCard
            step="01"
            stepBg="#ff4b4b"
            stepTextClass="text-white"
            title="EXPLORE"
            description="Discover the domains and choose the one that matches your interests."
          />
          <StepCard
            step="02"
            stepBg="#ffd93d"
            stepTextClass="text-[#1e1b24]"
            title="APPLY"
            description="Tell us about yourself, your skills, interests and what you want to explore."
          />
          <StepCard
            step="03"
            stepBg="#4ec37b"
            stepTextClass="text-white"
            title="CONNECT"
            description="Shortlisted applicants interact with the respective domain teams."
          />
          <StepCard
            step="04"
            stepBg="#3e9fff"
            stepTextClass="text-white"
            title="JOIN"
            description="Get selected, meet your team and start building with GCSRM."
            showLine={false}
          />
        </div>
      </div>

      <img
        className="absolute top-[20px] left-[-80px] w-[200px] sm:top-[10px] sm:left-[-100px] sm:w-[250px] lg:top-[-20px] lg:left-[-180px] lg:w-[500px] h-auto pointer-events-none z-10 object-contain rotate-[50deg]"
        src="/images/recruitment/journey-robot.png"
        alt="Green robot mascot"
      />
    </section>
  );
};

export default HowWeHire;
