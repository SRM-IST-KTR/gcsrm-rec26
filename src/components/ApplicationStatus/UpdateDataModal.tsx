"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Lock,
  GraduationCap,
  Share2,
  FileText,
  Loader2,
  Sparkles,
  Info,
  ChevronDown,
  ExternalLink,
  Globe,
  UploadCloud,
  ImageIcon,
  FileCheck,
  Trash2,
} from "lucide-react";
import { ParticipantData, OnboardMemberPayload } from "./types";
import { api, ApiError } from "@/lib/api";
import { getOtpSession } from "@/lib/otpSession";
import { useOtp } from "@/hooks/useOtp";
import { OtpInput } from "@/components/OtpInput";
import { SendOtpButton } from "@/components/SendOtpButton";
import { ResendOtpLink } from "@/components/ResendOtpLink";
import { useAuth } from "@/context/AuthContext";
import Popup from "@/components/common/Popup";
import onboardingData from "./onboardingInstructions.json";

export interface UpdateDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  participant?: Partial<ParticipantData> | null;
  onSave?: (data: OnboardMemberPayload) => void;
  onSuccess?: () => void;
}

interface FormState {
  phoneno: string;
  section: string;
  caption: string;
  pictureUrl: string;
  faname: string;
  faphonenumber: string;
  faemailid: string;
  github: string;
  linkedin: string;
  insta: string;
  portfolio: string;
  ndaUrl: string;
}

const INITIAL_FORM_STATE: FormState = {
  phoneno: "",
  section: "",
  caption: "",
  pictureUrl: "",
  faname: "",
  faphonenumber: "",
  faemailid: "",
  github: "",
  linkedin: "",
  insta: "",
  portfolio: "",
  ndaUrl: "",
};

const ndaTemplate = onboardingData.ndaTemplate;

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES =
  "image/jpeg,image/png,image/heic,image/heif,.heic,.heif";
const ALLOWED_FILE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".heic", ".heif"];
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/heic",
  "image/heif",
];

function validateUploadedFile(file: File): string | null {
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return `File size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds 5MB limit.`;
  }
  const ext = "." + (file.name.split(".").pop() || "").toLowerCase();
  if (ext === ".pdf" || file.type === "application/pdf") {
    return "PDF files are not accepted. Please upload an image/camera scan (JPG, PNG, HEIC, HEIF).";
  }
  const isExtValid = ALLOWED_FILE_EXTENSIONS.includes(ext);
  const isMimeValid = ALLOWED_MIME_TYPES.includes(file.type.toLowerCase());
  if (!isExtValid && !isMimeValid) {
    return "Invalid format. Accepted formats: JPG, JPEG, PNG, HEIC, HEIF.";
  }
  return null;
}

