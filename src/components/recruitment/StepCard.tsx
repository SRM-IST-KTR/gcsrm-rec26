const StepCard = ({
  step,
  stepBg,
  stepTextClass,
  title,
  description,
  showLine = true,
  className = "",
}: {
  step: string;
  stepBg: string;
  stepTextClass: string;
  title: string;
  description: string;
  showLine?: boolean;
  className?: string;
}) => (
  <div className={`flex flex-col gap-5 items-start w-full lg:w-[302px] h-auto lg:h-[230px] ${className}`}>
    <div className="flex flex-row gap-4 items-center self-stretch h-fit">
      <div
        className="flex flex-row justify-center items-center w-14 h-14 rounded-[28px] border-[3px] border-[#1e1b24] shadow-[3px_3px_0px_0px_rgb(30_27_36)]"
        style={{ backgroundColor: stepBg }}
      >
        <p className={`text-xl font-black text-left w-fit h-fit ${stepTextClass}`}>{step}</p>
      </div>
      {showLine && <div className="flex flex-row items-start flex-1 h-2 bg-[#1e1b24] rounded" />}
    </div>
    <div className="flex flex-col gap-3 items-start self-stretch h-auto lg:h-[154px] bg-white rounded-[20px] border-[3px] border-[#1e1b24] shadow-[4px_4px_0px_0px_rgb(30_27_36)] p-6">
      <p className="text-xl font-black text-left text-[#1e1b24] self-stretch h-fit">{title}</p>
      <p className="text-sm font-rubik font-medium text-left text-[#5c5866] leading-normal self-stretch h-fit">
        {description}
      </p>
    </div>
  </div>
);

export default StepCard;
