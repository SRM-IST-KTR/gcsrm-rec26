export default function PerksSection() {
  const perks = [
    {
      title: "Real Projects",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1E1B24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      )
    },
    {
      title: "Events",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1E1B24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
      )
    },
    {
      title: "Workshops",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1E1B24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
          <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
          <path d="M2 2l7.586 7.586"></path>
          <circle cx="11" cy="11" r="2"></circle>
        </svg>
      )
    },
    {
      title: "Open Source",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1E1B24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
        </svg>
      )
    },
    {
      title: "Community",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1E1B24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 12 20 22 4 22 4 12"></polyline>
          <rect x="2" y="7" width="20" height="5"></rect>
          <line x1="12" y1="22" x2="12" y2="7"></line>
          <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path>
          <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
        </svg>
      )
    },
    {
      title: "Opportunities",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1E1B24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
          <line x1="12" y1="22.08" x2="12" y2="12"></line>
        </svg>
      )
    }
  ];

  return (
    <section className="bg-[#FFFDF0] py-24 border-t-2 border-[#1E1B24]" id="perks">
      <div className="container-site max-w-[1280px] mx-auto flex flex-col items-center px-4">
        {/* Badge */}
        <div className="bg-[#FF4B4B] border-[3px] border-[#1E1B24] rounded-full px-6 py-2 mb-6 shadow-[3px_3px_0px_#1E1B24]">
          <span className="font-outfit-black text-[14px] text-[#1E1B24] uppercase tracking-[1.5px]">
            Extravagant Perks
          </span>
        </div>

        {/* Title */}
        <h2 className="font-outfit-black text-4xl md:text-5xl lg:text-[48px] text-[#1E1B24] text-center mb-4 tracking-[-1.5px] uppercase">
          MORE THAN JUST A Community
        </h2>

        {/* Subtitle */}
        <p className="font-rubik text-[18px] text-[#5C5866] font-medium text-center max-w-[640px] mb-16 leading-relaxed">
          Our extra sweet benefits and playful support setups to keep you healthy, focused, and smiling every day.
        </p>

        {/* 3x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-[1280px]">
          {perks.map((perk, index) => (
            <div
              key={index}
              className="bg-white border-[3px] border-[#1E1B24] rounded-[20px] shadow-[4px_4px_0px_#1E1B24] h-[96px] px-6 flex items-center gap-4 transition-transform hover:-translate-y-1"
            >
              <div className="w-12 h-12 bg-[#FFD93D] border-[2px] border-[#1E1B24] rounded-[12px] flex items-center justify-center shrink-0">
                {perk.icon}
              </div>
              <span className="font-outfit-black text-[18px] text-[#1E1B24] tracking-tight">
                {perk.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
