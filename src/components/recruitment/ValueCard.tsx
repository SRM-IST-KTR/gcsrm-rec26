const ValueCard = ({
  badge,
  badgeBg,
  badgeTextClass,
  title,
  description,
}: {
  badge: string;
  badgeBg: string;
  badgeTextClass: string;
  title: string;
  description: string;
}) => (
  <div className="flex flex-col gap-5 items-start flex-1 h-auto lg:h-[233px] bg-white rounded-3xl border-[3px] border-[#1e1b24] shadow-[6px_6px_0px_0px_rgb(30_27_36)] p-8">
    <div
      className="flex flex-row items-start w-fit h-fit rounded-lg border-2 border-[#1e1b24] py-1.5 px-3"
      style={{ backgroundColor: badgeBg }}
    >
      <p className={`text-xs font-black text-left w-fit h-fit ${badgeTextClass}`}>{badge}</p>
    </div>
    <div className="flex flex-col gap-3 items-start self-stretch h-fit">
      <p className="text-2xl font-black text-left text-[#1e1b24] self-stretch h-fit">{title}</p>
      <p className="text-base font-rubik font-medium text-left text-[#5c5866] leading-normal self-stretch h-fit">
        {description}
      </p>
    </div>
  </div>
);

export default ValueCard;
