import Image from "next/image";

export default function TeamCultureSection() {
  const images = [
    "event1.jpg",
    "event2.jpg",
    "event3.jpg",
    "event4.jpg",
    "event5.jpg"
  ];

  // We duplicate the array to create a seamless infinite scroll effect
  const marqueeImages = [...images, ...images];

  return (
    <section className="bg-[#FFFEEF] border-t-[3px] border-[#1E1B24] overflow-hidden relative w-full flex flex-col items-center py-16 lg:py-[100px]" id="team-culture">
      
      {/* Badge & Title */}
      <div className="w-full flex flex-col items-center px-4 mb-12">
        <div className="w-[110px] h-[34px] bg-[#FFD93D] border-[3px] border-[#1E1B24] shadow-[3px_3px_0px_#1E1B24] rounded-[30px] flex items-center justify-center mb-6">
          <span className="font-outfit font-extrabold text-[14px] leading-[18px] uppercase text-[#1E1B24]">
            LIFE @ GCSRM
          </span>
        </div>
        
        <h2 className="font-outfit font-black text-[36px] md:text-[48px] leading-[110%] text-center text-[#1E1B24] mb-4">
          Our Journey So far
        </h2>
        
        <p className="w-full max-w-[640px] font-rubik font-medium text-[16px] md:text-[18px] leading-[150%] text-center text-[#5C5866]">
          Our core crew of dreamers and disruptors. Meet the team that keeps Futaba Kindergarten lively every single day!
        </p>
      </div>

      {/* Infinite Carousel Marquee */}
      <div className="w-full overflow-hidden flex relative mt-4">
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            animation: marquee 30s linear infinite;
          }
          .animate-marquee:hover {
            animation-play-state: paused;
          }
        `}} />
        
        <div className="flex animate-marquee w-max gap-4 md:gap-6 px-2">
          {marqueeImages.map((img, i) => (
            <div key={i} className="relative w-[280px] h-[200px] md:w-[400px] md:h-[280px] bg-white border-[3px] border-[#1E1B24] shadow-[6px_6px_0px_#1E1B24] rounded-[24px] shrink-0 overflow-hidden transform transition-transform hover:-translate-y-2">
              <Image 
                src={`/events/${img}`} 
                alt={`Event ${i}`} 
                fill 
                className="object-cover"
                sizes="(max-width: 768px) 280px, 400px"
              />
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
