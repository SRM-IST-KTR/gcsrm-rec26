import { ActionButton } from "@/components/common/actionButton";
import SectionBadge from "@/components/common/SectionBadge";

const JobCard = ({
  badge,
  badgeBg,
  accent,
  buttonTextClass,
  title,
  description,
  image,
  imageAlt,
}: {
  badge: string;
  badgeBg: string;
  accent: string;
  buttonTextClass: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
}) => (
  <div className="flex flex-col gap-4 w-full bg-white rounded-3xl border-[3px] border-[#1e1b24] shadow-[6px_6px_0px_0px_rgb(30_27_36)] p-6">
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
      <div className="min-w-0 flex flex-col gap-3">
        <SectionBadge label={badge} bgColor={badgeBg} className="!py-1.5 !px-4" />
        <p className="text-xl font-black text-[#1e1b24]">{title}</p>
      </div>
      <img className="w-20 h-20 shrink-0 object-contain" src={image} alt={imageAlt} />
    </div>
    <p className="text-sm font-rubik font-medium text-[#5c5866] leading-normal">{description}</p>
    <div className="w-full h-0 border-2 border-dashed border-[#1e1b24]" />
    <div className="w-fit">
      <ActionButton
        href={`/apply?domain=${badge}`}
        text="Apply Now"
        bgColor={badge === "Technical" ? "bg-[#ff4b4b]" : badge === "Corporate" ? "bg-[#ffd93d]" : "bg-[#3e9fff]"}
        textColor={buttonTextClass}
        className="uppercase tracking-wider !text-sm sm:!text-base"
      />
    </div>
  </div>
);

export default JobCard;
