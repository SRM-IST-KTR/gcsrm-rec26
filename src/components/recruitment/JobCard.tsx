import Link from "next/link";
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
        <div
          className="w-fit rounded-[30px] border-[3px] border-[#1e1b24] shadow-[3px_3px_0px_0px_rgb(30_27_36)] py-1.5 px-4"
          style={{ backgroundColor: badgeBg }}
        >
          <p className="text-sm font-extrabold text-[#1e1b24] uppercase">{badge}</p>
        </div>
        <p className="text-xl font-black text-[#1e1b24]">{title}</p>
      </div>
      <img className="w-20 h-20 shrink-0 object-contain" src={image} alt={imageAlt} />
    </div>
    <p className="text-sm font-rubik font-medium text-[#5c5866] leading-normal">{description}</p>
    <div className="w-full h-0 border-2 border-dashed border-[#1e1b24]" />
    <Link href={`/apply?domain=${badge}`}
      className="w-fit rounded-[20px] border-[3px] border-[#1e1b24] shadow-[4px_4px_0px_0px_rgb(30_27_36)] py-3 px-6"
      style={{ backgroundColor: accent }}
    >
      <span className={`text-base font-extrabold uppercase ${buttonTextClass}`}>Apply Now</span>
    </Link>
  </div>
);

export default JobCard;
