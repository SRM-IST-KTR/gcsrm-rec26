import SectionBadge from "@/components/common/SectionBadge";

export default function CTASection() {
  return (
    <section className="bg-[#FF4B4B] border-y-[1px] border-[#1E1B24] py-16 md:py-[110px] text-center flex flex-col items-center justify-center px-4" id="cta">
      <div className="w-full max-w-[800px] mx-auto flex flex-col items-center">
        {/* Badge */}
        <SectionBadge label="Let's Roll!" variant="yellow" className="mb-6 md:mb-10" />

        {/* Heading */}
        <h2 className="font-overpass-black text-4xl md:text-5xl lg:text-[64px] text-white leading-tight lg:leading-[81px] tracking-[-1.5px] mb-6 md:mb-8">
          Ready for Your Next Big<br className="hidden md:block" />
          Playground Adventure?
        </h2>

        {/* Subheading */}
        <p className="font-rubik text-[16px] md:text-[18px] font-medium text-[#FFFEEF] max-w-[640px] leading-relaxed md:leading-[27px]">
          Your next chapter could start with a pull request, a poster, an event, an<br className="hidden md:block" />
          idea or simply a decision to try something new.
        </p>
      </div>
    </section>
  );
}

