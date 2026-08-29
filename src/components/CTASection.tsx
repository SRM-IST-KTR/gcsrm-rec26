export default function CTASection() {
  return (
    <section className="bg-[#FF4B4B] border-y-[1px] border-[#1E1B24] py-16 md:py-[110px] text-center flex flex-col items-center justify-center px-4" id="cta">
      <div className="w-full max-w-[800px] mx-auto flex flex-col items-center">
        {/* Badge */}
        <div 
          className="bg-[#FFD93D] border-[3px] border-[#1E1B24] rounded-full px-6 py-2 mb-6 md:mb-10 shadow-[3px_3px_0px_#1E1B24]"
        >
          <span className="font-outfit-black text-[14px] text-[#1E1B24] uppercase tracking-[1.5px]">
            Let's Roll!
          </span>
        </div>

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

