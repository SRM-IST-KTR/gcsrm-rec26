"use client";

import React, { useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  ApplicationStatusProps,
  ParticipantData,
  ParticipantStatus,
  StatusStep,
  StepConfig,
} from "./types";
import { StatusHeader } from "./StatusHeader";
import { StatusStepCard } from "./StatusStepCard";
import { ParticipantSummary } from "./ParticipantSummary";
import { SubmitTaskModal } from "./SubmitTaskModal";

/**
 * Standard recruitment pipeline steps configuration (Level 01 to Level 05)
 */
export const DEFAULT_STEP_CONFIGS: StepConfig[] = [
  {
    id: "level-01",
    level: "Level 01",
    title: "Application Submitted",
    activeDescription:
      "Your application has been received and logged in our system.",
    rank: 1,
  },
  {
    id: "level-02",
    level: "Level 02",
    title: "Task Round",
    activeDescription:
      "Your recruitment task has been assigned. Please complete and submit your solution.",
    rank: 2,
  },
  {
    id: "level-03",
    level: "Level 03",
    title: "Review & Evaluation",
    activeDescription:
      "Your task submission is being reviewed by domain leads and technical mentors.",
    rank: 3,
  },
  {
    id: "level-04",
    level: "Level 04",
    title: "Interview Phase",
    activeDescription:
      "You have been shortlisted for the personal interview round! Check your SRM email for schedule details.",
    rank: 4,
  },
  {
    id: "level-05",
    level: "Level 05",
    title: "Onboarding",
    activeDescription:
      "Congratulations on reaching the final phase! Welcome to GitHub Community SRM.",
    rank: 5,
  },
];

/**
 * Maps backend participant status values to progression rank
 */
export const STATUS_RANK_MAP: Record<ParticipantStatus, number> = {
  registered: 1,
  task_assigned: 2,
  taskSubmitted: 3,
  underReview: 3,
  interviewShortlisted: 4,
  interviewShortlist: 4,
  onboarding: 5,
  rejected: 0,
};

/**
 * Evaluates the visual state of each step dynamically against the participant's status
 */
export function computeDynamicSteps(
  status: ParticipantStatus,
  stepConfigs: StepConfig[] = DEFAULT_STEP_CONFIGS
): StatusStep[] {
  // Consolidate duplicate interview enums
  const normalizedStatus =
    status === "interviewShortlist" ? "interviewShortlisted" : status;

  if (normalizedStatus === "rejected") {
    return stepConfigs.map((config) => ({
      id: config.id,
      level: config.level,
      title: config.title,
      subtitle: config.subtitle,
      state: "locked" as const,
    }));
  }

  const currentRank = STATUS_RANK_MAP[normalizedStatus] ?? 1;

  return stepConfigs.map((config) => {
    if (config.rank < currentRank) {
      return {
        id: config.id,
        level: config.level,
        title: config.title,
        subtitle: config.subtitle,
        state: "completed" as const,
      };
    }

    if (config.rank === currentRank) {
      let description = config.activeDescription;
      if (normalizedStatus === "registered" && config.rank === 1) {
        description =
          "Your application has been received and logged. Task assignment will open shortly.";
      } else if (normalizedStatus === "task_assigned" && config.rank === 2) {
        description =
          "Your domain task has been assigned. Please complete and submit your solution.";
      } else if (normalizedStatus === "taskSubmitted" && config.rank === 3) {
        description =
          "Your task has been received and is pending review by domain mentors.";
      } else if (normalizedStatus === "underReview" && config.rank === 3) {
        description =
          "Your submission and profile are under active evaluation by the technical panel.";
      } else if (normalizedStatus === "interviewShortlisted" && config.rank === 4) {
        description =
          "Congratulations! You have been shortlisted for the personal interview round. Check your SRM email for details.";
      } else if (normalizedStatus === "onboarding" && config.rank === 5) {
        description =
          "Welcome to the team! Follow the onboarding instructions sent to your SRM email.";
      }

      return {
        id: config.id,
        level: config.level,
        title: config.title,
        subtitle: config.subtitle,
        description,
        state: "active" as const,
      };
    }

    return {
      id: config.id,
      level: config.level,
      title: config.title,
      subtitle: config.subtitle,
      state: "locked" as const,
    };
  });
}

