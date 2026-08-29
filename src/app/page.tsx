export default function Home() {
  return (
    <main>
      {/* ── Sections go here ── */}
      {/* e.g. <HeroSection />, <WhySection />, <OpenRoles />, etc. */}

      <div className="container-site py-24 text-center">
        <span className="badge badge-red mb-4">We're building, troublemakers!</span>
        <h1 className="font-outfit-black text-5xl md:text-7xl leading-tight mt-4 mb-6">
          SRM GitHub Community
        </h1>
        <p className="font-rubik text-lg text-[--color-text-secondary] max-w-xl mx-auto mb-8">
          Skeleton ready. Start dropping your sections in — hero, roles, values, journey, FAQ, footer.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <a href="#" className="btn-primary">Explore Roles</a>
          <a href="#" className="btn-secondary">GitHub →</a>
        </div>

        {/* Font showcase section */}
        <div className="mt-12 space-y-4 max-w-xl mx-auto">
          <h2 className="font-montserrat text-xl font-semibold text-[--color-text-primary]">Montserrat SemiBold</h2>
          <p className="font-outfit-extrabold text-base">Outfit ExtraBold 800</p>
          <p className="font-rubik-medium text-base">Rubik Medium 500</p>
          <p className="font-overpass-black text-base">Overpass Black 900</p>
        </div>
      </div>
    </main>
  );
}
