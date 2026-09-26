/**
 * Types and interfaces for the ApplicationStatus component.
 * Data models are strictly aligned with the backend participant schema.
 */

export type ParticipantStatus =
  | "registered"
  | "task_assigned"
  | "taskSubmitted"
  | "interviewShortlisted"
  | "interviewShortlist"
  | "onboarding"
  | "rejected"
  | "underReview";

export type StepState = "completed" | "active" | "locked";

export interface ParticipantLinks {
  github?: string | null;
  demo?: string | null;
  deployment?: string | null;
  portfolio?: string | null;
  design?: string | null;
  designFiles?: string | null;
  figmaPlugins?: string | null;
  introVideo?: string | null;
  document?: string | null;
}

export interface ParticipantData {
  _id?: string;
  name: string;
  email: string;
  registrationNumber: string;
  phone?: string;
  year?: string;
  domain?: string;
  subdomain?: string;
  degreeWithBranch?: string;
  links?: ParticipantLinks;
  status: ParticipantStatus;
  isOnboarded?: boolean;
  onboardedData?: OnboardedMemberRecord | Record<string, unknown> | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
export interface RecruitmentTask {
  _id?: string;
  id?: string;
  taskType: string;
  title: string;
  goal: string;
  description: string;
  guidelines: string;
  requirements: string[];
  techStack: string[];
}

export interface StepConfig {
  id: string;
  level: string; // e.g. "Level 01"
  title: string; // e.g. "Application Submitted"
  subtitle?: string; // e.g. "Shortlisting"
  activeDescription: string; // Dynamic description shown when this step is active ("YOU ARE HERE")
  rank: number; // Progression rank (1-indexed)
}

export interface StatusStep {
  id: string;
  level: string;
  title: string;
  subtitle?: string;
  description?: string;
  state: StepState;
}

export interface ApplicationStatusProps {
  /**
   * Participant data mapped from the backend participant schema.
   * If null or undefined (e.g. user not logged in), the component renders null.
   */
  participant?: Partial<ParticipantData> | null;
  /** Explicit participant status override */
  status?: ParticipantStatus | null;
  /** Array of tasks to display in the task details modal */
  tasks?: RecruitmentTask[];
  /** Custom list of status step configurations */
  customSteps?: StepConfig[];
  /** Custom top pill badge text (defaults to "PROGRESS") */
  badgeText?: string;
  /** Custom main section heading (defaults to "Your Application Status") */
  title?: string;
  /** Custom inner card heading (defaults to "Application Progress") */
  cardTitle?: string;
  /** Additional container CSS class names */
  className?: string;
  /** Toggle displaying participant info banner (defaults to true) */
  showParticipantInfo?: boolean;
  /** Callback triggered when clicking "Update Data" in the onboarding status card */
  onUpdateData?: () => void;
  /** Callback triggered when clicking "Instructions" in the onboarding status card */
  onOpenInstructions?: () => void;
  /** Callback triggered when clicking "Location" in the onboarding status card */
  onOpenLocation?: () => void;
}

export interface FacultyAdvisorDetails {
  faname: string;
  faphonenumber: string;
  faemailid: string;
}

export interface SocialLinksDetails {
  insta?: string;
  github?: string;
  linkedin?: string;
  portfolio?: string;
}

export interface OnboardMemberPayload {
  name: string;
  email: string;
  phoneno: string;
  section: string;
  domain: string;
  subdomain?: string;
  position: string;
  joined_yr: number;
  isCurrentMember?: boolean;
  caption?: string;
  picture: File;
  nda: File;
  faDetails: FacultyAdvisorDetails[];
  socials: SocialLinksDetails[];
}

export interface OnboardedMemberRecord {
  _id?: string;
  name?: string;
  email?: string;
  phoneno?: string;
  section?: string;
  domain?: string;
  subdomain?: string;
  position?: string;
  joined_yr?: number;
  isCurrentMember?: boolean;
  caption?: string;
  pictureUrl?: string;
  picture?: string;
  ndaUrl?: string;
  nda?: string;
  faDetails?: FacultyAdvisorDetails[];
  socials?: SocialLinksDetails[];
}