/**
 * Renders distinct Neobrutalist Hero Status Card based on the participant's current status
 */
export function StatusHeroCard({
  status,
  participant,
  onSubmitTask,
}: {
  status: ParticipantStatus;
  participant?: Partial<ParticipantData> | null;
  onSubmitTask?: () => void;
}) {
  const normalizedStatus =
    status === "interviewShortlist" ? "interviewShortlisted" : status;

  // 1. Interview Shortlisted (interviewShortlisted or interviewShortlist)
  if (normalizedStatus === "interviewShortlisted") {
    return (
      <div className="w-full bg-[#EBFBF0] border-[3px] border-[#1E1B24] rounded-[20px] p-5 sm:p-6 shadow-[4px_4px_0px_#1E1B24] mb-6 flex flex-col gap-3 text-left">
        <div className="flex items-center gap-2.5">
          <span className="font-outfit-black text-[12px] uppercase tracking-[1.5px] text-white px-3 py-1 rounded-full border-2 border-[#1E1B24] shadow-[2px_2px_0px_#1E1B24] bg-[#4EC37B]">
            INTERVIEW SHORTLISTED
          </span>
          <span className="text-xl">🎉</span>
        </div>
        <h4 className="font-outfit-black text-[20px] sm:text-[22px] text-[#1E1B24] tracking-tight leading-tight">
          Congratulations! You&apos;ve Been Shortlisted
        </h4>
        <p className="font-rubik text-[14px] sm:text-[15px] font-medium text-[#1E1B24] leading-relaxed">
          Your application and task submission stood out to our domain leads. You have been selected for the Interview Round!
        </p>
        <div className="bg-white border-2 border-[#1E1B24] rounded-[14px] p-3.5 sm:p-4 mt-1 flex flex-col gap-2 shadow-[2px_2px_0px_#1E1B24]">
          <span className="font-outfit-black text-xs uppercase tracking-wider text-[#1E1B24]">
            Next Steps &amp; Preparation:
          </span>
          <ul className="font-rubik text-xs sm:text-[13px] text-[#5C5866] font-medium space-y-1 list-disc list-inside">
            <li>Check your SRM email regularly for your personal interview slot and meeting link.</li>
            <li>Keep your task code, demo links, and GitHub profile handy during the call.</li>
            <li>Be ready to talk through your thought process, interests, and domain motivations.</li>
          </ul>
        </div>
      </div>
    );
  }

  // 2. Task Assigned
  if (normalizedStatus === "task_assigned") {
    return (
      <div className="w-full bg-[#FFFDF0] border-[3px] border-[#1E1B24] rounded-[20px] p-5 sm:p-6 shadow-[4px_4px_0px_#1E1B24] mb-6 flex flex-col gap-3 text-left">
        <div className="flex items-center gap-2.5">
          <span className="font-outfit-black text-[12px] uppercase tracking-[1.5px] text-[#1E1B24] px-3 py-1 rounded-full border-2 border-[#1E1B24] shadow-[2px_2px_0px_#1E1B24] bg-[#FFD93D]">
            TASK ASSIGNED
          </span>
        </div>
        <h4 className="font-outfit-black text-[20px] sm:text-[22px] text-[#1E1B24] tracking-tight leading-tight">
          Your Domain Task is Ready
        </h4>
        <p className="font-rubik text-[14px] sm:text-[15px] font-medium text-[#1E1B24] leading-relaxed">
          Your recruitment task has been assigned. Please check the requirements for your chosen domain, build your solution, and submit before the deadline.
        </p>
        {onSubmitTask && (
          <button
            type="button"
            onClick={onSubmitTask}
            className="w-full sm:w-fit mt-2 px-6 py-3 rounded-xl border-2 border-[#1E1B24] bg-[#4EC37B] text-white font-outfit-black text-sm uppercase tracking-wider shadow-[3px_3px_0px_#1E1B24] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#1E1B24] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
          >
            Submit Task
          </button>
        )}
      </div>
    );
  }

  // 3. Task Submitted
  if (normalizedStatus === "taskSubmitted") {
    return (
      <div className="w-full bg-[#EFF8FF] border-[3px] border-[#1E1B24] rounded-[20px] p-5 sm:p-6 shadow-[4px_4px_0px_#1E1B24] mb-6 flex flex-col gap-3 text-left">
        <div className="flex items-center gap-2.5">
          <span className="font-outfit-black text-[12px] uppercase tracking-[1.5px] text-white px-3 py-1 rounded-full border-2 border-[#1E1B24] shadow-[2px_2px_0px_#1E1B24] bg-[#3E9FFF]">
            TASK RECEIVED
          </span>
        </div>
        <h4 className="font-outfit-black text-[20px] sm:text-[22px] text-[#1E1B24] tracking-tight leading-tight">
          Task Submission Received
        </h4>
        <p className="font-rubik text-[14px] sm:text-[15px] font-medium text-[#1E1B24] leading-relaxed">
          We have successfully received your task submission. Our domain reviewers and mentors are currently assessing all solutions.
        </p>
      </div>
    );
  }

  // 4. Under Review
  if (normalizedStatus === "underReview") {
    return (
      <div className="w-full bg-[#FFFBEB] border-[3px] border-[#1E1B24] rounded-[20px] p-5 sm:p-6 shadow-[4px_4px_0px_#1E1B24] mb-6 flex flex-col gap-3 text-left">
        <div className="flex items-center gap-2.5">
          <span className="font-outfit-black text-[12px] uppercase tracking-[1.5px] text-white px-3 py-1 rounded-full border-2 border-[#1E1B24] shadow-[2px_2px_0px_#1E1B24] bg-[#F59E0B]">
            UNDER REVIEW
          </span>
          <span className="text-xl">🔍</span>
        </div>
        <h4 className="font-outfit-black text-[20px] sm:text-[22px] text-[#1E1B24] tracking-tight leading-tight">
          Application &amp; Task Under Evaluation
        </h4>
        <p className="font-rubik text-[14px] sm:text-[15px] font-medium text-[#1E1B24] leading-relaxed">
          Our technical leads are actively reviewing your submission and profile. Shortlisted candidates will be notified via SRM email.
        </p>
      </div>
    );
  }

  // 5. Onboarding (Selected)
  if (normalizedStatus === "onboarding") {
    return (
      <div className="w-full bg-[#ECFDF5] border-[3px] border-[#1E1B24] rounded-[20px] p-5 sm:p-6 shadow-[4px_4px_0px_#1E1B24] mb-6 flex flex-col gap-3 text-left">
        <div className="flex items-center gap-2.5">
          <span className="font-outfit-black text-[12px] uppercase tracking-[1.5px] text-white px-3 py-1 rounded-full border-2 border-[#1E1B24] shadow-[2px_2px_0px_#1E1B24] bg-[#10B981]">
            WELCOME ABOARD
          </span>
          <span className="text-xl">🌟</span>
        </div>
        <h4 className="font-outfit-black text-[20px] sm:text-[22px] text-[#1E1B24] tracking-tight leading-tight">
          Welcome to GitHub Community SRM!
        </h4>
        <p className="font-rubik text-[14px] sm:text-[15px] font-medium text-[#1E1B24] leading-relaxed">
          Congratulations on making it through all recruitment phases! You have been inducted into the team. Keep an eye on your email for onboarding calls, server invites, and orientation schedules.
        </p>
      </div>
    );
  }

  // 6. Rejected
  if (normalizedStatus === "rejected") {
    return (
      <div className="w-full bg-[#FFF5F5] border-[3px] border-[#1E1B24] rounded-[20px] p-5 sm:p-6 shadow-[4px_4px_0px_#1E1B24] mb-6 flex flex-col gap-3 text-left">
        <div className="flex items-center gap-2.5">
          <span className="font-outfit-black text-[12px] uppercase tracking-[1.5px] text-white px-3 py-1 rounded-full border-2 border-[#1E1B24] shadow-[2px_2px_0px_#1E1B24] bg-[#EF4444]">
            STATUS UPDATE
          </span>
        </div>
        <h4 className="font-outfit-black text-[20px] sm:text-[22px] text-[#1E1B24] tracking-tight leading-tight">
          Application Update
        </h4>
        <p className="font-rubik text-[14px] sm:text-[15px] font-medium text-[#1E1B24] leading-relaxed">
          Thank you for your enthusiasm and for taking the time to apply to GitHub Community SRM. Due to competitive slot limits this season, we are unable to move forward with your application for this cycle.
        </p>
        <p className="font-rubik text-xs sm:text-[13px] text-[#5C5866] font-medium leading-relaxed">
          We encourage you to keep exploring, attend our public hackathons &amp; open workshops, and apply again in our upcoming recruitment drives!
        </p>
      </div>
    );
  }

  // 7. Default: 'registered'
  return (
    <div className="w-full bg-[#FFFEEF] border-[3px] border-[#1E1B24] rounded-[20px] p-5 sm:p-6 shadow-[4px_4px_0px_#1E1B24] mb-6 flex flex-col gap-2.5 text-left">
      <div className="flex items-center gap-2.5">
        <span className="font-outfit-black text-[12px] uppercase tracking-[1.5px] text-[#1E1B24] px-3 py-1 rounded-full border-2 border-[#1E1B24] shadow-[2px_2px_0px_#1E1B24] bg-[#FFD93D]">
          APPLICATION LOGGED
        </span>
        <span className="text-xl">📋</span>
      </div>
      <h4 className="font-outfit-black text-[20px] sm:text-[22px] text-[#1E1B24] tracking-tight leading-tight">
        Application Successfully Submitted
      </h4>
      <p className="font-rubik text-[14px] sm:text-[15px] font-medium text-[#1E1B24] leading-relaxed">
        Your registration details have been verified and recorded. You will be notified once tasks are assigned for your chosen domain.
      </p>
    </div>
  );
}

