import type { ReactNode } from "react";

const FeatureCard = ({
  icon,
  iconBg,
  title,
  description,
}: {
  icon: ReactNode;
  iconBg: string;
  title: string;
  description: string;
}) => (
  <div className="flex flex-col gap-6 items-start flex-1 self-stretch bg-white rounded-3xl border-[3px] border-[#1e1b24] shadow-[6px_6px_0px_0px_rgb(30_27_36)] p-8">
    <div
      className="flex flex-row justify-center items-center w-16 h-16 rounded-2xl border-[3px] border-[#1e1b24] shadow-[3px_3px_0px_0px_rgb(30_27_36)]"
      style={{ backgroundColor: iconBg }}
    >
      {icon}
    </div>
    <div className="flex flex-col gap-3 items-start self-stretch h-fit">
      <p className="text-[22px] font-black text-left text-[#1e1b24] self-stretch h-fit">{title}</p>
      <p className="text-base font-rubik font-medium text-left text-[#5c5866] leading-normal self-stretch h-fit">
        {description}
      </p>
    </div>
  </div>
);

export default FeatureCard;
