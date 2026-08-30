import SectionBadge from "./SectionBadge";
import ValueCard from "./ValueCard";

const CompanyValues = () => {
  return (
    <section className="flex flex-col gap-10 lg:gap-16 items-center w-full lg:w-[1440px] h-fit bg-[#fffeef] py-16 px-5 sm:px-8 lg:py-[100px] lg:px-20 border-t-[3px] border-[#1E1B24]">
      <div className="flex flex-col gap-4 items-center self-stretch h-fit">
        <SectionBadge label="Core Beliefs" className="bg-[#3e9fff]" />
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-center text-[#1e1b24] leading-[1.1] self-stretch h-fit">
          Our Playground Values
        </h2>
        <p className="text-base lg:text-lg font-rubik font-medium text-center text-[#5c5866] leading-normal w-full max-w-[640px] h-fit">
          These are the silly, serious, and joyful principles that guide every mission we undertake
          and every game we invent.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch self-stretch h-fit">
        <ValueCard
          badge="VALUE 01"
          badgeBg="#ffd93d"
          badgeTextClass="text-[#1e1b24]"
          title="Open Source Mindset"
          description="Learn openly. Share knowledge. Build together."
        />
        <ValueCard
          badge="VALUE 02"
          badgeBg="#ff4b4b"
          badgeTextClass="text-white"
          title="CURIOUS"
          description="Keep experimenting, questioning and exploring what comes next."
        />
        <ValueCard
          badge="VALUE 03"
          badgeBg="#3e9fff"
          badgeTextClass="text-white"
          title="COLLABORATIVE"
          description="Great things happen when different skills and perspectives come together."
        />
        <ValueCard
          badge="VALUE 04"
          badgeBg="#4ec37b"
          badgeTextClass="text-white"
          title="BOLD"
          description="Don't wait for opportunities. Create them."
        />
      </div>
    </section>
  );
};

export default CompanyValues;