/**
 * ApplicationStatus Component
 *
 * Data-driven Neobrutalist status tracking component for Next.js App Router.
 * Dynamically reflects the applicant's real-time stage from the backend participant schema.
 */
export function ApplicationStatus({
  participant: propParticipant,
  status,
  customSteps = DEFAULT_STEP_CONFIGS,
  badgeText = "PROGRESS",
  title = "Your Application Status",
  cardTitle = "Application Progress",
  className = "",
  showParticipantInfo = true,
}: ApplicationStatusProps) {
  const { participant: authParticipant } = useAuth();
  const participant = propParticipant !== undefined ? propParticipant : authParticipant;

  const [showSubmitModal, setShowSubmitModal] = React.useState(false);

  const currentStatus: ParticipantStatus =
    status || participant?.status || "registered";

  // Compute visual states dynamically unconditionally
  const steps = useMemo(() => {
    return computeDynamicSteps(currentStatus, customSteps);
  }, [currentStatus, customSteps]);

  if (!participant && !status) {
    return null;
  }

  return (
    <section
      id="status"
      className={`w-full bg-[#FFFEEF] py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 flex flex-col items-center ${className}`}
      aria-label="Application Status Section"
    >
      <div className="w-full max-w-[760px] mx-auto flex flex-col items-center">
        {/* Section Header */}
        <StatusHeader badgeText={badgeText} title={title} />

        {/* Main Status Container Card */}
        <div className="w-full bg-white border-[3px] border-[#1E1B24] rounded-[24px] shadow-[6px_6px_0px_#1E1B24] sm:shadow-[8px_8px_0px_#1E1B24] p-6 sm:p-8 md:p-10">
          {/* Inner Card Heading */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 sm:mb-8">
            <h3 className="font-outfit-black text-[22px] sm:text-[24px] text-[#1E1B24] tracking-tight text-left">
              {cardTitle}
            </h3>
            {participant?.name && (
              <span className="font-rubik text-sm font-bold text-[#5C5866]">
                Applicant: <strong className="text-[#1E1B24] font-outfit-black">{participant.name}</strong>
              </span>
            )}
          </div>

          {/* Optional Participant Summary */}
          {showParticipantInfo && participant && (
            <ParticipantSummary participant={participant} />
          )}

          {/* Dynamic Status Hero Card */}
          <StatusHeroCard
            status={currentStatus}
            participant={participant}
            onSubmitTask={() => setShowSubmitModal(true)}
          />

          {/* Dynamic Steps List */}
          <div className="flex flex-col gap-4 sm:gap-5 w-full">
            {steps.map((step) => (
              <StatusStepCard key={step.id} step={step} />
            ))}
          </div>
        </div>
      </div>

      {/* Submit Task Modal */}
      <SubmitTaskModal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        participant={participant}
      />
    </section>
  );
}

export default ApplicationStatus;
