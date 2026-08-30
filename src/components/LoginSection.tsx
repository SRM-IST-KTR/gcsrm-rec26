import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ButtonLink } from "@/components/common/Button";

type LoginSectionProps = {
  onProceed: (email: string) => void;
};

const emailPattern = /^[^\s@]+@srmist\.edu\.in$/i;

export default function LoginSection({ onProceed }: LoginSectionProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();

    if (!emailPattern.test(normalizedEmail)) {
      setError("Please enter a valid SRM email ending with @srmist.edu.in.");
      return;
    }

    setIsChecking(true);
    setError("");

    try {
      const response = await fetch(`/api/participants?email=${encodeURIComponent(normalizedEmail)}`);
      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Unable to verify your email. Please try again.");
        return;
      }

      if (result.exists && result.user) {
        login(result.user);
        router.push("/");
        return;
      }

      onProceed(normalizedEmail);
    } catch {
      setError("Unable to verify your email. Please try again.");
    } finally {
      setIsChecking(false);
    }
  };

  const hasError = Boolean(error);
  const errorMessage = error;

  return (
    <>
      <div
        className="min-h-screen w-full relative flex flex-col items-center justify-center"
        style={{
          backgroundColor: "#fffdf0",
          fontFamily: "'Outfit', sans-serif",
          overflow: "visible",
          backgroundImage: "url('/login/icon.svg')",
          backgroundRepeat: "repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 1,
        }}
      >

      {/* Top-left: Shin-chan with laptop (peeks in from left) */}
      <img
        src="/login/char-laptop.png"
        alt=""
        aria-hidden="true"
        className="absolute pointer-events-none select-none"
        style={{ left: "-30px", top: "20px", width: "clamp(130px, 17vw, 230px)", zIndex: 1 }}
      />

      {/* Top-right: Shin-chan as bee (upside-down, peeks in from right) */}
      <img
        src="/login/char-bee.png"
        alt=""
        aria-hidden="true"
        className="absolute pointer-events-none select-none"
        style={{ right: "-30px", top: "-10px", width: "clamp(140px, 18vw, 250px)", zIndex: 1 }}
      />


      {/* Bottom-left: Action Kamen superhero */}
      <img
        src="/login/char-action-kamen.png"
        alt=""
        aria-hidden="true"
        className="absolute pointer-events-none select-none"
        style={{ left: "-10px", bottom: "-20px", width: "clamp(150px, 20vw, 280px)", zIndex: 1 }}
      />

      {/* Bottom-right: green robot arm */}
      <img
        src="/login/char-robot.png"
        alt=""
        aria-hidden="true"
        className="absolute pointer-events-none select-none"
        style={{ right: "-20px", bottom: "-20px", width: "clamp(140px, 19vw, 260px)", zIndex: 1 }}
      />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center w-full px-4">
        <div
          className="mb-5 px-8 py-[10px] rounded-full border-[3px] border-[#1e1b24]"
          style={{
            backgroundColor: "#4ec37b",
            boxShadow: "3px 3px 0px #1e1b24",
          }}
        >
          <span
            className="text-[#1e1b24] text-2xl uppercase tracking-wide"
            style={{ fontWeight: 800 }}
          >
            GCSRM
          </span>
        </div>
        

        {/* Login heading */}
        <h1
          className="text-[#1e1b24] text-center mb-8 leading-tight"
          style={{ fontWeight: 900, fontSize: "clamp(2rem, 6vw, 3.5rem)" }}
        >
          Login!!!
        </h1>

        {/* Form card */}
        <div className="relative w-full max-w-md">
{/* Car that drives smoothly around the card border in a clockwise loop */}
<img
  src="/login/char-pixel-car.png"
  alt=""
  aria-hidden="true"
  className="pointer-events-none select-none z-20"
  style={{
    position: "absolute",
    width: "clamp(54px, 10vw, 76px)",
    height: "auto",
    animation: "drive-around-box 10s linear infinite",
    willChange: "top, left, transform",
  }}
/>

<style>{`
  @keyframes drive-around-box {
    /* 1. TOP EDGE (Left to Right) */
    0% {
      top: 0%;
      left: 0%;
      transform: translate(-50%, -60%) scaleX(-1) rotate(0deg);
    }
    28% {
      top: 0%;
      left: 100%;
      transform: translate(-50%, -60%) scaleX(-1) rotate(0deg);
    }
    /* Top-Right Corner Turn */
    32% {
      top: 0%;
      left: 100%;
      transform: translate(-35%, -50%) scaleX(-1) rotate(90deg);
    }
    /* 2. RIGHT EDGE (Top to Bottom) */
    48% {
      top: 100%;
      left: 100%;
      transform: translate(-35%, -50%) scaleX(-1) rotate(90deg);
    }
    /* Bottom-Right Corner Turn */
    52% {
      top: 100%;
      left: 100%;
      transform: translate(-50%, -35%) scaleX(-1) rotate(180deg);
    }
    /* 3. BOTTOM EDGE (Right to Left) */
    78% {
      top: 100%;
      left: 0%;
      transform: translate(-50%, -35%) scaleX(-1) rotate(180deg);
    }
    /* Bottom-Left Corner Turn */
    82% {
      top: 100%;
      left: 0%;
      transform: translate(-65%, -50%) scaleX(-1) rotate(270deg);
    }
    /* 4. LEFT EDGE (Bottom to Top) */
    96% {
      top: 0%;
      left: 0%;
      transform: translate(-65%, -50%) scaleX(-1) rotate(270deg);
    }
    /* Top-Left Corner Turn back to start */
    100% {
      top: 0%;
      left: 0%;
      transform: translate(-50%, -60%) scaleX(-1) rotate(360deg);
    }
  }
`}</style>

          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl p-8 w-full"
            style={{
              border: "3px solid #1e1b24",
              boxShadow: "6px 6px 0px #1e1b24",
            }}
          >
          <label
            htmlFor="email"
            className="block text-[#1e1b24] mb-3 text-lg"
            style={{ fontWeight: 900 }}
          >
            SRM Email id
          </label>

          <div className="relative" style={{ overflow: "visible" }}>
            <input
              type="email"
              id="email"
              required
              placeholder="gc2026@srmist.edu.in"
              value={email}
              onChange={handleChange}
              className="w-full rounded-2xl px-5 py-4 text-[#1e1b24] text-base focus:outline-none transition-all"
              style={{
                border: `2px solid ${hasError ? "#d92323" : "#1e1b24"}`,
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 400,
              }}
            />
          </div>

          {hasError && (
            <p
              className="mt-2 text-sm"
              role="alert"
              style={{ color: "#d92323", fontWeight: 500 }}
            >
              {errorMessage}
            </p>
          )}

            <button
              type="submit"
              disabled={isChecking}
              className="mt-5 w-full rounded-2xl py-4 text-white text-xl uppercase tracking-wide disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
              style={{
                backgroundColor: "#3e9fff",
                border: "3px solid #1e1b24",
                boxShadow: "4px 4px 0px #1e1b24",
                fontWeight: 800,
                fontFamily: "'Outfit', sans-serif",
                transition: "box-shadow 0.1s ease, transform 0.1s ease",
              }}
              onMouseEnter={(e) => {
                if (!isChecking) {
                  e.currentTarget.style.boxShadow = "2px 2px 0px #1e1b24";
                  e.currentTarget.style.transform = "translate(2px, 2px)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "4px 4px 0px #1e1b24";
                e.currentTarget.style.transform = "translate(0, 0)";
              }}
            >
              {isChecking ? "Checking..." : "Proceed"}
            </button>
          </form>
        </div>

        <div className="mt-8">
          <ButtonLink
            text="BACK TO HOME"
            link="/"
            bgColor="bg-[#FF4B4B]"
            className="px-8 py-3 text-[1.05rem] rounded-[20px] tracking-[1px]"
          />
        </div>
      </div>
    </div>
    </>
  );
}