export function UpdateDataModal({
  isOpen,
  onClose,
  participant,
  onSave,
  onSuccess,
}: UpdateDataModalProps) {
  const router = useRouter();
  const { updateParticipant } = useAuth();

  const candidateEmail = useMemo(
    () => (participant?.email || "candidate").toLowerCase().trim(),
    [participant?.email],
  );
  const draftStorageKey = `onboarding_draft_${candidateEmail}`;

  // Form State
  const [formData, setFormData] = useState<FormState>(INITIAL_FORM_STATE);
  const [openSection, setOpenSection] = useState<number | null>(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [isLoadingMember, setIsLoadingMember] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // File Upload State
  const [pictureFile, setPictureFile] = useState<File | null>(null);
  const [picturePreview, setPicturePreview] = useState<string | null>(null);
  const [ndaFile, setNdaFile] = useState<File | null>(null);
  const [ndaPreview, setNdaPreview] = useState<string | null>(null);

  const pictureInputRef = useRef<HTMLInputElement>(null);
  const ndaInputRef = useRef<HTMLInputElement>(null);

  // Timed Success & Toast State
  const [countdown, setCountdown] = useState(3);
  const autoCloseTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [popup, setPopup] = useState<{
    isOpen: boolean;
    type: "success" | "error" | "info";
    title?: string;
    message: string;
    autoCloseMs?: number;
  }>({
    isOpen: false,
    type: "info",
    message: "",
  });

  // OTP Verification State
  const [showOtpStep, setShowOtpStep] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [otpToken, setOtpToken] = useState<string | null>(null);
  const isVerifyingRef = useRef(false);
  const {
    phase: otpPhase,
    error: otpError,
    resendCooldown,
    sendOtp,
    verifyOtp,
    jumpToVerify,
    reset: resetOtp,
  } = useOtp();

  useEffect(() => {
    if (isOpen) {
      const session = getOtpSession();
      if (session?.token) {
        setOtpToken(session.token);
      }
    }
  }, [isOpen]);

  const clearTimers = useCallback(() => {
    if (autoCloseTimerRef.current) {
      clearTimeout(autoCloseTimerRef.current);
      autoCloseTimerRef.current = null;
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
  }, []);

  const handleCloseSuccess = useCallback(() => {
    clearTimers();
    setIsSuccess(false);
    setIsOnboarded(true);
    onClose();
    if (typeof window !== "undefined") {
      router.push("/#status");
      const el = document.getElementById("status");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [clearTimers, onClose, router]);

  const populateFormFromMemberData = useCallback((data: any) => {
    if (!data || typeof data !== "object") return;
    const fa =
      Array.isArray(data.faDetails) && data.faDetails[0]
        ? data.faDetails[0]
        : {};
    const social =
      Array.isArray(data.socials) && data.socials[0] ? data.socials[0] : {};

    setFormData({
      phoneno: (data.phoneno || "").replace(/\D/g, "").slice(-10),
      section: data.section || "",
      caption: data.caption || "",
      pictureUrl: data.pictureUrl || data.picture || "",
      faname: fa.faname || "",
      faphonenumber: (fa.faphonenumber || "").replace(/\D/g, "").slice(-10),
      faemailid: fa.faemailid || "",
      github: social.github || "",
      linkedin: social.linkedin || "",
      insta: social.insta || "",
      portfolio: social.portfolio || "",
      ndaUrl: data.ndaUrl || data.nda || "",
    });
  }, []);

  // Object URL lifecycle for live file previews
  useEffect(() => {
    if (!pictureFile) {
      setPicturePreview(null);
      return;
    }
    const url = URL.createObjectURL(pictureFile);
    setPicturePreview(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [pictureFile]);

  useEffect(() => {
    if (!ndaFile) {
      setNdaPreview(null);
      return;
    }
    const url = URL.createObjectURL(ndaFile);
    setNdaPreview(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [ndaFile]);

  // Guard to ensure api.getTeamMember is called strictly once per modal open
  const hasFetchedMemberRef = useRef<string | null>(null);

  // Initialize and load saved draft from localStorage or participant session
  useEffect(() => {
    if (!isOpen) {
      clearTimers();
      hasFetchedMemberRef.current = null;
      setIsLoadingMember(false);
      setPictureFile(null);
      setNdaFile(null);
      return;
    }

    const alreadyOnboarded =
      Boolean(participant?.isOnboarded) ||
      (participant as any)?.status === "onboarded";
    setIsOnboarded(alreadyOnboarded);

    const existingOnboardedData = (participant as any)?.onboardedData;

    let initial = { ...INITIAL_FORM_STATE };

    if (alreadyOnboarded) {
      try {
        localStorage.removeItem(draftStorageKey);
      } catch (err) {}

      if (existingOnboardedData) {
        populateFormFromMemberData(existingOnboardedData);
        setErrors({});
        setSubmitError(null);
        setIsSuccess(false);
        setShowOtpStep(false);
        setOtpValue("");
        resetOtp();
      }
    }

    // Try restoring draft from localStorage if not onboarded
    if (!alreadyOnboarded) {
      try {
        const saved = localStorage.getItem(draftStorageKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && typeof parsed === "object") {
            initial = { ...initial, ...parsed };
            setDraftSaved(true);
          }
        }
      } catch (err) {
        console.error("Failed to read onboarding draft:", err);
      }

      // Populate missing fields from participant record
      if (participant) {
        if (!initial.phoneno && participant.phone) {
          initial.phoneno = participant.phone.replace(/\D/g, "").slice(-10);
        }
        if (!initial.github) initial.github = participant.links?.github || "";
        if (!initial.portfolio) {
          initial.portfolio =
            participant.links?.demo || participant.links?.deployment || "";
        }
      }

      setFormData(initial);
    }

    setErrors({});
    setSubmitError(null);
    setIsSuccess(false);
    setShowOtpStep(false);
    setOtpValue("");
    resetOtp();

    // Fetch latest saved member record from backend strictly once per candidate session
    if (
      candidateEmail &&
      candidateEmail !== "candidate" &&
      hasFetchedMemberRef.current !== candidateEmail
    ) {
      hasFetchedMemberRef.current = candidateEmail;

      if (!existingOnboardedData) {
        setIsLoadingMember(true);
      }

      let isMounted = true;
      api
        .getTeamMember(candidateEmail)
        .then((member) => {
          if (!isMounted) return;
          if (member) {
            setIsOnboarded(true);
            populateFormFromMemberData(member);
            try {
              localStorage.removeItem(draftStorageKey);
            } catch (err) {}
            if (updateParticipant) {
              updateParticipant({
                isOnboarded: true,
                status: "onboarding",
                onboardedData: member,
              });
            }
          }
        })
        .catch((err) => {
          console.error("Failed to fetch member details:", err);
        })
        .finally(() => {
          if (isMounted) {
            setIsLoadingMember(false);
          }
        });

      return () => {
        isMounted = false;
      };
    }
  }, [
    isOpen,
    candidateEmail,
    participant?.isOnboarded,
    draftStorageKey,
    resetOtp,
    clearTimers,
    populateFormFromMemberData,
    updateParticipant,
  ]);

  // Timed success countdown & auto-close trigger
  useEffect(() => {
    if (!isSuccess) return;

    setCountdown(3);
    countdownIntervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
            countdownIntervalRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    autoCloseTimerRef.current = setTimeout(() => {
      handleCloseSuccess();
    }, 3000);

    return () => {
      clearTimers();
    };
  }, [isSuccess, handleCloseSuccess, clearTimers]);

  // Auto-save draft on every formData change when at least one field has data
  useEffect(() => {
    if (!isOpen || isOnboarded) return;
    const isAnyFilled = Object.values(formData).some(
      (v) => typeof v === "string" && v.trim().length > 0,
    );

    if (!isAnyFilled) {
      setDraftSaved(false);
      return;
    }

    try {
      localStorage.setItem(draftStorageKey, JSON.stringify(formData));
      setDraftSaved(true);
    } catch (err) {
      console.error("Failed to auto-save onboarding draft:", err);
    }
  }, [formData, isOpen, draftStorageKey]);

  // Prevent background scrolling while modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden", "touch-none");
    } else {
      document.body.classList.remove("overflow-hidden", "touch-none");
    }
    return () => {
      document.body.classList.remove("overflow-hidden", "touch-none");
    };
  }, [isOpen]);

  const candidateSubdomain =
    participant?.subdomain || (participant as any)?.subDomain || "";

  // Section completion calculations
  const hasPicture = isOnboarded
    ? formData.pictureUrl.trim().length > 0
    : Boolean(pictureFile);
  const section1Fields = [
    formData.phoneno,
    formData.section,
    formData.caption,
    hasPicture ? "yes" : "",
  ];
  const filled1 = section1Fields.filter((f) => f.trim().length > 0).length;

  const section2Fields = [
    formData.faname,
    formData.faphonenumber,
    formData.faemailid,
  ];
  const filled2 = section2Fields.filter((f) => f.trim().length > 0).length;

  const section3Fields = [
    formData.github,
    formData.linkedin,
    formData.insta,
    formData.portfolio,
  ];
  const filled3 = section3Fields.filter((f) => f.trim().length > 0).length;

  const hasNda = isOnboarded
    ? formData.ndaUrl.trim().length > 0
    : Boolean(ndaFile);
  const filled4 = hasNda ? 1 : 0;

  const totalFilled = filled1 + filled2 + filled3 + filled4;
  const TOTAL_FIELDS = 12;

  const INDIAN_PHONE_REGEX = /^[6-9]\d{9}$/;
  const SRM_FA_EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@srmist\.edu\.in$/i;
  const GITHUB_URL_REGEX =
    /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_.-]+(\/[a-zA-Z0-9_.-]+)*\/?$/i;
  const LINKEDIN_URL_REGEX =
    /^(https?:\/\/)?(www\.)?linkedin\.com\/(in\/)?[a-zA-Z0-9_.-]+\/?$/i;
  const INSTAGRAM_URL_REGEX =
    /^(https?:\/\/)?(www\.)?instagram\.com\/[a-zA-Z0-9_.-]+\/?$/i;
  const GENERAL_URL_REGEX =
    /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:[0-9]+)?([/?#][^\s]*)?$/i;

  const isPhoneValid = INDIAN_PHONE_REGEX.test(formData.phoneno.trim());
  const phoneError =
    !isOnboarded && formData.phoneno.trim().length > 0 && !isPhoneValid
      ? "Enter a valid 10-digit mobile number."
      : !isOnboarded ? errors.phoneno || null : null;

  const isPictureValid = isOnboarded
    ? formData.pictureUrl.trim().length > 0 && GENERAL_URL_REGEX.test(formData.pictureUrl.trim())
    : pictureFile !== null && !validateUploadedFile(pictureFile);
  const pictureError = !isOnboarded ? errors.picture || null : null;

  const isFaPhoneValid = INDIAN_PHONE_REGEX.test(formData.faphonenumber.trim());
  const faPhoneError =
    !isOnboarded && formData.faphonenumber.trim().length > 0 && !isFaPhoneValid
      ? "Enter a valid 10-digit mobile number."
      : !isOnboarded ? errors.faphonenumber || null : null;

  const isFaEmailValid =
    formData.faemailid.trim().length > 0 &&
    SRM_FA_EMAIL_REGEX.test(formData.faemailid.trim());
  const faEmailError =
    !isOnboarded && formData.faemailid.trim().length > 0 && !isFaEmailValid
      ? "FA email must be an official @srmist.edu.in address."
      : !isOnboarded ? errors.faemailid || null : null;

  const isGithubValid = GITHUB_URL_REGEX.test(formData.github.trim());
  const githubError =
    !isOnboarded && formData.github.trim().length > 0 && !isGithubValid
      ? "Invalid GitHub URL"
      : !isOnboarded ? errors.github || null : null;

  const isLinkedinValid = LINKEDIN_URL_REGEX.test(formData.linkedin.trim());
  const linkedinError =
    !isOnboarded && formData.linkedin.trim().length > 0 && !isLinkedinValid
      ? "Invalid LinkedIn URL"
      : !isOnboarded ? errors.linkedin || null : null;

  const isInstaValid = INSTAGRAM_URL_REGEX.test(formData.insta.trim());
  const instaError =
    !isOnboarded && formData.insta.trim().length > 0 && !isInstaValid
      ? "Invalid Instagram URL"
      : !isOnboarded ? errors.insta || null : null;

  const isPortfolioValid =
    formData.portfolio.trim().length === 0 ||
    GENERAL_URL_REGEX.test(formData.portfolio.trim());
  const portfolioError =
    !isOnboarded &&
    formData.portfolio.trim().length > 0 &&
    !GENERAL_URL_REGEX.test(formData.portfolio.trim())
      ? "Invalid URL"
      : !isOnboarded
      ? errors.portfolio || null
      : null;

  const isNdaValid = isOnboarded
    ? formData.ndaUrl.trim().length > 0 && GENERAL_URL_REGEX.test(formData.ndaUrl.trim())
    : ndaFile !== null && !validateUploadedFile(ndaFile);
  const ndaError = !isOnboarded ? errors.nda || null : null;

  const isRequiredSection3Filled =
    formData.github.trim().length > 0 &&
    formData.linkedin.trim().length > 0 &&
    formData.insta.trim().length > 0;

  const isSection1Complete =
    filled1 === 4 && isPhoneValid && isPictureValid;
  const isSection2Complete =
    filled2 === 3 && isFaPhoneValid && isFaEmailValid;
  const isSection3Complete =
    isRequiredSection3Filled &&
    isGithubValid &&
    isLinkedinValid &&
    isInstaValid &&
    isPortfolioValid;
  const isSection4Complete =
    filled4 === 1 && isNdaValid;

  const hasSection1Error = Boolean(
    phoneError || pictureError || errors.section || errors.caption,
  );
  const hasSection2Error = Boolean(
    faPhoneError || faEmailError || errors.faname,
  );
  const hasSection3Error = Boolean(
    githubError || linkedinError || instaError || portfolioError,
  );
  const hasSection4Error = Boolean(ndaError);

  const incompleteSections = useMemo(() => {
    const list: string[] = [];
    if (!isSection1Complete) list.push("Academic & Profile");
    if (!isSection2Complete) list.push("Faculty Advisor");
    if (!isSection3Complete) list.push("Social Handles");
    if (!isSection4Complete) list.push("NDA Submission");
    return list;
  }, [
    isSection1Complete,
    isSection2Complete,
    isSection3Complete,
    isSection4Complete,
  ]);

  const isFormComplete = incompleteSections.length === 0;

  const getSectionBadge = (
    hasError: boolean,
    filled: number,
    isComplete: boolean,
  ) => {
    if (isOnboarded) {
      return {
        label: "Locked",
        pillClass: "bg-[#22C55E] text-white",
      };
    }
    if (hasError) {
      return {
        label: "Error",
        pillClass: "bg-[#FF4D4D] text-white",
      };
    }
    if (filled === 0) {
      return {
        label: "Incomplete",
        pillClass: "bg-[#FF4D4D] text-white",
      };
    }
    if (isComplete) {
      return {
        label: "Ready",
        pillClass: "bg-[#22C55E] text-white",
      };
    }
    return {
      label: "In Progress",
      pillClass: "bg-[#FFDE59] text-[#1E1B24]",
    };
  };

  const status1 = getSectionBadge(hasSection1Error, filled1, isSection1Complete);
  const status2 = getSectionBadge(hasSection2Error, filled2, isSection2Complete);
  const status3 = getSectionBadge(hasSection3Error, filled3, isSection3Complete);
  const status4 = getSectionBadge(hasSection4Error, filled4, isSection4Complete);

  const getInputClass = (hasErr: boolean | null | string | undefined) =>
    `px-3 py-2 rounded-xl border-2 font-rubik text-sm transition-all ${
      isOnboarded
        ? "bg-[#F3F4F6] text-[#4B5563] border-[#AAAAAA] shadow-none cursor-default focus:outline-none"
        : hasErr
        ? "border-[#FF4D4D] bg-[#FEF2F2] shadow-[2px_2px_0px_#1E1B24] focus:outline-none focus:ring-2 focus:ring-[#FF4D4D]"
        : "border-[#1E1B24] shadow-[2px_2px_0px_#1E1B24] focus:outline-none focus:ring-2 focus:ring-[#FF4D4D]"
    }`;

  if (!isOpen) return null;

  const toggleSection = (index: number) => {
    setOpenSection((prev) => (prev === index ? null : index));
  };

  const handleChange = (field: keyof FormState, value: string) => {
    if (isOnboarded) return;
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const error = validateUploadedFile(file);
    if (error) {
      setErrors((prev) => ({ ...prev, picture: error }));
      return;
    }

    setPictureFile(file);
    setErrors((prev) => {
      const next = { ...prev };
      delete next.picture;
      return next;
    });
  };

  const handleRemovePicture = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPictureFile(null);
    if (pictureInputRef.current) {
      pictureInputRef.current.value = "";
    }
    setErrors((prev) => ({ ...prev, picture: "Profile picture is required." }));
  };

  const handleNdaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const error = validateUploadedFile(file);
    if (error) {
      setErrors((prev) => ({ ...prev, nda: error }));
      return;
    }

    setNdaFile(file);
    setErrors((prev) => {
      const next = { ...prev };
      delete next.nda;
      return next;
    });
  };

  const handleRemoveNda = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNdaFile(null);
    if (ndaInputRef.current) {
      ndaInputRef.current.value = "";
    }
    setErrors((prev) => ({ ...prev, nda: "Signed NDA document is required." }));
  };

  const handleExecuteClearDraft = () => {
    try {
      localStorage.removeItem(draftStorageKey);
    } catch (err) {
      console.error("Failed to remove onboarding draft:", err);
    }

    setFormData(INITIAL_FORM_STATE);
    setPictureFile(null);
    setNdaFile(null);
    if (pictureInputRef.current) {
      pictureInputRef.current.value = "";
    }
    if (ndaInputRef.current) {
      ndaInputRef.current.value = "";
    }
    setErrors({});
    setSubmitError(null);
    setDraftSaved(false);
    setShowClearConfirm(false);
    setShowOtpStep(false);
    setOtpValue("");
    resetOtp();
  };

  function normalizeUrl(url?: string): string {
    const trimmed = (url || "").trim();
    if (!trimmed) return "";
    if (/^https?:\/\//i.test(trimmed)) {
      return trimmed;
    }
    return `https://${trimmed}`;
  }

  const validateFormats = () => {
    const errs: Record<string, string> = {};

    // Section 1
    const trimmedPhone = formData.phoneno.trim();
    if (!trimmedPhone) {
      errs.phoneno = "Phone number is required.";
    } else if (!INDIAN_PHONE_REGEX.test(trimmedPhone)) {
      errs.phoneno = "Enter a valid 10-digit mobile number.";
    }

    if (!formData.section.trim()) {
      errs.section = "College section is required.";
    }

    if (!pictureFile) {
      errs.picture = "Profile picture is required.";
    } else {
      const picErr = validateUploadedFile(pictureFile);
      if (picErr) errs.picture = picErr;
    }

    if (!formData.caption.trim()) {
      errs.caption = "Caption / Bio is required.";
    }

    // Section 2
    if (!formData.faname.trim()) {
      errs.faname = "FA name is required.";
    }

    const trimmedFaPhone = formData.faphonenumber.trim();
    if (!trimmedFaPhone) {
      errs.faphonenumber = "FA phone number is required.";
    } else if (!INDIAN_PHONE_REGEX.test(trimmedFaPhone)) {
      errs.faphonenumber = "Enter a valid 10-digit mobile number.";
    }

    const trimmedFaEmail = formData.faemailid.trim();
    if (!trimmedFaEmail) {
      errs.faemailid = "FA email ID is required.";
    } else if (!SRM_FA_EMAIL_REGEX.test(trimmedFaEmail)) {
      errs.faemailid = "FA email must be an official @srmist.edu.in address.";
    }

    // Section 3
    const trimmedGithub = formData.github.trim();
    if (!trimmedGithub) {
      errs.github = "GitHub URL is required.";
    } else if (!GITHUB_URL_REGEX.test(trimmedGithub)) {
      errs.github = "Invalid GitHub URL";
    }

    const trimmedLinkedin = formData.linkedin.trim();
    if (!trimmedLinkedin) {
      errs.linkedin = "LinkedIn URL is required.";
    } else if (!LINKEDIN_URL_REGEX.test(trimmedLinkedin)) {
      errs.linkedin = "Invalid LinkedIn URL";
    }

    const trimmedInsta = formData.insta.trim();
    if (!trimmedInsta) {
      errs.insta = "Instagram URL is required.";
    } else if (!INSTAGRAM_URL_REGEX.test(trimmedInsta)) {
      errs.insta = "Invalid Instagram URL";
    }

    const trimmedPortfolio = formData.portfolio.trim();
    if (trimmedPortfolio && !GENERAL_URL_REGEX.test(trimmedPortfolio)) {
      errs.portfolio = "Invalid URL";
    }

    // Section 4
    if (!ndaFile) {
      errs.nda = "Signed NDA document is required.";
    } else {
      const ndaErr = validateUploadedFile(ndaFile);
      if (ndaErr) errs.nda = ndaErr;
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const executeOnboardSubmission = async (overrideToken?: string) => {
    setIsSubmitting(true);
    setSubmitError(null);

    const tokenToUse =
      overrideToken ||
      otpToken ||
      getOtpSession()?.token ||
      (typeof window !== "undefined"
        ? localStorage.getItem("gcsrm_token") ||
          localStorage.getItem("token") ||
          localStorage.getItem("authToken")
        : null);

    if (!tokenToUse) {
      setShowOtpStep(true);
      setIsSubmitting(false);
      return;
    }

    if (!otpToken && tokenToUse) {
      setOtpToken(tokenToUse);
    }

    if (!pictureFile || !ndaFile) {
      setSubmitError("Please ensure both profile picture and signed NDA are uploaded.");
      setIsSubmitting(false);
      return;
    }

    const payload: OnboardMemberPayload = {
      name: participant?.name || "",
      email: participant?.email || "",
      phoneno: formData.phoneno.trim(),
      section: formData.section.trim(),
      domain: participant?.domain || "",
      subdomain: candidateSubdomain || undefined,
      position: "member",
      joined_yr: 2026,
      isCurrentMember: true,
      caption: formData.caption.trim() || undefined,
      picture: pictureFile,
      nda: ndaFile,
      faDetails: [
        {
          faname: formData.faname.trim(),
          faphonenumber: formData.faphonenumber.trim(),
          faemailid: formData.faemailid.trim(),
        },
      ],
      socials: [
        {
          insta: normalizeUrl(formData.insta) || undefined,
          github: normalizeUrl(formData.github) || undefined,
          linkedin: normalizeUrl(formData.linkedin) || undefined,
          portfolio: normalizeUrl(formData.portfolio) || undefined,
        },
      ],
    };

    try {
      const res = await api.onboardMember(tokenToUse, payload);
      const savedData = (res as any)?.data || payload;
      populateFormFromMemberData(savedData);

      // Clear draft on successful submission
      try {
        localStorage.removeItem(draftStorageKey);
      } catch (e) {
        // ignore
      }

      if (updateParticipant) {
        updateParticipant({
          isOnboarded: true,
          status: "onboarding",
          phone: formData.phoneno.trim(),
          subdomain: candidateSubdomain || participant?.subdomain,
          onboardedData: savedData,
          links: {
            ...participant?.links,
            github: normalizeUrl(formData.github) || participant?.links?.github,
            demo: normalizeUrl(formData.portfolio) || participant?.links?.demo,
          },
        });
      }

      if (onSave) {
        onSave(payload);
      }

      if (onSuccess) {
        onSuccess();
      }

      setPopup({
        isOpen: true,
        type: "success",
        title: "Onboarding Successful!",
        message: "Onboarding details submitted successfully! Welcome to the team.",
        autoCloseMs: 3000,
      });

      setIsSuccess(true);
      setShowOtpStep(false);
    } catch (err: unknown) {
      console.error("Onboarding submission error:", err);
      if (err instanceof ApiError) {
        const errText = (err.error || err.message || "").toLowerCase();
        const is409 =
          err.status === 409 ||
          errText.includes("already been onboarded") ||
          errText.includes("already onboarded");

        if (is409) {
          const memberData = (err.body as any)?.data;
          if (memberData) {
            populateFormFromMemberData(memberData);
          }
          setIsOnboarded(true);
          setShowOtpStep(false);
          setSubmitError(null);
          try {
            localStorage.removeItem(draftStorageKey);
          } catch (e) {}

          if (updateParticipant) {
            updateParticipant({
              isOnboarded: true,
              status: "onboarding",
            });
          }

          if (onSuccess) {
            onSuccess();
          }

          setPopup({
            isOpen: true,
            type: "info",
            title: "Already Onboarded",
            message:
              "Your onboarding details are already submitted and locked in the team database.",
            autoCloseMs: 3000,
          });
          return;
        }

        if (err.status === 401 || err.status === 403) {
          setOtpToken(null);
          setShowOtpStep(true);
        }
        setSubmitError(
          err.error || err.message || "Failed to submit onboarding profile.",
        );
      } else if (err instanceof Error) {
        setSubmitError(err.message);
      } else {
        setSubmitError("Failed to submit onboarding profile. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormComplete) {
      setSubmitError(
        `Please complete all sections first (${incompleteSections.join(", ")}).`,
      );
      return;
    }

    if (!validateFormats()) {
      setSubmitError("Please correct highlighted fields before submitting.");
      return;
    }

    // Retrieve authentication token
    const session = getOtpSession();
    const token =
      otpToken ||
      session?.token ||
      (typeof window !== "undefined"
        ? localStorage.getItem("gcsrm_token") ||
          localStorage.getItem("token") ||
          localStorage.getItem("authToken")
        : null);

    if (!token) {
      // Transition to OTP verification step
      setShowOtpStep(true);
      return;
    }

    if (!otpToken && token) {
      setOtpToken(token);
    }

    await executeOnboardSubmission(token);
  };

  // OTP handlers
  const handleSendOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const targetEmail = participant?.email || "";
    if (!targetEmail) return;
    await sendOtp(targetEmail);
  };

  const handleVerifyOtp = async (otpToVerify?: string) => {
    // 1. If otpToken is already in state, reuse directly and submit
    if (otpToken) {
      await executeOnboardSubmission(otpToken);
      return;
    }

    // 2. If valid session already exists in storage, reuse
    const existingSession = getOtpSession();
    if (existingSession && existingSession.token) {
      setOtpToken(existingSession.token);
      await executeOnboardSubmission(existingSession.token);
      return;
    }

    // 3. Prevent duplicate / concurrent verify calls (auto-verify + button click)
    if (isVerifyingRef.current || otpPhase === "verifying" || isSubmitting) {
      return;
    }

    const code =
      otpToVerify !== undefined && otpToVerify !== ""
        ? otpToVerify
        : otpValue;
    if (!code || code.length !== 6) return;

    isVerifyingRef.current = true;
    try {
      const ok = await verifyOtp(code);
      if (ok) {
        const session = getOtpSession();
        if (session && session.token) {
          setOtpToken(session.token);
          await executeOnboardSubmission(session.token);
        }
      }
    } finally {
      isVerifyingRef.current = false;
    }
  };

  const handleOtpInputChange = (val: string) => {
    setOtpValue(val);
    if (
      val.length === 6 &&
      !isVerifyingRef.current &&
      !otpToken &&
      otpPhase !== "verifying" &&
      !isSubmitting
    ) {
      handleVerifyOtp(val);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-[95vw] sm:w-[90vw] md:w-[620px] max-h-[92vh] bg-white border-[3px] border-[#1E1B24] rounded-[22px] shadow-[8px_8px_0px_#1E1B24] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="bg-[#FF4D4D] border-b-[3px] border-[#1E1B24] p-4 sm:p-5 flex items-center justify-between rounded-t-[19px]">
          <div className="flex items-center gap-2.5">
            <UserCheck className="text-white shrink-0" size={24} />
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <h2 className="font-outfit-black text-lg sm:text-xl text-white uppercase tracking-wide">
                Team Member Onboarding
              </h2>
              <span className="inline-block self-start font-outfit-black text-[10px] uppercase bg-black text-white px-2 py-0.5 rounded border border-white/20">
                2026 Cohort
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1 border-2 border-[#1E1B24] rounded-lg bg-white hover:bg-[#f0f0f0] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer"
          >
            <X size={20} className="text-[#1E1B24]" />
          </button>
        </div>

        {/* Modal Content / Scroll Container */}
        <div className="p-4 sm:p-6 overflow-y-auto overscroll-contain flex flex-col gap-4 text-left">
          {isSuccess ? (
            /* Timed Success View */
            <div className="relative overflow-hidden flex flex-col items-center justify-center p-6 sm:p-8 bg-[#ECFDF5] border-[3px] border-[#1E1B24] rounded-2xl shadow-[6px_6px_0px_#1E1B24] gap-4 text-center animate-in zoom-in-95 duration-200">
              {/* Badge */}
              <span className="font-outfit-black text-[12px] uppercase tracking-[1.5px] text-[#1E1B24] px-3 py-1 rounded-full border-2 border-[#1E1B24] shadow-[2px_2px_0px_#1E1B24] bg-[#4EC37B]">
                SUCCESS
              </span>

              {/* Green Checkmark Circle */}
              <div className="w-16 h-16 rounded-full bg-[#22C55E] border-[3px] border-[#1E1B24] shadow-[4px_4px_0px_#1E1B24] flex items-center justify-center text-white">
                <CheckCircle2 size={38} />
              </div>

              {/* Headings */}
              <div className="flex flex-col gap-1">
                <h3 className="font-outfit-black text-2xl text-[#1E1B24] uppercase tracking-wide">
                  Welcome to the team!
                </h3>
                <p className="font-rubik text-sm sm:text-base font-medium text-[#1E1B24] max-w-md leading-relaxed">
                  Onboarding details submitted successfully! Welcome to the team.
                </p>
              </div>

              {/* Summary Badges */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                <span className="bg-[#FFD93D] border-2 border-[#1E1B24] px-3 py-1 rounded-lg font-outfit-black text-xs uppercase text-[#1E1B24] shadow-[2px_2px_0px_#1E1B24]">
                  Position: Member
                </span>
                <span className="bg-[#38BDF8] border-2 border-[#1E1B24] px-3 py-1 rounded-lg font-outfit-black text-xs uppercase text-[#1E1B24] shadow-[2px_2px_0px_#1E1B24]">
                  Joined: 2026
                </span>
                {participant?.domain && (
                  <span className="bg-white border-2 border-[#1E1B24] px-3 py-1 rounded-lg font-outfit-black text-xs uppercase text-[#1E1B24] shadow-[2px_2px_0px_#1E1B24]">
                    Domain: {participant.domain}
                  </span>
                )}
                {candidateSubdomain && (
                  <span className="bg-[#E0E7FF] border-2 border-[#1E1B24] px-3 py-1 rounded-lg font-outfit-black text-xs uppercase text-[#1E1B24] shadow-[2px_2px_0px_#1E1B24]">
                    Subdomain: {candidateSubdomain}
                  </span>
                )}
              </div>

              {/* Countdown Caption */}
              <p className="font-rubik text-xs sm:text-sm font-semibold text-[#5C5866]">
                Closing automatically in{" "}
                <span className="font-outfit-black text-[#1E1B24]">{countdown}s</span>...
              </p>

              {/* Fallback Close Button */}
              <button
                type="button"
                onClick={handleCloseSuccess}
                className="mt-1 border-2 border-[#1E1B24] rounded-xl shadow-[3px_3px_0px_#1E1B24] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#1E1B24] font-outfit-black text-sm uppercase px-8 py-2.5 bg-[#1E1B24] hover:bg-[#33303c] text-white transition-all cursor-pointer"
              >
                Close Now
              </button>

              {/* Diminishing Progress Bar */}
              <div className="absolute bottom-0 left-0 w-full h-2 bg-neutral-200 border-t-2 border-[#1E1B24]">
                <style>{`
                  @keyframes modal-shrink {
                    from { width: 100%; }
                    to { width: 0%; }
                  }
                `}</style>
                <div
                  className="h-full bg-[#00E599]"
                  style={{
                    animation: "modal-shrink 3000ms linear forwards",
                  }}
                />
              </div>
            </div>
          ) : showOtpStep ? (
            /* OTP Verification Step */
            <div className="flex flex-col gap-5 p-2 sm:p-4">
              <div className="flex items-center gap-3">
                <span className="font-outfit-black text-[12px] uppercase tracking-[1.5px] text-[#1E1B24] px-3 py-1 rounded-full border-2 border-[#1E1B24] shadow-[2px_2px_0px_#1E1B24] bg-[#FFD93D] shrink-0">
                  VERIFY
                </span>
                <h3 className="font-outfit-black text-[20px] text-[#1E1B24] tracking-tight">
                  Verify Email to Submit
                </h3>
              </div>

              <p className="font-rubik text-[14px] font-medium text-[#5C5866] leading-relaxed">
                Verify your SRM email to authenticate and submit your onboarding record.
              </p>

              {/* Error Alert Banner */}
              {(submitError || otpError) && (
                <div className="bg-[#FEE2E2] border-2 border-[#D92323] text-[#D92323] p-3.5 rounded-xl shadow-[3px_3px_0px_#1E1B24] font-rubik text-xs sm:text-sm font-semibold flex items-center gap-2.5">
                  <AlertCircle size={20} className="shrink-0 text-[#D92323]" />
                  <span>{otpError || submitError}</span>
                </div>
              )}

              {!(otpPhase === "sent" || otpPhase === "verifying" || otpPhase === "verified") ? (
                /* ── Send OTP Form ── */
                <form onSubmit={handleSendOtp} noValidate className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="verify-email" className="font-outfit-black text-[14px] text-[#1E1B24]">
                      SRM Email
                    </label>
                    <input
                      type="email"
                      id="verify-email"
                      value={participant?.email || ""}
                      disabled
                      className="w-full bg-[#E8E8E8] border-[3px] border-[#AAAAAA] rounded-[16px] p-4 font-rubik text-[16px] text-[#777777] shadow-none cursor-not-allowed"
                    />
                  </div>

                  <SendOtpButton loading={otpPhase === "sending"}>
                    {otpPhase === "sending" ? "Sending OTP..." : "Send OTP"}
                  </SendOtpButton>

                  <div className="w-full flex items-center justify-center px-4 text-center mt-3 mb-2">
                    <button
                      type="button"
                      onClick={() => jumpToVerify(participant?.email || "")}
                      disabled={!participant?.email}
                      className="w-full py-2.5 px-4 my-2 bg-white hover:bg-neutral-100 text-black font-bold text-xs sm:text-sm uppercase tracking-wide border-2 border-black rounded-lg shadow-[2px_2px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-[2px_2px_0px_#000] disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:bg-white cursor-pointer"
                    >
                      Already have an OTP? Verify →
                    </button>
                  </div>

                  <div className="flex justify-center mt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowOtpStep(false);
                        setSubmitError(null);
                      }}
                      className="text-sm font-bold text-[#1E1B24] hover:underline transition-all cursor-pointer bg-transparent border-none"
                    >
                      ← Back to Onboarding Form
                    </button>
                  </div>
                </form>
              ) : (
                /* ── Verify OTP Form ── */
                <div className="flex flex-col gap-4">
                  <p className="font-rubik text-center text-[13px] font-medium text-[#5C5866]">
                    We sent a 6-digit code to{" "}
                    <span className="font-bold text-[#1E1B24]">{participant?.email}</span>
                  </p>

                  <div className="my-2">
                    <OtpInput
                      value={otpValue}
                      onChange={handleOtpInputChange}
                      disabled={otpPhase === "verifying" || isSubmitting || !!otpToken || isVerifyingRef.current}
                      hasError={!!otpError}
                      onComplete={(code) => {
                        if (
                          !isVerifyingRef.current &&
                          !otpToken &&
                          otpPhase !== "verifying" &&
                          !isSubmitting
                        ) {
                          handleVerifyOtp(code);
                        }
                      }}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleVerifyOtp()}
                    disabled={
                      otpPhase === "verifying" ||
                      isSubmitting ||
                      !!otpToken ||
                      isVerifyingRef.current ||
                      otpValue.length !== 6
                    }
                    className="w-full rounded-2xl py-4 text-white text-xl uppercase tracking-wide disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
                    style={{
                      backgroundColor: "#22C55E",
                      border: "3px solid #1e1b24",
                      boxShadow: "4px 4px 0px #1e1b24",
                      fontWeight: 800,
                      fontFamily: "'Outfit', sans-serif",
                    }}
                  >
                    {otpPhase === "verifying" || isSubmitting || !!otpToken || isVerifyingRef.current ? (
                      <>
                        <Loader2 size={22} className="animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <span>Verify &amp; Submit</span>
                    )}
                  </button>

                  <ResendOtpLink
                    cooldown={resendCooldown}
                    onResend={() => {
                      if (participant?.email) sendOtp(participant.email);
                    }}
                    disabled={otpPhase === "verifying" || isSubmitting || !!otpToken || isVerifyingRef.current}
                  />

                  <div className="flex justify-center mt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowOtpStep(false);
                        setSubmitError(null);
                        resetOtp();
                      }}
                      className="text-sm font-bold text-[#1E1B24] hover:underline transition-all cursor-pointer bg-transparent border-none"
                    >
                      ← Back to Onboarding Form
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

              {/* Already Onboarded Top Green Banner */}
              {isOnboarded && (
                <div className="bg-[#ECFDF5] border-[3px] border-[#1E1B24] rounded-2xl p-4 sm:p-5 shadow-[4px_4px_0px_#1E1B24] flex items-center gap-3.5 animate-in fade-in duration-200">
                  <div className="w-10 h-10 rounded-full bg-[#22C55E] border-2 border-[#1E1B24] shadow-[2px_2px_0px_#1E1B24] flex items-center justify-center text-white shrink-0">
                    <CheckCircle2 size={24} />
                  </div>
                  <div className="flex flex-col gap-1 text-left">
                    <div className="flex items-center gap-2">
                      <span className="bg-[#22C55E] text-white border-2 border-[#1E1B24] font-outfit-black text-[11px] uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-[1.5px_1.5px_0px_#1E1B24]">
                        ALREADY ONBOARDED
                      </span>
                      <span className="font-outfit-black text-xs uppercase text-[#1E1B24]">
                        Record Locked
                      </span>
                    </div>
                    <p className="font-rubik text-xs sm:text-sm font-medium text-[#1E1B24] leading-relaxed">
                      Your onboarding details have been submitted and locked into the team database.
                    </p>
                  </div>
                </div>
              )}

              {/* Error Alert Banner */}
              {submitError && (
                <div className="bg-[#FEE2E2] border-2 border-[#D92323] text-[#D92323] p-3.5 rounded-xl shadow-[3px_3px_0px_#1E1B24] font-rubik text-xs sm:text-sm font-semibold flex items-center gap-2.5">
                  <AlertCircle size={20} className="shrink-0 text-[#D92323]" />
                  <span>{submitError}</span>
                </div>
              )}

              {/* Locked Candidate Record Banner / Full Summary */}
              <div className="bg-[#FFFEEF] border-2 border-[#1E1B24] rounded-xl p-3.5 sm:p-5 shadow-[3px_3px_0px_#1E1B24] flex flex-col gap-3.5 text-left">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1E1B24]/15 pb-2.5">
                  <div className="flex items-center gap-1.5">
                    <Lock size={15} className="text-[#1E1B24]" />
                    <span className="font-outfit-black text-xs uppercase tracking-wider text-[#1E1B24]">
                      Candidate Profile (Locked)
                    </span>
                  </div>

                  {/* Badges */}
                  <div className="flex items-center gap-1.5">
                    <span className="bg-[#FFD93D] border border-[#1E1B24] text-[#1E1B24] font-outfit-black text-[10px] uppercase px-2 py-0.5 rounded shadow-[1px_1px_0px_#1E1B24]">
                      member
                    </span>
                    <span className="bg-[#38BDF8] border border-[#1E1B24] text-[#1E1B24] font-outfit-black text-[10px] uppercase px-2 py-0.5 rounded shadow-[1px_1px_0px_#1E1B24]">
                      2026
                    </span>
                    <span className="bg-[#22C55E] border border-[#1E1B24] text-white font-outfit-black text-[10px] uppercase px-2 py-0.5 rounded shadow-[1px_1px_0px_#1E1B24]">
                      active
                    </span>
                  </div>
                </div>

                {/* Identity Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-rubik text-xs text-[#5C5866]">
                  <div>
                    <strong className="text-[#1E1B24]">Name:</strong>{" "}
                    <span className="font-semibold text-[#1E1B24]">{participant?.name || "Participant"}</span>
                  </div>
                  <div>
                    <strong className="text-[#1E1B24]">Reg No:</strong>{" "}
                    <span className="font-semibold text-[#1E1B24]">{participant?.registrationNumber || "N/A"}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <strong className="text-[#1E1B24]">SRM Email:</strong>{" "}
                    <span className="font-semibold text-[#1E1B24]">{participant?.email || "N/A"}</span>
                  </div>
                  <div className="sm:col-span-2 flex flex-wrap items-center gap-3">
                    {participant?.domain && (
                      <div className="flex items-center gap-1.5">
                        <strong className="text-[#1E1B24]">Domain:</strong>
                        <span className="inline-block uppercase font-outfit-black text-[#1E1B24] bg-[#FFD93D] px-2 py-0.5 rounded border border-[#1E1B24] text-[10px]">
                          {participant.domain}
                        </span>
                      </div>
                    )}
                    {candidateSubdomain && (
                      <div className="flex items-center gap-1.5">
                        <strong className="text-[#1E1B24]">Subdomain:</strong>
                        <span className="inline-block uppercase font-outfit-black text-[#1E1B24] bg-[#E0E7FF] px-2 py-0.5 rounded border border-[#1E1B24] text-[10px]">
                          {candidateSubdomain}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Extended Details for Onboarded Members */}
                {isOnboarded &&
                  (isLoadingMember ? (
                    /* Clean Neo-Brutalist Loading Skeleton */
                    <div className="border-t border-[#1E1B24]/15 pt-3.5 flex flex-col gap-4 animate-pulse">
                      {/* Academic Details Skeleton */}
                      <div className="flex flex-col gap-2.5">
                        <div className="h-3.5 w-40 bg-[#1E1B24]/10 rounded border border-[#1E1B24]/15" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <div className="h-4 w-32 bg-[#1E1B24]/10 rounded border border-[#1E1B24]/15" />
                          <div className="h-4 w-28 bg-[#1E1B24]/10 rounded border border-[#1E1B24]/15" />
                        </div>
                        <div className="h-14 w-full bg-white/60 border-2 border-[#1E1B24]/15 rounded-xl p-2 flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#1E1B24]/10 rounded-lg shrink-0" />
                          <div className="flex flex-col gap-1.5 flex-1">
                            <div className="h-3 w-28 bg-[#1E1B24]/10 rounded" />
                            <div className="h-3 w-20 bg-[#1E1B24]/10 rounded" />
                          </div>
                        </div>
                      </div>

                      {/* Faculty Advisor Skeleton */}
                      <div className="border-t border-[#1E1B24]/15 pt-3 flex flex-col gap-2.5">
                        <div className="h-3.5 w-32 bg-[#1E1B24]/10 rounded border border-[#1E1B24]/15" />
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <div className="h-4 w-28 bg-[#1E1B24]/10 rounded border border-[#1E1B24]/15" />
                          <div className="h-4 w-28 bg-[#1E1B24]/10 rounded border border-[#1E1B24]/15" />
                          <div className="h-4 w-32 bg-[#1E1B24]/10 rounded border border-[#1E1B24]/15" />
                        </div>
                      </div>

                      {/* Socials Skeleton */}
                      <div className="border-t border-[#1E1B24]/15 pt-3 flex flex-col gap-2.5">
                        <div className="h-3.5 w-36 bg-[#1E1B24]/10 rounded border border-[#1E1B24]/15" />
                        <div className="flex flex-wrap gap-2">
                          <div className="h-8 w-24 bg-white/60 border-2 border-[#1E1B24]/15 rounded-xl" />
                          <div className="h-8 w-24 bg-white/60 border-2 border-[#1E1B24]/15 rounded-xl" />
                          <div className="h-8 w-24 bg-white/60 border-2 border-[#1E1B24]/15 rounded-xl" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Populated Member Data with Smooth Fade-in */
                    <div className="animate-in fade-in duration-200 flex flex-col gap-3.5">
                      {/* Academic & Bio */}
                      <div className="border-t border-[#1E1B24]/15 pt-3 flex flex-col gap-2.5">
                        <div className="flex items-center gap-1.5">
                          <Sparkles size={14} className="text-[#1E1B24]" />
                          <span className="font-outfit-black text-xs uppercase tracking-wider text-[#1E1B24]">
                            Academic &amp; Profile Details
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-rubik text-xs text-[#5C5866]">
                          <div>
                            <strong className="text-[#1E1B24]">Phone:</strong>{" "}
                            <span className="font-semibold text-[#1E1B24]">
                              {formData.phoneno || participant?.phone || "N/A"}
                            </span>
                          </div>
                          <div>
                            <strong className="text-[#1E1B24]">Section:</strong>{" "}
                            <span className="font-semibold text-[#1E1B24]">
                              {formData.section || "N/A"}
                            </span>
                          </div>
                        </div>

                        {/* Profile Picture Thumbnail & Link */}
                        {formData.pictureUrl ? (
                          <div className="flex items-center gap-3 bg-white border-2 border-[#1E1B24] rounded-xl p-2.5 shadow-[2px_2px_0px_#1E1B24]">
                            <img
                              src={formData.pictureUrl}
                              alt="Profile"
                              className="w-12 h-12 rounded-lg border-2 border-[#1E1B24] object-cover shrink-0"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = "none";
                              }}
                            />
                            <div className="flex flex-col min-w-0">
                              <span className="font-outfit-black text-[11px] uppercase text-[#1E1B24]">
                                Profile Picture
                              </span>
                              <a
                                href={normalizeUrl(formData.pictureUrl)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 font-rubik font-bold text-xs text-[#2563EB] hover:underline truncate"
                              >
                                <span>View Full Image</span>
                                <ExternalLink size={12} className="shrink-0" />
                              </a>
                            </div>
                          </div>
                        ) : (
                          <div className="font-rubik text-xs text-[#5C5866]">
                            <strong className="text-[#1E1B24]">Profile Picture:</strong> Not provided
                          </div>
                        )}

                        {/* Caption / Bio */}
                        {formData.caption && (
                          <div className="bg-white border-2 border-[#1E1B24] rounded-xl p-3 shadow-[2px_2px_0px_#1E1B24]">
                            <span className="font-outfit-black text-[10px] uppercase text-[#5C5866] tracking-wide">
                              Bio / Caption
                            </span>
                            <p className="font-rubik text-xs italic text-[#1E1B24] mt-1 leading-relaxed">
                              &ldquo;{formData.caption}&rdquo;
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Faculty Advisor Section */}
                      <div className="border-t border-[#1E1B24]/15 pt-3 flex flex-col gap-2">
                        <div className="flex items-center gap-1.5">
                          <GraduationCap size={14} className="text-[#1E1B24]" />
                          <span className="font-outfit-black text-xs uppercase tracking-wider text-[#1E1B24]">
                            Faculty Advisor
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-rubik text-xs text-[#5C5866]">
                          <div>
                            <strong className="text-[#1E1B24]">FA Name:</strong>{" "}
                            <span className="font-semibold text-[#1E1B24] block sm:inline">
                              {formData.faname || "N/A"}
                            </span>
                          </div>
                          <div>
                            <strong className="text-[#1E1B24]">FA Phone:</strong>{" "}
                            <span className="font-semibold text-[#1E1B24] block sm:inline">
                              {formData.faphonenumber || "N/A"}
                            </span>
                          </div>
                          <div>
                            <strong className="text-[#1E1B24]">FA Email:</strong>{" "}
                            <span className="font-semibold text-[#1E1B24] block sm:inline truncate">
                              {formData.faemailid || "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Socials & NDA Documents */}
                      <div className="border-t border-[#1E1B24]/15 pt-3 flex flex-col gap-2.5">
                        <div className="flex items-center gap-1.5">
                          <Share2 size={14} className="text-[#1E1B24]" />
                          <span className="font-outfit-black text-xs uppercase tracking-wider text-[#1E1B24]">
                            Socials &amp; Documents
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          {formData.github ? (
                            <a
                              href={normalizeUrl(formData.github)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 bg-white hover:bg-neutral-100 text-[#1E1B24] border-2 border-[#1E1B24] px-3 py-1.5 rounded-xl font-outfit-black text-xs uppercase shadow-[2px_2px_0px_#1E1B24] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
                            >
                              <span>GitHub</span>
                              <ExternalLink size={12} />
                            </a>
                          ) : null}

                          {formData.linkedin ? (
                            <a
                              href={normalizeUrl(formData.linkedin)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 bg-[#0077B5] hover:bg-[#006097] text-white border-2 border-[#1E1B24] px-3 py-1.5 rounded-xl font-outfit-black text-xs uppercase shadow-[2px_2px_0px_#1E1B24] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
                            >
                              <span>LinkedIn</span>
                              <ExternalLink size={12} />
                            </a>
                          ) : null}

                          {formData.insta ? (
                            <a
                              href={normalizeUrl(formData.insta)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 bg-[#E1306C] hover:bg-[#c9255c] text-white border-2 border-[#1E1B24] px-3 py-1.5 rounded-xl font-outfit-black text-xs uppercase shadow-[2px_2px_0px_#1E1B24] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
                            >
                              <span>Instagram</span>
                              <ExternalLink size={12} />
                            </a>
                          ) : null}

                          {formData.portfolio ? (
                            <a
                              href={normalizeUrl(formData.portfolio)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 bg-[#FFD93D] hover:bg-[#f5cd2f] text-[#1E1B24] border-2 border-[#1E1B24] px-3 py-1.5 rounded-xl font-outfit-black text-xs uppercase shadow-[2px_2px_0px_#1E1B24] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
                            >
                              <Globe size={12} />
                              <span>Portfolio</span>
                              <ExternalLink size={12} />
                            </a>
                          ) : null}

                          {formData.ndaUrl ? (
                            <a
                              href={normalizeUrl(formData.ndaUrl)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 bg-[#38BDF8] hover:bg-[#20a7e3] text-[#1E1B24] border-2 border-[#1E1B24] px-3 py-1.5 rounded-xl font-outfit-black text-xs uppercase shadow-[2px_2px_0px_#1E1B24] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
                            >
                              <FileText size={12} />
                              <span>Signed NDA</span>
                              <ExternalLink size={12} />
                            </a>
                          ) : null}

                          {!formData.github &&
                            !formData.linkedin &&
                            !formData.insta &&
                            !formData.portfolio &&
                            !formData.ndaUrl && (
                              <span className="font-rubik text-xs text-[#5C5866]">
                                No external links provided.
                              </span>
                            )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Form Input Accordions (Only for Candidates who haven't completed onboarding) */}
              {!isOnboarded && (
                <>
                  {/* ACCORDION SECTION 1: Academic & Profile Details */}
                  <div className="border-2 border-[#1E1B24] rounded-2xl shadow-[3px_3px_0px_#1E1B24] overflow-hidden bg-white">
                    <button
                      type="button"
                      onClick={() => toggleSection(1)}
                      className="w-full flex items-center justify-between p-3.5 sm:p-4 text-left font-outfit-black bg-white hover:bg-[#FAF7EE] transition-colors cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Sparkles size={18} className="text-[#1E1B24] shrink-0" />
                        <span className="text-sm uppercase tracking-wide truncate">
                          1. Academic &amp; Profile Details
                        </span>
                        <span className="font-rubik text-xs font-semibold text-[#5C5866] shrink-0">
                          ({filled1}/4)
                        </span>
                      </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <span
                      className={`border-2 border-[#1E1B24] px-2.5 py-0.5 rounded-full text-[11px] font-outfit-black uppercase shadow-[1.5px_1.5px_0px_#1E1B24] ${status1.pillClass}`}
                    >
                      {status1.label}
                    </span>
                    <ChevronDown
                      size={18}
                      className={`text-[#1E1B24] transition-transform duration-200 ${
                        openSection === 1 ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>

                {openSection === 1 && (
                  <div className="p-4 border-t-2 border-[#1E1B24] bg-white animate-in fade-in duration-150 flex flex-col gap-3.5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {/* Phone Number (Required) */}
                      <div className="flex flex-col gap-1">
                        <label className="font-outfit-black text-xs uppercase tracking-wider text-[#1E1B24]">
                          Phone Number <span className="text-[#D92323]">*</span>
                        </label>
                        <div className="flex items-center gap-2">
                          <div className="border-2 border-black rounded-xl bg-[#FFDE59] px-3 py-2 font-bold text-black flex items-center justify-center shadow-[2px_2px_0px_#000] text-sm select-none shrink-0">
                            +91
                          </div>
                          <input
                            type="tel"
                            inputMode="numeric"
                            maxLength={10}
                            required
                            readOnly={isOnboarded}
                            disabled={isOnboarded}
                            value={formData.phoneno}
                            onChange={(e) =>
                              handleChange(
                                "phoneno",
                                e.target.value.replace(/\D/g, "").slice(0, 10),
                              )
                            }
                            className={`w-full ${getInputClass(phoneError)}`}
                          />
                        </div>
                        {phoneError && (
                          <span className="font-rubik text-[11px] text-[#FF4D4D] font-bold">
                            {phoneError}
                          </span>
                        )}
                      </div>

                      {/* Section */}
                      <div className="flex flex-col gap-1">
                        <label className="font-outfit-black text-xs uppercase tracking-wider text-[#1E1B24]">
                          College Section <span className="text-[#D92323]">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          readOnly={isOnboarded}
                          disabled={isOnboarded}
                          value={formData.section}
                          onChange={(e) =>
                            handleChange("section", e.target.value)
                          }
                          className={getInputClass(errors.section)}
                        />
                        {errors.section && (
                          <span className="font-rubik text-[11px] text-[#FF4D4D] font-bold">
                            {errors.section}
                          </span>
                        )}
                      </div>

                      {/* Profile Picture */}
                      <div className="flex flex-col gap-1.5">
                        <label className="font-outfit-black text-xs uppercase tracking-wider text-[#1E1B24]">
                          Profile Picture <span className="text-[#D92323]">*</span>
                        </label>
                        <input
                          ref={pictureInputRef}
                          type="file"
                          name="picture"
                          accept={ACCEPTED_FILE_TYPES}
                          className="hidden"
                          onChange={handlePictureChange}
                          disabled={isOnboarded}
                        />

                        {!pictureFile ? (
                          <div
                            onClick={() => !isOnboarded && pictureInputRef.current?.click()}
                            className={`group flex flex-col items-center justify-center gap-2 p-4 border-2 border-dashed ${
                              pictureError
                                ? "border-[#FF4D4D] bg-[#FFF0F0]"
                                : "border-[#1E1B24] bg-white hover:bg-[#FAF7EE]"
                            } rounded-xl cursor-pointer transition-all shadow-[2px_2px_0px_#1E1B24] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none`}
                          >
                            <div className="w-10 h-10 rounded-full bg-[#FAF7EE] border-2 border-[#1E1B24] flex items-center justify-center text-[#1E1B24] group-hover:scale-105 transition-transform">
                              <UploadCloud size={20} />
                            </div>
                            <div className="text-center">
                              <p className="font-outfit-black text-xs text-[#1E1B24] uppercase tracking-wide">
                                Click to upload photo
                              </p>
                              <p className="font-rubik text-[11px] text-[#5C5866] mt-0.5">
                                JPG, PNG, HEIC up to 5MB
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3 p-3 bg-white border-2 border-[#1E1B24] rounded-xl shadow-[2px_2px_0px_#1E1B24]">
                            {picturePreview ? (
                              <img
                                src={picturePreview}
                                alt="Profile preview"
                                className="w-12 h-12 rounded-lg object-cover border-2 border-[#1E1B24] shrink-0"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-lg bg-[#FAF7EE] border-2 border-[#1E1B24] flex items-center justify-center shrink-0">
                                <ImageIcon size={22} className="text-[#1E1B24]" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="font-outfit-black text-xs text-[#1E1B24] truncate" title={pictureFile.name}>
                                {pictureFile.name}
                              </p>
                              <p className="font-rubik text-[11px] text-[#5C5866]">
                                {(pictureFile.size / (1024 * 1024)).toFixed(2)} MB
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={handleRemovePicture}
                              className="p-1.5 text-[#FF4D4D] hover:bg-[#FFF0F0] border-2 border-transparent hover:border-[#FF4D4D] rounded-lg transition-colors cursor-pointer shrink-0"
                              title="Remove photo"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        )}

                        {pictureError && (
                          <span className="font-rubik text-[11px] text-[#FF4D4D] font-bold">
                            {pictureError}
                          </span>
                        )}
                      </div>

                      {/* Caption / Bio */}
                      <div className="sm:col-span-2 flex flex-col gap-1">
                        <label className="font-outfit-black text-xs uppercase tracking-wider text-[#1E1B24]">
                          Caption / Bio <span className="text-[#D92323]">*</span>
                        </label>
                        <textarea
                          rows={2}
                          required
                          readOnly={isOnboarded}
                          disabled={isOnboarded}
                          value={formData.caption}
                          onChange={(e) =>
                            handleChange("caption", e.target.value)
                          }
                          className={`resize-none ${getInputClass(errors.caption)}`}
                        />
                        {errors.caption && (
                          <span className="font-rubik text-[11px] text-[#FF4D4D] font-bold">
                            {errors.caption}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ACCORDION SECTION 2: Faculty Advisor Details */}
              <div className="border-2 border-[#1E1B24] rounded-2xl shadow-[3px_3px_0px_#1E1B24] overflow-hidden bg-white">
                <button
                  type="button"
                  onClick={() => toggleSection(2)}
                  className="w-full flex items-center justify-between p-3.5 sm:p-4 text-left font-outfit-black bg-white hover:bg-[#FAF7EE] transition-colors cursor-pointer select-none"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <GraduationCap
                      size={18}
                      className="text-[#1E1B24] shrink-0"
                    />
                    <span className="text-sm uppercase tracking-wide truncate">
                      2. Faculty Advisor Details
                    </span>
                    <span className="font-rubik text-xs font-semibold text-[#5C5866] shrink-0">
                      ({filled2}/3)
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <span
                      className={`border-2 border-[#1E1B24] px-2.5 py-0.5 rounded-full text-[11px] font-outfit-black uppercase shadow-[1.5px_1.5px_0px_#1E1B24] ${status2.pillClass}`}
                    >
                      {status2.label}
                    </span>
                    <ChevronDown
                      size={18}
                      className={`text-[#1E1B24] transition-transform duration-200 ${
                        openSection === 2 ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>

                {openSection === 2 && (
                  <div className="p-4 border-t-2 border-[#1E1B24] bg-white animate-in fade-in duration-150 flex flex-col gap-3.5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {/* FA Name */}
                      <div className="flex flex-col gap-1">
                        <label className="font-outfit-black text-xs uppercase tracking-wider text-[#1E1B24]">
                          FA Name <span className="text-[#D92323]">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          readOnly={isOnboarded}
                          disabled={isOnboarded}
                          value={formData.faname}
                          onChange={(e) =>
                            handleChange("faname", e.target.value)
                          }
                          className={getInputClass(errors.faname)}
                        />
                        {errors.faname && (
                          <span className="font-rubik text-[11px] text-[#FF4D4D] font-bold">
                            {errors.faname}
                          </span>
                        )}
                      </div>

                      {/* FA Phone */}
                      <div className="flex flex-col gap-1">
                        <label className="font-outfit-black text-xs uppercase tracking-wider text-[#1E1B24]">
                          FA Phone Number <span className="text-[#D92323]">*</span>
                        </label>
                        <div className="flex items-center gap-2">
                          <div className="border-2 border-black rounded-xl bg-[#FFDE59] px-3 py-2 font-bold text-black flex items-center justify-center shadow-[2px_2px_0px_#000] text-sm select-none shrink-0">
                            +91
                          </div>
                          <input
                            type="tel"
                            inputMode="numeric"
                            maxLength={10}
                            required
                            readOnly={isOnboarded}
                            disabled={isOnboarded}
                            value={formData.faphonenumber}
                            onChange={(e) =>
                              handleChange(
                                "faphonenumber",
                                e.target.value.replace(/\D/g, "").slice(0, 10),
                              )
                            }
                            className={`w-full ${getInputClass(faPhoneError)}`}
                          />
                        </div>
                        {faPhoneError && (
                          <span className="font-rubik text-[11px] text-[#FF4D4D] font-bold">
                            {faPhoneError}
                          </span>
                        )}
                      </div>

                      {/* FA Email */}
                      <div className="sm:col-span-2 flex flex-col gap-1">
                        <label className="font-outfit-black text-xs uppercase tracking-wider text-[#1E1B24]">
                          FA Email ID <span className="text-[#D92323]">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          readOnly={isOnboarded}
                          disabled={isOnboarded}
                          value={formData.faemailid}
                          onChange={(e) =>
                            handleChange("faemailid", e.target.value)
                          }
                          className={getInputClass(faEmailError)}
                        />
                        {faEmailError && (
                          <span className="font-rubik text-[11px] text-[#FF4D4D] font-bold">
                            {faEmailError}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ACCORDION SECTION 3: Social Handles */}
              <div className="border-2 border-[#1E1B24] rounded-2xl shadow-[3px_3px_0px_#1E1B24] overflow-hidden bg-white">
                <button
                  type="button"
                  onClick={() => toggleSection(3)}
                  className="w-full flex items-center justify-between p-3.5 sm:p-4 text-left font-outfit-black bg-white hover:bg-[#FAF7EE] transition-colors cursor-pointer select-none"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Share2 size={18} className="text-[#1E1B24] shrink-0" />
                    <span className="text-sm uppercase tracking-wide truncate">
                      3. Social Handles
                    </span>
                    <span className="font-rubik text-xs font-semibold text-[#5C5866] shrink-0">
                      ({filled3}/4)
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <span
                      className={`border-2 border-[#1E1B24] px-2.5 py-0.5 rounded-full text-[11px] font-outfit-black uppercase shadow-[1.5px_1.5px_0px_#1E1B24] ${status3.pillClass}`}
                    >
                      {status3.label}
                    </span>
                    <ChevronDown
                      size={18}
                      className={`text-[#1E1B24] transition-transform duration-200 ${
                        openSection === 3 ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>

                {openSection === 3 && (
                  <div className="p-4 border-t-2 border-[#1E1B24] bg-white animate-in fade-in duration-150 flex flex-col gap-3.5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {/* GitHub */}
                      <div className="flex flex-col gap-1">
                        <label className="font-outfit-black text-xs uppercase tracking-wider text-[#1E1B24]">
                          GitHub URL <span className="text-[#D92323]">*</span>
                        </label>
                        <input
                          type="url"
                          required
                          readOnly={isOnboarded}
                          disabled={isOnboarded}
                          value={formData.github}
                          onChange={(e) =>
                            handleChange("github", e.target.value)
                          }
                          className={getInputClass(githubError)}
                        />
                        {githubError && (
                          <span className="font-rubik text-[11px] text-[#FF4D4D] font-bold">
                            {githubError}
                          </span>
                        )}
                      </div>

                      {/* LinkedIn */}
                      <div className="flex flex-col gap-1">
                        <label className="font-outfit-black text-xs uppercase tracking-wider text-[#1E1B24]">
                          LinkedIn URL <span className="text-[#D92323]">*</span>
                        </label>
                        <input
                          type="url"
                          required
                          readOnly={isOnboarded}
                          disabled={isOnboarded}
                          value={formData.linkedin}
                          onChange={(e) =>
                            handleChange("linkedin", e.target.value)
                          }
                          className={getInputClass(linkedinError)}
                        />
                        {linkedinError && (
                          <span className="font-rubik text-[11px] text-[#FF4D4D] font-bold">
                            {linkedinError}
                          </span>
                        )}
                      </div>

                      {/* Instagram */}
                      <div className="flex flex-col gap-1">
                        <label className="font-outfit-black text-xs uppercase tracking-wider text-[#1E1B24]">
                          Instagram URL <span className="text-[#D92323]">*</span>
                        </label>
                        <input
                          type="url"
                          required
                          readOnly={isOnboarded}
                          disabled={isOnboarded}
                          value={formData.insta}
                          onChange={(e) =>
                            handleChange("insta", e.target.value)
                          }
                          className={getInputClass(instaError)}
                        />
                        {instaError && (
                          <span className="font-rubik text-[11px] text-[#FF4D4D] font-bold">
                            {instaError}
                          </span>
                        )}
                      </div>

                      {/* Portfolio */}
                      <div className="flex flex-col gap-1">
                        <label className="font-outfit-black text-xs uppercase tracking-wider text-[#1E1B24]">
                          Portfolio URL{" "}
                          <span className="font-rubik text-[11px] text-[#5C5866] normal-case tracking-normal font-normal">
                            (Optional)
                          </span>
                        </label>
                        <input
                          type="url"
                          readOnly={isOnboarded}
                          disabled={isOnboarded}
                          value={formData.portfolio}
                          onChange={(e) =>
                            handleChange("portfolio", e.target.value)
                          }
                          className={getInputClass(portfolioError)}
                        />
                        {portfolioError && (
                          <span className="font-rubik text-[11px] text-[#FF4D4D] font-bold">
                            {portfolioError}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ACCORDION SECTION 4: NDA Submission */}
              <div className="border-2 border-[#1E1B24] rounded-2xl shadow-[3px_3px_0px_#1E1B24] overflow-hidden bg-white">
                <button
                  type="button"
                  onClick={() => toggleSection(4)}
                  className="w-full flex items-center justify-between p-3.5 sm:p-4 text-left font-outfit-black bg-white hover:bg-[#FAF7EE] transition-colors cursor-pointer select-none"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileText size={18} className="text-[#1E1B24] shrink-0" />
                    <span className="text-sm uppercase tracking-wide truncate">
                      4. NDA Submission
                    </span>
                    <span className="font-rubik text-xs font-semibold text-[#5C5866] shrink-0">
                      ({filled4}/1)
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <span
                      className={`border-2 border-[#1E1B24] px-2.5 py-0.5 rounded-full text-[11px] font-outfit-black uppercase shadow-[1.5px_1.5px_0px_#1E1B24] ${status4.pillClass}`}
                    >
                      {status4.label}
                    </span>
                    <ChevronDown
                      size={18}
                      className={`text-[#1E1B24] transition-transform duration-200 ${
                        openSection === 4 ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>

                {openSection === 4 && (
                  <div className="p-4 border-t-2 border-[#1E1B24] bg-[#F8FAFC] animate-in fade-in duration-150 flex flex-col gap-3.5">
                    <p className="font-rubik text-xs text-[#5C5866]">
                      {ndaTemplate?.description ||
                        "Download the official GCSRM NDA template. Sign it physically or digitally, and upload the signed document image scan below (max 5MB)."}
                    </p>

                    <div>
                      <a
                        href={ndaTemplate.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 bg-[#4EC37B] text-white font-outfit-black text-xs uppercase tracking-wider rounded-xl border-2 border-[#1E1B24] shadow-[2px_2px_0px_#1E1B24] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#1E1B24] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
                      >
                        <span>{ndaTemplate.buttonText}</span>
                      </a>
                    </div>

                    <div className="flex flex-col gap-1.5 pt-1">
                      <label className="font-outfit-black text-xs uppercase tracking-wider text-[#1E1B24]">
                        Signed NDA Document <span className="text-[#D92323]">*</span>
                      </label>
                      <input
                        ref={ndaInputRef}
                        type="file"
                        name="nda"
                        accept={ACCEPTED_FILE_TYPES}
                        className="hidden"
                        onChange={handleNdaChange}
                        disabled={isOnboarded}
                      />

                      {!ndaFile ? (
                        <div
                          onClick={() => !isOnboarded && ndaInputRef.current?.click()}
                          className={`group flex flex-col items-center justify-center gap-2 p-4 border-2 border-dashed ${
                            ndaError
                              ? "border-[#FF4D4D] bg-[#FFF0F0]"
                              : "border-[#1E1B24] bg-white hover:bg-[#FAF7EE]"
                          } rounded-xl cursor-pointer transition-all shadow-[2px_2px_0px_#1E1B24] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none`}
                        >
                          <div className="w-10 h-10 rounded-full bg-[#FAF7EE] border-2 border-[#1E1B24] flex items-center justify-center text-[#1E1B24] group-hover:scale-105 transition-transform">
                            <UploadCloud size={20} />
                          </div>
                          <div className="text-center">
                            <p className="font-outfit-black text-xs text-[#1E1B24] uppercase tracking-wide">
                              Upload Signed NDA Scan
                            </p>
                            <p className="font-rubik text-[11px] text-[#5C5866] mt-0.5">
                              JPG, PNG, HEIC up to 5MB
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 p-3 bg-white border-2 border-[#1E1B24] rounded-xl shadow-[2px_2px_0px_#1E1B24]">
                          {ndaPreview ? (
                            <img
                              src={ndaPreview}
                              alt="NDA preview"
                              className="w-12 h-12 rounded-lg object-cover border-2 border-[#1E1B24] shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-[#FAF7EE] border-2 border-[#1E1B24] flex items-center justify-center shrink-0">
                              <FileCheck size={22} className="text-[#4EC37B]" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-outfit-black text-xs text-[#1E1B24] truncate" title={ndaFile.name}>
                              {ndaFile.name}
                            </p>
                            <p className="font-rubik text-[11px] text-[#5C5866]">
                              {(ndaFile.size / (1024 * 1024)).toFixed(2)} MB
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={handleRemoveNda}
                            className="p-1.5 text-[#FF4D4D] hover:bg-[#FFF0F0] border-2 border-transparent hover:border-[#FF4D4D] rounded-lg transition-colors cursor-pointer shrink-0"
                            title="Remove document"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}

                      {ndaError && (
                        <span className="font-rubik text-[11px] text-[#FF4D4D] font-bold">
                          {ndaError}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

              {/* Validation Helper Note when Incomplete */}
              {!isOnboarded && !isFormComplete && (
                <div className="flex items-start gap-2 p-3 bg-[#FFFEEF] border-2 border-[#1E1B24] rounded-xl shadow-[2px_2px_0px_#1E1B24] text-xs font-rubik text-[#1E1B24]">
                  <Info size={16} className="shrink-0 mt-0.5 text-[#1E1B24]" />
                  <span>
                    <strong>Attention:</strong> Complete all fields in{" "}
                    <span className="font-bold underline">
                      {incompleteSections.join(", ")}
                    </span>{" "}
                    to enable submission.
                  </span>
                </div>
              )}

              {/* Form Footer Buttons */}
              <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                {isOnboarded ? (
                  <button
                    type="button"
                    onClick={onClose}
                    className="border-2 border-black rounded-xl shadow-[3px_3px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#000] font-outfit-black text-sm uppercase px-8 py-2.5 bg-[#1E1B24] hover:bg-[#33303c] text-white transition-all cursor-pointer"
                  >
                    Close
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => setShowClearConfirm(true)}
                      disabled={totalFilled === 0 || isSubmitting}
                      className="px-4 py-2 text-xs md:text-sm font-bold border-2 border-black rounded-xl bg-[#FFF] text-[#FF4D4D] shadow-[2px_2px_0px_#000] hover:bg-red-50 active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#000] transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
                    >
                      Clear Draft
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={isSubmitting}
                      className="border-2 border-black rounded-xl shadow-[3px_3px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#000] font-bold px-4 py-2.5 transition-all cursor-pointer bg-neutral-200 hover:bg-neutral-300 text-black text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!isFormComplete || isSubmitting}
                      className={`inline-flex items-center gap-2 border-2 border-black rounded-xl font-outfit-black text-sm uppercase tracking-wide px-6 py-2.5 transition-all ${
                        isFormComplete && !isSubmitting
                          ? "bg-[#22C55E] hover:bg-[#1eb053] text-white shadow-[3px_3px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#000] cursor-pointer"
                          : "bg-neutral-300 text-neutral-500 shadow-none border-neutral-400 cursor-not-allowed opacity-75"
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          <span>Saving Changes...</span>
                        </>
                      ) : (
                        <span>Save Changes</span>
                      )}
                    </button>
                  </>
                )}
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Floating Popup Toast */}
      <Popup
        isOpen={popup.isOpen}
        type={popup.type}
        title={popup.title}
        message={popup.message}
        autoCloseMs={popup.autoCloseMs}
        onClose={() => setPopup((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Custom Neo-Brutalist Clear Draft Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="max-w-md w-full bg-[#FFFDF5] border-[3px] border-black rounded-2xl p-6 shadow-[6px_6px_0px_#000] flex flex-col gap-4 text-left animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center gap-2.5">
              <span className="bg-[#FF4D4D] text-white border-2 border-black px-2.5 py-0.5 rounded-full text-xs font-outfit-black uppercase shadow-[1.5px_1.5px_0px_#000]">
                WARNING
              </span>
              <h3 className="font-outfit-black text-lg text-[#1E1B24] tracking-tight">
                Clear Saved Draft?
              </h3>
            </div>

            {/* Body */}
            <p className="font-rubik text-sm text-[#5C5866] leading-relaxed">
              Are you sure you want to clear your saved draft? All unsaved inputs across all sections will be reset.
            </p>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="border-2 border-black rounded-xl bg-[#FFF] hover:bg-neutral-100 px-4 py-2 font-bold text-xs md:text-sm shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer text-[#1E1B24]"
              >
                Cancel / Keep Draft
              </button>
              <button
                type="button"
                onClick={handleExecuteClearDraft}
                className="border-2 border-black rounded-xl bg-[#FF4D4D] hover:bg-[#e04343] text-white px-4 py-2 font-bold text-xs md:text-sm shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
              >
                Yes, Clear Draft
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UpdateDataModal;
