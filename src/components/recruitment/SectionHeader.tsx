import SectionBadge from "./SectionBadge";

const SectionHeader = ({
  badge,
  badgeClass,
  badgeLeftClass = "",
  title,
  description,
}: {
  badge: string;
  badgeClass: string;
  badgeLeftClass?: string;
  title: string;
  description: string;
}) => (
  <div className="flex flex-col items-center gap-4 w-full lg:absolute lg:top-[100px] lg:left-[80px] lg:w-[1280px] lg:h-[173px] lg:block">
    <SectionBadge label={badge} className={`lg:absolute ${badgeLeftClass} ${badgeClass}`} />
    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-center text-[#1e1b24] leading-[1.1] w-full lg:absolute lg:top-[50px] lg:w-[1280px]">
      {title}
    </h2>
    <p className="text-base lg:text-lg font-rubik font-medium text-center text-[#5c5866] leading-normal w-full max-w-[640px] lg:absolute lg:top-[119px] lg:left-[320px] lg:w-[640px]">
      {description}
    </p>
  </div>
);

export default SectionHeader;
