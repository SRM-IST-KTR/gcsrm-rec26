"use client";

import React, { useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  ApplicationStatusProps,
  ParticipantStatus,
  StatusStep,
  StepConfig,
} from "./types";
import { StatusHeader } from "./StatusHeader";
import { StatusStepCard } from "./StatusStepCard";
import { ParticipantSummary } from "./ParticipantSummary";

/**
 * Standard recruitment pipeline steps configuration (Level 01 to Level 04)
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
    title: "Application Review",
    activeDescription:
      "Our recruitment coordinators are currently reviewing your application details.",
    rank: 2,
  },
  {
    id: "level-03",
    level: "Level 03",
    title: "Shortlisting",
    subtitle: "Shortlisting",
    activeDescription:
      "We are currently reviewing your profile to see if you are a match. Hang tight!",
    rank: 3,
  },
  {
    id: "level-04",
    level: "Level 04",
    title: "Task Round",
    activeDescription:
      "Congratulations on reaching the next phase! Follow the instructions sent to your SRM email to complete your task.",
    rank: 4,
  },
];

/**
 * Maps participant.model.ts status enum values to progression rank
 * - 'registered': Application submitted, currently under review (Level 02 active)
 * - 'taskSubmitted': Review completed, shortlisting in progress (Level 03 active)
 * - 'interviewShortlisted': Shortlisted, task/interview round active (Level 04 active)
 * - 'onboarding': Successfully completed all recruitment rounds (All levels completed)
 */
export const STATUS_RANK_MAP: Record<ParticipantStatus, number> = {
  registered: 2,
  taskSubmitted: 3,
  interviewShortlisted: 4,
  onboarding: 5,
};

/**
 * Evaluates the visual state of each step dynamically against the participant's status
 */
export function computeDynamicSteps(
  status: ParticipantStatus,
  stepConfigs: StepConfig[] = DEFAULT_STEP_CONFIGS
): StatusStep[] {
  const currentRank = STATUS_RANK_MAP[status] ?? 2;

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
      return {
        id: config.id,
        level: config.level,
        title: config.title,
        subtitle: config.subtitle,
        description: config.activeDescription,
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
 * ApplicationStatus Component
 *
 * Data-driven Neobrutalist status tracking component for Next.js App Router.
 * Dynamically reflects the applicant's real-time stage from participant.model.ts.
 *
 * - Returns `null` if the participant is not logged in / undefined.
 * - Computes completed, active, and locked states dynamically.
 */
export function ApplicationStatus({
  participant: propParticipant,
  status,
  customSteps = DEFAULT_STEP_CONFIGS,
  badgeText = "PROGRESS",
  title = "Your Application Status",
  cardTitle = "Application Progress",
  className = "",
  showParticipantInfo = false,
}: ApplicationStatusProps) {
  // 1. ALL HOOKS MUST BE DECLARED AT THE VERY TOP
  const { participant: authParticipant } = useAuth();
  const participant = propParticipant !== undefined ? propParticipant : authParticipant;

  const currentStatus: ParticipantStatus =
    status || participant?.status || "registered";

  // Compute visual states dynamically unconditionally
  const steps = useMemo(() => {
    return computeDynamicSteps(currentStatus, customSteps);
  }, [currentStatus, customSteps]);

  // 2. CONDITIONAL RENDERING AFTER ALL HOOKS: Return null if no participant/status is available
  if (!participant && !status) {
    return null;
  }

  return (
    <section
      className={`w-full bg-[#FFFEEF] py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 flex flex-col items-center ${className}`}
      aria-label="Application Status Section"
    >
      <div className="w-full max-w-[760px] mx-auto flex flex-col items-center">
        {/* Section Header */}
        <StatusHeader badgeText={badgeText} title={title} />

        {/* Main Status Container Card */}
        <div className="w-full bg-white border-[3px] border-[#1E1B24] rounded-[24px] shadow-[6px_6px_0px_#1E1B24] sm:shadow-[8px_8px_0px_#1E1B24] p-6 sm:p-8 md:p-10">
          {/* Inner Card Heading */}
          <h3 className="font-outfit-black text-[22px] sm:text-[24px] text-[#1E1B24] tracking-tight mb-6 sm:mb-8 text-left">
            {cardTitle}
          </h3>

          {/* Optional Participant Summary */}
          {showParticipantInfo && participant && (
            <ParticipantSummary participant={participant} />
          )}

          {/* Dynamic Steps List */}
          <div className="flex flex-col gap-4 sm:gap-5 w-full">
            {steps.map((step) => (
              <StatusStepCard key={step.id} step={step} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ApplicationStatus;
