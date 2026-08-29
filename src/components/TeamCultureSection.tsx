import Image from "next/image";

export default function TeamCultureSection() {
  const cards = [
    { img: "55b486f78437633855ed4763082c07486aa76e32.png", alt: "Shinchan", hasBorder: false },
    { img: "8a36618d938927d60518846112c58f341ee6e809.png", alt: "Kazama", hasBorder: true },
    { img: "f0453497172c79c5f5c89cf66dcf00b66e52a635.png", alt: "Nene", hasBorder: true },
    { img: "f1c5cc498c201fab3a48f36309b37759254eae68.png", alt: "Masao", hasBorder: true }
  ];

  return (
    <section className="bg-[#FFFEEF] border-t-[3px] border-[#1E1B24] overflow-hidden relative w-full flex justify-center py-16 lg:py-[100px]" id="team-culture">
      
      {/* Desktop Container */}
      <div className="relative w-full max-w-[1440px] hidden lg:block h-[650px]">
        
        {/* Title Frame */}
        <div className="relative w-[1280px] h-[173px] mx-auto">
          {/* section-badge */}
          <div className="absolute w-[110px] h-[34px] left-[585px] top-0 bg-[#FFD93D] border-[3px] border-[#1E1B24] shadow-[3px_3px_0px_#1E1B24] rounded-[30px] flex items-center justify-center">
            <span className="font-outfit font-extrabold text-[14px] leading-[18px] uppercase text-[#1E1B24]">
              LIFE @ GCSRM
            </span>
          </div>

          {/* Our Journey So far */}
          <h2 className="absolute h-[53px] left-0 right-0 top-[50px] font-outfit font-black text-[48px] leading-[110%] text-center text-[#1E1B24]">
            Our Journey So far
          </h2>

          {/* Description */}
          <p className="absolute w-[640px] h-[54px] left-[320px] top-[119px] font-rubik font-medium text-[18px] leading-[150%] text-center text-[#5C5866]">
            Our core crew of dreamers and disruptors. Meet the team that keeps Futaba Kindergarten lively every single day!
          </p>
        </div>

        {/* Cards Wrapper Frame */}
        <div className="relative w-max mx-auto h-[388px] mt-[64px] flex gap-[32px]">
          
          {/* 1st Card (Shinchan - No inner border) */}
          <div className="relative w-[296px] h-[388px] bg-white border-[3px] border-[#1E1B24] shadow-[6px_6px_0px_#1E1B24] rounded-[24px]">
             <div className="absolute top-[16px] left-[16px] right-[16px] h-[343px] rounded-[16px] overflow-hidden">
                <Image src="/assets/55b486f78437633855ed4763082c07486aa76e32.png" alt="Shinchan" fill className="object-cover" />
             </div>
          </div>

          {/* 2nd Card */}
          <div className="relative w-[296px] h-[388px] bg-white border-[3px] border-[#1E1B24] shadow-[6px_6px_0px_#1E1B24] rounded-[24px]">
             <div className="absolute top-[16px] left-[16px] right-[16px] h-[343px] border-[3px] border-[#1E1B24] rounded-[16px] overflow-hidden bg-[#FFD93D]/20">
                <Image src="/assets/8a36618d938927d60518846112c58f341ee6e809.png" alt="Kazama" fill className="object-cover" />
             </div>
          </div>

          {/* 3rd Card */}
          <div className="relative w-[296px] h-[388px] bg-white border-[3px] border-[#1E1B24] shadow-[6px_6px_0px_#1E1B24] rounded-[24px]">
             <div className="absolute top-[16px] left-[16px] right-[16px] h-[343px] border-[3px] border-[#1E1B24] rounded-[16px] overflow-hidden bg-[#FFD93D]/20">
                <Image src="/assets/f0453497172c79c5f5c89cf66dcf00b66e52a635.png" alt="Nene" fill className="object-cover" />
             </div>
          </div>

          {/* 4th Card */}
          <div className="relative w-[296px] h-[388px] bg-white border-[3px] border-[#1E1B24] shadow-[6px_6px_0px_#1E1B24] rounded-[24px]">
             <div className="absolute top-[16px] left-[16px] right-[16px] h-[343px] border-[3px] border-[#1E1B24] rounded-[16px] overflow-hidden bg-[#FFD93D]/20">
                <Image src="/assets/f1c5cc498c201fab3a48f36309b37759254eae68.png" alt="Masao" fill className="object-cover" />
             </div>
          </div>

        </div>
      </div>

      {/* Mobile/Tablet Fallback Container */}
      <div className="w-full flex flex-col items-center lg:hidden px-4">
        {/* Badge */}
        <div className="w-[110px] h-[34px] bg-[#FFD93D] border-[3px] border-[#1E1B24] shadow-[3px_3px_0px_#1E1B24] rounded-[30px] flex items-center justify-center mb-6">
          <span className="font-outfit font-extrabold text-[14px] leading-[18px] uppercase text-[#1E1B24]">
            LIFE @ GCSRM
          </span>
        </div>
        
        <h2 className="font-outfit font-black text-[36px] md:text-[48px] leading-[110%] text-center text-[#1E1B24] mb-4">
          Our Journey So far
        </h2>
        
        <p className="w-full max-w-[640px] font-rubik font-medium text-[16px] md:text-[18px] leading-[150%] text-center text-[#5C5866] mb-12">
          Our core crew of dreamers and disruptors. Meet the team that keeps Futaba Kindergarten lively every single day!
        </p>

        {/* Horizontal scrollable cards for mobile */}
        <div className="w-full overflow-x-auto pb-8 flex gap-6 snap-x">
          {cards.map((item, i) => (
            <div key={i} className="min-w-[280px] md:min-w-[296px] h-[360px] md:h-[388px] bg-white border-[3px] border-[#1E1B24] shadow-[6px_6px_0px_#1E1B24] rounded-[24px] relative shrink-0 snap-center">
              <div className={`absolute top-[16px] left-[16px] right-[16px] h-[320px] md:h-[343px] rounded-[16px] overflow-hidden ${item.hasBorder ? 'border-[3px] border-[#1E1B24] bg-[#FFD93D]/20' : ''}`}>
                <Image src={`/assets/${item.img}`} alt={item.alt} fill className="object-cover" />
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
