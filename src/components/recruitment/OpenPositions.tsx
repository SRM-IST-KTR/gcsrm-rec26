import SectionHeader from "./SectionHeader";
import { ActionButton } from "@/components/common/actionButton";
import JobCard from "./JobCard";

const OpenPositions = () => {
  return (
    <section className="relative w-full lg:w-[1440px] lg:h-[1109px] bg-[#fffeef] py-16 px-5 sm:px-8 lg:py-[100px] lg:px-20 overflow-visible">
      <SectionHeader
        badge="Job Board"
        badgeClass="bg-[#3e9fff]"
        badgeLeftClass="lg:left-[582px]"
        title="Open Roles"
        description="Are you ready to join the defense force? Pick a squad role below and bring your unique flavor of play to our missions!"
      />
      <div className="mt-12 flex flex-col gap-8 lg:hidden">
        <JobCard
          badge="Technical"
          badgeBg="#ff4b4b"
          accent="#ff4b4b"
          buttonTextClass="text-white"
          title="Web Dev / AIML"
          description="Build websites, applications and technical solutions while exploring modern technologies and open-source development."
          image={"/images/recruitment/web-developer.png"}
          imageAlt="Mascot coding on a laptop"
        />
        <JobCard
          badge="Corporate"
          badgeBg="#ffd93d"
          accent="#ffd93d"
          buttonTextClass="text-[#33260d]"
          title="Operations / PR / Sponsorship / Documentation"
          description="Coordinate people, manage operations, document our work and build relationships that help the community grow."
          image={"/images/recruitment/operations-lead.png"}
          imageAlt="Mascot in a business suit"
        />
        <JobCard
          badge="Creatives"
          badgeBg="#3e9fff"
          accent="#3e9fff"
          buttonTextClass="text-white"
          title="VFX / GFX"
          description="Shape the visual identity of GCSRM through graphics, posters, video, motion and creative storytelling."
          image={"/images/recruitment/crayon-creator.png"}
          imageAlt="Mascot holding a crayon"
        />
      </div>
      <img
        className="absolute top-[10px] left-[-70px] w-[170px] h-auto lg:top-[30px] lg:left-[20px] lg:w-[350px] lg:h-auto pointer-events-none z-10"
        src="/images/recruitment/action-punch-mascot.png"
        alt="Action punch mascot"
      />
      <img
        className="lg:hidden absolute bottom-[-80px] right-[10px] w-[120px] h-auto pointer-events-none z-20"
        src="/images/recruitment/role-pig.png"
        alt="Pig mascot"
      />
      <div className="hidden lg:block absolute top-[337px] left-[80px] w-[1280px] h-[672px]">
        <div className="absolute w-[1280px] h-80">
          {/* Technical */}
          <div className="absolute w-[656px] h-80 bg-white rounded-3xl border-[3px] border-[#1e1b24] shadow-[6px_6px_0px_0px_rgb(30_27_36)] p-8">
            <div className="absolute top-[32px] left-[32px] flex flex-row justify-between items-center w-fit h-fit">
              <div className="relative w-fit h-[42px] bg-[#ff4b4b] rounded-[30px] border-[3px] border-[#1e1b24] shadow-[3px_3px_0px_0px_rgb(30_27_36)] py-2 px-[18px]">
                <p className="text-base font-extrabold text-left text-[#1e1b24] uppercase">
                  Technical
                </p>
              </div>
            </div>
            <div className="absolute top-[98px] left-[32px] w-[408px] h-24">
              <p className="absolute text-[28px] font-black text-left text-[#1e1b24] w-[408px]">
                Web Dev / AIML
              </p>
              <p className="absolute top-[47px] text-base font-rubik font-medium text-left text-[#5c5866] leading-normal w-[408px]">
                Build websites, applications and technical solutions while exploring modern
                technologies and open-source development.
              </p>
            </div>
            <div className="absolute top-[228px] left-[32px] w-[592px] h-0 border-2 border-dashed border-[#1e1b24]" />
            <div className="absolute top-[241px] left-[32px] w-[592px] h-14 flex items-center">
              <ActionButton
                href="/apply?domain=Technical"
                text="Apply Now"
                bgColor="bg-[#ff4b4b]"
                textColor="text-white"
                className="uppercase tracking-wider !text-base"
              />
            </div>
            <img
              className="absolute top-[28px] left-[459px] w-44 h-44"
              src="/images/recruitment/web-developer.png"
              alt="Mascot coding on a laptop"
            />
          </div>
          {/* Corporate */}
          <div className="absolute left-[688px] w-[592px] h-80 bg-white rounded-3xl border-[3px] border-[#1e1b24] shadow-[6px_6px_0px_0px_rgb(30_27_36)] p-8">
            <div className="absolute top-[32px] left-[32px] w-[125px] h-[34px]">
              <div className="absolute w-36 h-[42px] bg-[#ffd93d] rounded-[30px] border-[3px] border-[#1e1b24] shadow-[3px_3px_0px_0px_rgb(30_27_36)] py-2 px-[18px]">
                <p className="absolute top-[11px] left-[22px] text-base font-extrabold text-left text-[#1e1b24] uppercase">
                  corporate
                </p>
              </div>
            </div>
            <div className="absolute top-[85px] left-[32px] w-[402px] h-24">
              <p className="absolute top-[-6px] left-[3px] text-2xl font-black text-left text-[#1e1b24] w-[471px]">
                Operations / PR / Sponsorship/ Documentation
              </p>
              <p className="absolute top-[60px] left-[3px] text-sm font-rubik font-medium text-left text-[#5c5866] leading-normal w-[369px] h-[62px]">
                Coordinate people, manage operations, document our work and build relationships that
                help the community grow.
              </p>
            </div>
            <div className="absolute top-[223px] left-[32px] w-[528px] h-0 border-2 border-dashed border-[#1e1b24]" />
            <div className="absolute top-[239px] left-[32px] flex flex-row justify-between items-center w-[528px] h-14">
              <ActionButton
                href="/apply?domain=Corporate"
                text="Apply Now"
                bgColor="bg-[#ffd93d]"
                textColor="text-[#33260d]"
                className="uppercase tracking-wider !text-base"
              />
            </div>
            <img
              className="absolute top-[22px] left-[401px] w-48 h-48"
              src="/images/recruitment/operations-lead.png"
              alt="Mascot in a business suit"
            />
          </div>
        </div>
        {/* Creatives */}
        <div className="absolute top-[352px] left-[328px] w-[624px] h-80">
          <div className="absolute w-[624px] h-80 bg-white rounded-3xl border-[3px] border-[#1e1b24] shadow-[6px_6px_0px_0px_rgb(30_27_36)] p-8">
            <div className="absolute top-[32px] left-[32px] w-[114px] h-[34px]">
              <div className="absolute w-36 h-[42px] bg-[#3e9fff] rounded-[30px] border-[3px] border-[#1e1b24] shadow-[3px_3px_0px_0px_rgb(30_27_36)] py-2 px-[18px]">
                <p className="absolute top-[11px] left-[28px] text-base font-extrabold text-left text-[#1e1b24] uppercase">
                  CREATIVES
                </p>
              </div>
            </div>
            <div className="absolute top-[90px] left-[32px] w-[409px] h-24">
              <p className="absolute text-[28px] font-black text-left text-[#1e1b24] w-[409px]">
                VFX / GFX{" "}
              </p>
              <p className="absolute top-[47px] text-base font-rubik font-medium text-left text-[#5c5866] leading-normal w-[409px]">
                Shape the visual identity of GCSRM through graphics, posters, video, motion and
                creative storytelling.
              </p>
            </div>
            <div className="absolute top-[219px] left-[32px] w-[560px] h-0 border-2 border-dashed border-[#1e1b24]" />
            <div className="absolute top-[239px] left-[32px] w-[560px] h-14 flex items-center">
              <ActionButton
                href="/apply?domain=Creatives"
                text="Apply Now"
                bgColor="bg-[#3e9fff]"
                textColor="text-white"
                className="uppercase tracking-wider !text-base"
              />
            </div>
            <img
              className="absolute top-[27px] left-[447px] w-[135px] h-[182px]"
              src="/images/recruitment/crayon-creator.png"
              alt="Mascot holding a crayon"
            />
          </div>
        </div>
        <img
          className="absolute top-[400px] left-[1100px] w-[278px] h-[330px] pointer-events-none"
          src="/images/recruitment/role-pig.png"
          alt="Pig mascot"
        />
      </div>
    </section>
  );
};

export default OpenPositions;
