"use client";

import React, { useState, useEffect } from "react";
import Dropdown from "@/components/common/Dropdown";
import { InstructionsModal } from "./InstructionsModal";
import { RecruitmentTask } from "./types";
import { X, Info } from "lucide-react";
import taskLinksData from "./domainTaskLinks.json";

interface TaskDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks?: RecruitmentTask[];
  domain?: string;
  year?: string;
}

export function TaskDetailsModal({ isOpen, onClose, tasks = [], domain, year }: TaskDetailsModalProps) {
  const [showInstructions, setShowInstructions] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedTaskId, setSelectedTaskId] = useState<string>("");
  const getTaskId = (task: RecruitmentTask): string => String(task._id || task.id || task.title);

  const normalizedDomain = (domain || "").trim();
  const isCorporate = normalizedDomain.toLowerCase().includes("corp");
  const isCreatives = normalizedDomain.toLowerCase().includes("creative") || normalizedDomain.toLowerCase().includes("gfx") || normalizedDomain.toLowerCase().includes("vfx");
  const isTechnical = normalizedDomain.toLowerCase().includes("tech") || normalizedDomain.toLowerCase().includes("web") || normalizedDomain.toLowerCase().includes("ai") || normalizedDomain.toLowerCase().includes("ml");

  const normalizedYear = year ? `Year ${year}` : "Year 1";

  // Determine domain/category-specific resource download link from JSON
  const getDomainTaskLink = (taskTitle: string = "", categoryName: string = ""): string => {
    const dLower = normalizedDomain.toLowerCase();
    const tLower = taskTitle.toLowerCase();
    const cLower = categoryName.toLowerCase();

    if (dLower.includes("corp")) {
      const corpLinks = taskLinksData.Corporate as Record<string, string>;
      return corpLinks[normalizedYear] || corpLinks["Year 1"] || "";
    }

    if (dLower.includes("creative") || dLower.includes("gfx") || dLower.includes("vfx") || cLower.includes("gfx") || cLower.includes("vfx")) {
      const creativesLinks = taskLinksData.Creatives as Record<string, string>;
      if (tLower.includes("vfx") || tLower.includes("motion") || tLower.includes("video") || cLower.includes("vfx")) {
        return creativesLinks["Both Years"] || "";
      }
      return creativesLinks[normalizedYear] || creativesLinks["Year 1"] || "";
    }

    if (dLower.includes("tech") || dLower.includes("web") || dLower.includes("ai") || dLower.includes("ml") || cLower.includes("ai") || cLower.includes("ml") || cLower.includes("web") || cLower.includes("dev")) {
      const techLinks = taskLinksData.Technical as Record<string, Record<string, string>>;
      if (tLower.includes("ai") || tLower.includes("ml") || tLower.includes("intelligence") || cLower.includes("ai") || cLower.includes("ml")) {
        const aiLinks = techLinks["AI/ML"];
        return aiLinks[normalizedYear] || aiLinks["Year 1"] || "";
      }
      const webLinks = techLinks["WebDev"];
      return webLinks[normalizedYear] || webLinks["Year 1"] || "";
    }

    // Fallback general lookup
    const creativesLinks = taskLinksData.Creatives as Record<string, string>;
    return creativesLinks[normalizedYear] || "";
  };

  // If corporate, categorize tasks into "Video Task" (taskType containing video or title/desc related to video) vs remaining categories
  const isVideoTask = (t: RecruitmentTask): boolean => {
    const tt = (t.taskType || "").toLowerCase();
    const title = (t.title || "").toLowerCase();
    return tt.includes("video") || title.includes("video") || title.includes("self-introduction") || title.includes("intro");
  };

  const categories = Array.from(new Set(tasks.map((t) => t.taskType).filter(Boolean)));
  const categoryOptions = categories.map((cat) => ({ label: String(cat), value: String(cat) }));

  // For corporate domain: Task 1 is always Video Task
  const videoTasks = tasks.filter((t) => isVideoTask(t));
  const nonVideoTasks = tasks.filter((t) => !isVideoTask(t));
  const nonVideoCategories = Array.from(new Set(nonVideoTasks.map((t) => t.taskType).filter(Boolean)));
  const nonVideoCategoryOptions = nonVideoCategories.map((cat) => ({ label: String(cat), value: String(cat) }));

  const activeCategories = isCorporate ? nonVideoCategories : categories;
  const activeCategoryOptions = isCorporate ? nonVideoCategoryOptions : categoryOptions;

  const filteredTasks = isCorporate
    ? nonVideoTasks
    : tasks.filter((t) => t.taskType === selectedCategory);

  const task2Options = filteredTasks.map((t) => ({ label: t.title, value: getTaskId(t) }));

  // Auto-select if there is only 1 non-video task (e.g. corporate 1st year task)
  useEffect(() => {
    if (isCorporate && nonVideoTasks.length === 1) {
      setSelectedTaskId(getTaskId(nonVideoTasks[0]));
    }
  }, [tasks, isCorporate]); // eslint-disable-line react-hooks/exhaustive-deps

  // Initialize or reset category when modal opens or tasks change
  useEffect(() => {
    if (isOpen && activeCategories.length > 0) {
      if (!selectedCategory || !activeCategories.includes(selectedCategory)) {
        setSelectedCategory(activeCategories[0]);
      }
    }
  }, [isOpen, tasks, domain]); // eslint-disable-line react-hooks/exhaustive-deps

  // Always reset task selection on category switch/initial load (unless single task corporate)
  useEffect(() => {
    if (!isCorporate || nonVideoTasks.length !== 1) {
      setSelectedTaskId("");
    }
  }, [selectedCategory, tasks]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const currentTask =
    isCorporate && nonVideoTasks.length === 1
      ? nonVideoTasks[0]
      : filteredTasks.find((t) => getTaskId(t) === selectedTaskId);

  const videoTask = videoTasks.length > 0 ? videoTasks[0] : null;

  // Compute overall top-level download link based on domain, selected category, or task
  const topLevelTaskLink = isCorporate
    ? getDomainTaskLink("", "")
    : getDomainTaskLink(currentTask?.title || "", selectedCategory);

  // Reusable task card renderer helper
  const renderTaskCard = (task: RecruitmentTask & { link?: string; resourceLink?: string; figmaLink?: string; fileLink?: string }, badgeText?: string) => {
    const taskLink = task.link || task.resourceLink || task.figmaLink || task.fileLink || getDomainTaskLink(task.title, selectedCategory);

    return (
      <div className="flex flex-col gap-3 p-4 sm:p-5 bg-[#FFFDF0] border-2 border-[#1E1B24] rounded-xl shadow-[4px_4px_0px_#1E1B24]">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-outfit-black text-[20px] sm:text-[22px] text-[#1E1B24] leading-tight mb-1">
              {task.title}
            </h3>
          </div>
          {badgeText && (
            <span className="font-outfit-black text-[11px] bg-[#4EC37B] text-white px-2.5 py-1 rounded-full border border-[#1E1B24] shadow-[1px_1px_0px_#1E1B24] shrink-0">
              {badgeText}
            </span>
          )}
        </div>

        {task.techStack && task.techStack.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {task.techStack.map((tech, i) => (
              <span key={i} className="font-outfit-black text-[10px] uppercase tracking-[1px] px-2 py-0.5 rounded-full border border-[#1E1B24] bg-[#4EC37B] text-white shadow-[1px_1px_0px_#1E1B24]">
                {tech}
              </span>
            ))}
          </div>
        )}

        {task.goal && (
          <div>
            <h4 className="font-outfit-black text-sm uppercase text-[#1E1B24] mb-1">Goal</h4>
            <p className="font-rubik text-sm text-[#5C5866] font-medium leading-relaxed">
              {task.goal}
            </p>
          </div>
        )}

        {task.description && (
          <div>
            <h4 className="font-outfit-black text-sm uppercase text-[#1E1B24] mb-1">Description</h4>
            <p className="font-rubik text-sm text-[#5C5866] font-medium leading-relaxed whitespace-pre-wrap">
              {task.description}
            </p>
          </div>
        )}

        {task.guidelines && (
          <div>
            <h4 className="font-outfit-black text-sm uppercase text-[#1E1B24] mb-1">Guidelines</h4>
            <p className="font-rubik text-sm text-[#5C5866] font-medium leading-relaxed whitespace-pre-wrap">
              {task.guidelines}
            </p>
          </div>
        )}

        {task.requirements && task.requirements.length > 0 && (
          <div>
            <h4 className="font-outfit-black text-sm uppercase text-[#1E1B24] mb-1">Requirements</h4>
            <ul className="list-disc list-inside font-rubik text-sm text-[#5C5866] font-medium space-y-1">
              {task.requirements.map((req, i) => (
                <li key={i}>{req}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-[95vw] sm:w-[85vw] md:w-[75vw] lg:w-[60vw] xl:w-[55vw] max-h-[90vh] bg-white border-[3px] border-[#1E1B24] rounded-xl shadow-[8px_8px_0px_#1E1B24] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="shrink-0 flex items-center justify-between p-4 bg-[#FFD93D] border-b-[3px] border-[#1E1B24] rounded-t-xl">
          <h2 className="font-outfit-black text-xl text-[#1E1B24] uppercase tracking-wide">
            Task Details {year ? `(Year ${year})` : ""}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setShowInstructions(true)}
              className="p-1 border-2 border-[#1E1B24] rounded bg-white hover:bg-[#3E9FFF] transition-colors group cursor-pointer"
              title="View Domain Instructions"
            >
              <Info size={20} className="text-[#1E1B24] group-hover:text-white transition-colors" />
            </button>
            <button
              onClick={onClose}
              className="p-1 border-2 border-[#1E1B24] rounded bg-white hover:bg-[#EF4444] transition-colors group cursor-pointer"
            >
              <X size={20} className="text-[#1E1B24] group-hover:text-white transition-colors" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 flex flex-col gap-6">
          {/* Top-Level Quick Download / Resource Link Button (Visible right after selection) */}
          {topLevelTaskLink && (
            <div className="w-full bg-[#EBFBF0] border-2 border-[#1E1B24] rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-[3px_3px_0px_#1E1B24]">
              <div className="flex flex-col text-left">
                <span className="font-outfit-black text-sm text-[#1E1B24] uppercase">
                  Task Resource &amp; Guidelines Available
                </span>
                <span className="font-rubik text-xs text-[#5C5866]">
                  Download or open the official task document / package for {normalizedYear} ({normalizedDomain}).
                </span>
              </div>
              <a
                href={topLevelTaskLink}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-[#4EC37B] text-white font-outfit-black text-xs uppercase tracking-wider rounded-xl border-2 border-[#1E1B24] shadow-[2px_2px_0px_#1E1B24] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#1E1B24] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
              >
                <span>📥 Download Task Link</span>
              </a>
            </div>
          )}

          {/* For Corporate: Task 1 Mandatory Video Task */}
          {isCorporate && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="font-outfit-black text-base text-[#1E1B24] uppercase tracking-wider">
                  Task 1 : Mandatory Video Task
                </span>
                <span className="font-outfit-black text-[11px] bg-[#4EC37B] text-white px-2.5 py-0.5 rounded-full border border-[#1E1B24] shadow-[1px_1px_0px_#1E1B24]">
                  Mandatory
                </span>
              </div>
              {videoTask ? (
                renderTaskCard(videoTask)
              ) : (
                <div className="flex flex-col gap-3 p-4 bg-[#FFFDF0] border-2 border-[#1E1B24] rounded-xl shadow-[4px_4px_0px_#1E1B24]">
                  <h3 className="font-outfit-black text-[20px] text-[#1E1B24]">Self-Introduction Video Task</h3>
                  <p className="font-rubik text-sm text-[#5C5866] font-medium leading-relaxed">
                    Record and upload a short 30s to 1-minute self-introduction video to Google Drive. Ensure link permissions are set to public view before submitting.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Task 2 Section */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="font-outfit-black text-base text-[#1E1B24] uppercase tracking-wider">
                {isCorporate ? "Task 2 : Task" : "Task Selection"}
              </span>
            </div>

            {/* Non-corporate Category Dropdown */}
            {!isCorporate && activeCategoryOptions.length > 0 && (
              <div className="flex flex-col gap-1.5 relative">
                <label className="font-outfit-black text-sm text-[#1E1B24] uppercase">
                  Category
                </label>
                <Dropdown
                  value={selectedCategory}
                  onChange={(val) => setSelectedCategory(val)}
                  options={activeCategoryOptions}
                  placeholder="Select Category"
                  triggerBg="bg-white"
                  disabled={activeCategoryOptions.length <= 1}
                />
              </div>
            )}

            {/* Task Name Dropdown (only show if more than 1 task available) */}
            {!(isCorporate && nonVideoTasks.length === 1) && (
              <div className="flex flex-col gap-1.5 relative z-10">
                <label className="font-outfit-black text-sm text-[#1E1B24] uppercase">
                  {isCorporate ? "Task 2 : Task Name" : "Task Name"}
                </label>
                <Dropdown
                  value={selectedTaskId}
                  onChange={(val) => setSelectedTaskId(val)}
                  options={isCorporate ? nonVideoTasks.map((t) => ({ label: t.title, value: getTaskId(t) })) : task2Options}
                  placeholder="Choose any one"
                  placeholderClassName="font-bold text-[var(--error,#D92323)]"
                  disabled={isCorporate ? nonVideoTasks.length === 0 : filteredTasks.length === 0}
                  triggerBg="bg-white"
                />
              </div>
            )}
          </div>

          {/* Selected Task Details Card (For Task 2 / standard domains) */}
          {currentTask && (
            <div className="flex flex-col gap-3">
              {!(isCorporate && nonVideoTasks.length === 1) && (
                <span className="font-outfit-black text-base text-[#1E1B24] uppercase tracking-wider">
                  Task 2 Details
                </span>
              )}
              {renderTaskCard(currentTask)}
            </div>
          )}

          {!currentTask && isCorporate && nonVideoTasks.length > 1 && (
            <div className="p-4 border-2 border-dashed border-[#1E1B24]/40 rounded-xl text-center font-rubik text-sm font-medium text-[#1E1B24]/60">
              Please select a Task 2 option from the dropdown above to view its full requirements, guidelines, and goals.
            </div>
          )}

          {!currentTask && !isCorporate && (
            <div className="p-6 border-2 border-dashed border-[#1E1B24]/40 rounded-xl text-center font-rubik text-sm font-medium text-[#1E1B24]/60">
              Please select a task from above to view its details, requirements, and guidelines.
            </div>
          )}
        </div>
      </div>
    </div>
      <InstructionsModal
        isOpen={showInstructions}
        onClose={() => setShowInstructions(false)}
        domain={domain}
      />
    </>
  );
}

export default TaskDetailsModal;
