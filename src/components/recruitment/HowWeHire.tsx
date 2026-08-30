import SectionHeader from "./SectionHeader";
import StepCard from "./StepCard";

const HowWeHire = () => {
  return (
    <section className="relative w-full border-t-[3px] border-[#1E1B24] bg-[#fffdf0] py-16 px-5 sm:px-8 lg:h-[667px] lg:px-20 lg:py-[100px]">
      <div className="mx-auto w-full max-w-[1440px]">
        <SectionHeader
        badge="Our Fun Process"
        badgeClass="bg-[#4ec37b]"
        badgeLeftClass="lg:left-[558px]"
        title="Your Path to the Playground"
        description="No boring multi-stage panels here. We keep our application cycle as short and joyful as a standard play session!"
      />
      <div className="mt-12 flex flex-col sm:grid sm:grid-cols-2 lg:block gap-8 w-full lg:absolute lg:top-[337px] lg:left-[80px] lg:mt-0 lg:w-[1280px] lg:h-[230px]">
        <StepCard
          className="lg:absolute"
          step="01"
          stepBg="#ff4b4b"
          stepTextClass="text-white"
          title="EXPLORE"
          description="Discover the domains and choose the one that matches your interests."
        />
        <StepCard
          className="lg:absolute lg:left-[326px]"
          step="02"
          stepBg="#ffd93d"
          stepTextClass="text-[#1e1b24]"
          title="APPLY"
          description="Tell us about yourself, your skills, interests and what you want to explore."
        />
        <StepCard
          className="lg:absolute lg:left-[652px]"
          step="03"
          stepBg="#4ec37b"
          stepTextClass="text-white"
          title="CONNECT"
          description="Shortlisted applicants interact with the respective domain teams."
        />
          <StepCard
            className="lg:absolute lg:left-[978px]"
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
        className="absolute top-[-50px] left-[-100px] w-[280px] lg:top-[-140px] lg:left-[-260px] lg:w-[800px] h-auto pointer-events-none z-10 object-contain rotate-[55deg]"
        src="/images/recruitment/journey-robot.png"
        alt="Green robot mascot"
      />
    </section>
  );
};

export default HowWeHire;
