import Image from "next/image";
import fs from "fs";
import path from "path";
import SectionBadge from "@/components/common/SectionBadge";

export default function TeamCultureSection() {
  let images: string[] = [];
  try {
    const eventsDir = path.join(process.cwd(), "public", "events");
    images = fs.readdirSync(eventsDir).filter(file => 
      file.match(/\.(jpg|jpeg|png|webp|gif)$/i)
    );
  } catch (error) {
    console.error("Error reading events directory:", error);
  }

  // Row 1 starts with 1st image
  const marqueeImages1 = [...images, ...images];
  // Row 2 starts with last image (reversed array)
  const reversedImages = [...images].reverse();
  const marqueeImages2 = [...reversedImages, ...reversedImages];

  return (
    <section className="bg-[#FFFEEF] border-t-[3px] border-[#1E1B24] overflow-hidden relative w-full flex flex-col items-center py-16 lg:py-[100px]" id="team-culture">
      
      {/* Badge & Title */}
      <div className="w-full flex flex-col items-center px-4 mb-12">
        <SectionBadge label="LIFE @ GCSRM" variant="yellow" className="mb-6" />
        
        <h2 className="font-outfit font-black text-[36px] md:text-[48px] leading-[110%] text-center text-[#1E1B24] mb-4">
          Our Journey So far
        </h2>
        
        <p className="w-full max-w-[640px] font-rubik font-medium text-[16px] md:text-[18px] leading-[150%] text-center text-[#5C5866]">
          Our core crew of dreamers and disruptors. Meet the team that keeps Futaba Kindergarten lively every single day!
        </p>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 42s linear infinite;
        }
        .animate-marquee-reverse {
          animation: marquee 42s linear infinite reverse;
        }
        .animate-marquee:hover, .animate-marquee-reverse:hover {
          animation-play-state: paused;
        }
      `}} />

      {/* Row 1: Forward Marquee */}
      <div className="w-full overflow-hidden flex relative pt-4 pb-6">
        <div className="flex animate-marquee w-max gap-4 md:gap-6 px-2">
          {marqueeImages1.map((img, i) => (
            <div key={`row1-${i}`} className="relative w-[280px] h-[200px] md:w-[400px] md:h-[280px] bg-white border-[3px] border-[#1E1B24] shadow-[6px_6px_0px_#1E1B24] rounded-[24px] shrink-0 overflow-hidden transform transition-transform hover:-translate-y-2">
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

      {/* Row 2: Reverse Marquee */}
      <div className="w-full overflow-hidden flex relative pt-2 pb-6">
        <div className="flex animate-marquee-reverse w-max gap-4 md:gap-6 px-2">
          {marqueeImages2.map((img, i) => (
            <div key={`row2-${i}`} className="relative w-[280px] h-[200px] md:w-[400px] md:h-[280px] bg-white border-[3px] border-[#1E1B24] shadow-[6px_6px_0px_#1E1B24] rounded-[24px] shrink-0 overflow-hidden transform transition-transform hover:-translate-y-2">
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
