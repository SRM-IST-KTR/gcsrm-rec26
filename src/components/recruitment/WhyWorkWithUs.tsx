import SectionHeader from "./SectionHeader";
import FeatureCard from "./FeatureCard";

const WhyWorkWithUs = () => {
  return (
    <section className="relative w-full lg:w-[1440px] lg:h-[725px] bg-[#fffdf0] py-16 px-5 sm:px-8 lg:py-[100px] lg:px-20">
      <SectionHeader
        badge="environment in gcsrm"
        badgeClass="bg-[#ff4b4b]"
        badgeLeftClass="lg:left-[534px]"
        title="Why You'll Love Being Here"
        description="We threw away the boring corporate rulebooks and built our culture around absolute joy, mischief, and creative freedom."
      />
      <div className="mt-12 flex flex-col sm:flex-row sm:flex-wrap lg:flex-nowrap gap-8 items-stretch w-full lg:absolute lg:top-[337px] lg:left-[80px] lg:mt-0 lg:w-[1280px] lg:h-72">
        <FeatureCard
          iconBg="#ff4b4b"
          icon={
            <svg className="w-10 h-10" viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.3163 2C18.7593 2 20.2063 2.4 21.4449 3.4L25.78 7C25.9865 7.2 25.9865 7.6 25.78 7.8C25.5736 8 25.5736 8.4 25.78 8.6L26.8328 9.5C27.0351 9.688 27.3675 9.66 27.6338 9.4C27.96 9.084 28.0467 9.054 28.4575 9.4L30.5218 11.222C30.9037 11.584 30.9264 11.8 30.72 12L27.417 15.8C27.19 16.078 26.8597 16.196 26.5913 16L24.7396 14.4C24.5332 14.2 24.5579 13.848 24.7396 13.6C24.9213 13.352 24.9605 12.992 24.7396 12.8L23.662 11.938C23.34 11.696 23.1955 11.642 22.7331 12C22.4234 12.242 22.2149 12.21 22.0085 12.062C21.8021 11.916 21.831 11.938 21.606 11.758C21.3273 11.538 21.1147 11.494 20.8215 11.8L15.4543 18.2C16.0736 18.6 16.0736 19.4 15.6607 20L7.8369 29C7.0153 29.6 6.18957 30 5.35971 30C4.52985 30 3.91881 29.8 3.30158 29.2C1.85655 28 1.85655 26.2 2.88871 24.8L10.7125 15.8C10.9189 15.6 11.3297 15.4 11.7426 15.4C11.949 15.4 12.3598 15.4 12.5663 15.6L17.1078 10.4C17.9315 9.6 17.6239 8.6 16.7981 7.8L16.3234 7.37C15.2974 6.37 13.8069 6 12.1555 6H11.3339C11.1274 6 11.016 5.76 11.1274 5.6L12.364 4.2C13.6005 2.8 15.4584 2 17.3163 2ZM17.3163 0C14.8391 0 12.3619 1 10.9375 3L9.70099 4.4C9.08376 5 8.87732 6 9.28813 6.8C9.70099 7.6 10.5247 8 11.3483 8H12.3784C13.4085 8 14.4386 8.4 15.062 9L15.4749 9.4L11.7591 13.4H11.5527C10.5233 13.4 9.69755 13.8 9.0755 14.6L1.2517 23.6C-0.602063 25.8 -0.397694 29 1.871 30.8C2.89904 31.6 3.92913 32 5.38036 32C7.02769 32 8.47685 31.4 9.30258 30.2L17.1264 21.2C17.7415 20.4 17.948 19.4 17.7415 18.4L21.6638 14C21.8805 13.762 22.2831 13.774 22.2831 14C22.2831 14.6 22.6959 15.4 23.3152 15.8L25.1669 17.4C25.7862 17.8 26.4041 18 27.0207 18C27.8464 18 28.6722 17.6 29.0809 17L32.3838 13.2C33.416 12.2 33.065 10.56 31.9709 9.6L30.1172 8C29.7043 7.6 29.0864 7.4 28.2634 7.4H28.057C28.057 6.8 27.6441 6 27.0269 5.6L22.6918 2C21.2488 0.6 19.3889 0 17.3245 0L17.3163 0Z" fill="white"/>
            </svg>
          }
          title="Build"
          description="Turn ideas into websites, applications, tools and projects that people can actually use."
        />
        <FeatureCard
          iconBg="#ffd93d"
          icon={
            <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.0002 4L1.3335 12L6.66683 14.9067V22.9067L16.0002 28L25.3335 22.9067V14.9067L28.0002 13.4533V22.6667H30.6668V12L16.0002 4ZM25.0935 12L16.0002 16.96L6.90683 12L16.0002 7.04L25.0935 12ZM22.6668 21.3333L16.0002 24.96L9.3335 21.3333V16.36L16.0002 20L22.6668 16.36V21.3333Z" fill="black"/>
            </svg>
          }
          title="Learn"
          description="Explore emerging technologies, open source and practical skills through hands-on experience."
        />
        <FeatureCard
          iconBg="#3e9fff"
          icon={
            <svg className="w-8 h-8" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 16H9.33333C9.33333 12.8174 10.5976 9.76516 12.8481 7.51472C15.0985 5.26428 18.1507 4 21.3333 4V6.66667C16.1733 6.66667 12 10.84 12 16ZM21.3333 12V9.33333C17.6533 9.33333 14.6667 12.32 14.6667 16H17.3333C17.3333 13.7867 19.12 12 21.3333 12ZM6.66667 2.66667C6.66667 1.18667 5.48 0 4 0C2.52 0 1.33333 1.18667 1.33333 2.66667C1.33333 4.14667 2.52 5.33333 4 5.33333C5.48 5.33333 6.66667 4.14667 6.66667 2.66667ZM12.6 3.33333H9.93333C9.7786 4.26473 9.29833 5.11099 8.57803 5.72141C7.85773 6.33183 6.94416 6.6668 6 6.66667H2C0.893333 6.66667 0 7.56 0 8.66667V12H8V8.98667C9.23537 8.59707 10.3295 7.85396 11.147 6.8492C11.9646 5.84445 12.4697 4.62211 12.6 3.33333ZM22.6667 20C24.1467 20 25.3333 18.8133 25.3333 17.3333C25.3333 15.8533 24.1467 14.6667 22.6667 14.6667C21.1867 14.6667 20 15.8533 20 17.3333C20 18.8133 21.1867 20 22.6667 20ZM24.6667 21.3333H20.6667C19.7225 21.3335 18.8089 20.9985 18.0886 20.3881C17.3683 19.7777 16.8881 18.9314 16.7333 18H14.0667C14.197 19.2888 14.7021 20.5111 15.5196 21.5159C16.3372 22.5206 17.4313 23.2637 18.6667 23.6533V26.6667H26.6667V23.3333C26.6667 22.2267 25.7733 21.3333 24.6667 21.3333Z" fill="white"/>
            </svg>
          }
          title="Connect"
          description="Work with passionate students, developers, designers, organizers and creators."
        />
        <FeatureCard
          iconBg="#4ec37b"
          icon={
            <svg className="w-10 h-10" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M28.5 10.5H40.5V22.5" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M40.5 10.5L23.55 27.45C23.2696 27.7248 22.8926 27.8788 22.5 27.8788C22.1074 27.8788 21.7304 27.7248 21.45 27.45L14.55 20.55C14.2696 20.2752 13.8926 20.1212 13.5 20.1212C13.1074 20.1212 12.7304 20.2752 12.45 20.55L1.5 31.5" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          }
          title="Grow"
          description="Take ownership, collaborate with teams and develop skills that stay with you beyond college."
        />
      </div>
      <img
        className="absolute top-[-60px] right-[-70px] w-[190px] lg:top-[-100px] lg:right-[-200px] lg:w-[500px] h-auto pointer-events-none z-10 object-contain"
        src="/images/recruitment/flying-mascot.png"
        alt="Flying superhero mascot"
      />
    </section>
  );
};

export default WhyWorkWithUs;
