const SectionBadge = ({ label, className = "" }: { label: string; className?: string }) => (
  <div
    className={`flex flex-row items-start w-fit h-fit rounded-[30px] border-[3px] border-[#1e1b24] shadow-[3px_3px_0px_0px_rgb(30_27_36)] py-2 px-[18px] ${className}`}
  >
    <p className="text-sm font-extrabold text-left text-[#1e1b24] uppercase w-fit h-fit">{label}</p>
  </div>
);

export default SectionBadge;
