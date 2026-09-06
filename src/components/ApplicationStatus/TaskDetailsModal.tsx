"use client";

import React, { useState, useEffect } from "react";
import Dropdown from "@/components/common/Dropdown";
import { InstructionsModal } from "./InstructionsModal";
import { RecruitmentTask } from "./types";
import { X } from "lucide-react";
import { Tooltip } from "@/components/common/Tooltip";
interface TaskDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks?: RecruitmentTask[];
  domain?: string;
  onOpenInstructions?: () => void;
}
export function TaskDetailsModal({ isOpen, onClose, tasks = [], domain, onOpenInstructions }: TaskDetailsModalProps) {
  const [showInstructions, setShowInstructions] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedTaskId, setSelectedTaskId] = useState<string>("");
  const getTaskId = (task: RecruitmentTask): string => String(task._id || task.id || task.title);

  const categories = Array.from(new Set(tasks.map((t) => t.taskType).filter(Boolean)));
  const categoryOptions = categories.map((cat) => ({ label: String(cat), value: String(cat) }));
  
  // Strictly filter tasks matching the current category
  const filteredTasks = tasks.filter((t) => t.taskType === selectedCategory);
  const taskOptions = filteredTasks.map((t) => ({ label: t.title, value: getTaskId(t) }));

  // Initialize or reset category when modal opens or tasks change
  useEffect(() => {
    if (isOpen && categories.length > 0) {
      if (!selectedCategory || !categories.includes(selectedCategory)) {
        setSelectedCategory(categories[0]);
      }
    }
  }, [isOpen, tasks]); // eslint-disable-line react-hooks/exhaustive-deps

  // Always reset task selection on category switch/initial load
  useEffect(() => {
    setSelectedTaskId("");
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

  const currentTask = filteredTasks.find((t) => getTaskId(t) === selectedTaskId);

  return (
    <>
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Added overflow-visible so dropdown lists can float cleanly outside the modal box bounds */}
      <div className="relative w-[95vw] sm:w-[80vw] md:w-[65vw] lg:w-[50vw] xl:w-[45vw] max-h-[90vh] bg-white border-[3px] border-[#1E1B24] rounded-xl shadow-[8px_8px_0px_#1E1B24] flex flex-col overflow-visible">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-[#FFD93D] border-b-[3px] border-[#1E1B24] rounded-t-xl">
          <h2 className="font-outfit-black text-xl text-[#1E1B24] uppercase tracking-wide">
            Task Details
          </h2>
          <div className="flex items-center gap-2">
            <Tooltip content="View domain instructions" position="bottom">
              <button
                type="button"
                onClick={onOpenInstructions || (() => setShowInstructions(true))}
                aria-label="View domain instructions"
                className="w-7 h-7 flex items-center justify-center rounded-full bg-white border-2 border-[#1E1B24] font-outfit-black text-xs text-[#1E1B24] hover:bg-[#FFFDF0] active:translate-x-[1px] active:translate-y-[1px] shadow-[2px_2px_0px_#1E1B24] cursor-pointer transition-all"
              >
                i
              </button>
            </Tooltip>

            <button
              type="button"
              onClick={onClose}
              className="p-1 border-2 border-[#1E1B24] rounded bg-white hover:bg-[#EF4444] transition-colors group cursor-pointer"
            >
              <X size={20} className="text-[#1E1B24] group-hover:text-white transition-colors" />
            </button>
          </div>
        </div>

        {/* Controls: Static & Overflow Visible */}
        <div className="shrink-0 flex flex-col gap-3 p-4 sm:p-5 pb-2 relative z-30 overflow-visible">
            <div className="flex flex-col gap-1.5 relative">
              <label className="font-outfit-black text-sm text-[#1E1B24] uppercase">Category</label>
              <Dropdown
                value={selectedCategory}
                onChange={(val) => setSelectedCategory(val)}
                options={categoryOptions}
                placeholder="Select Category"
                triggerBg="bg-white"
                disabled={categoryOptions.length === 1}
              />
            </div>

            <div className="flex flex-col gap-1.5 relative z-10">
              <label className="font-outfit-black text-sm text-[#1E1B24] uppercase">
                Task Name
              </label>
              <Dropdown
                value={selectedTaskId}
                onChange={(val) => setSelectedTaskId(val)}
                options={taskOptions}
                placeholder="Choose any one"
                placeholderClassName="font-bold text-[var(--error,#D92323)]"
                disabled={filteredTasks.length === 0}
                triggerBg="bg-white"
              />
            </div>
        </div>

        {/* Scrollable Content: ONLY the task details card scrolls */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 pt-1">
          {/* Task Details Display */}
          {currentTask ? (
            <div className="flex flex-col gap-3 mt-1 p-4 bg-[#FFFDF0] border-2 border-[#1E1B24] rounded-xl shadow-[4px_4px_0px_#1E1B24]">
              <div>
                <h3 className="font-outfit-black text-[22px] text-[#1E1B24] leading-tight mb-1">
                  {currentTask.title}
                </h3>
                <p className="font-outfit-black text-sm text-[#1E1B24] tracking-wide mt-1 mb-2">
                  <strong>Deadline : 13sept</strong>
                </p>
                {currentTask.techStack && currentTask.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {currentTask.techStack.map((tech, i) => (
                      <span key={i} className="font-outfit-black text-[10px] uppercase tracking-[1px] px-2 py-0.5 rounded-full border border-[#1E1B24] bg-[#4EC37B] text-white shadow-[1px_1px_0px_#1E1B24]">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {currentTask.goal && (
                <div>
                  <h4 className="font-outfit-black text-sm uppercase text-[#1E1B24] mb-1">Goal</h4>
                  <p className="font-rubik text-sm text-[#5C5866] font-medium leading-relaxed">
                    {currentTask.goal}
                  </p>
                </div>
              )}

              {currentTask.description && (
                <div>
                  <h4 className="font-outfit-black text-sm uppercase text-[#1E1B24] mb-1">Description</h4>
                  <p className="font-rubik text-sm text-[#5C5866] font-medium leading-relaxed whitespace-pre-wrap">
                    {currentTask.description}
                  </p>
                </div>
              )}

              {currentTask.guidelines && (
                <div>
                  <h4 className="font-outfit-black text-sm uppercase text-[#1E1B24] mb-1">Guidelines</h4>
                  <p className="font-rubik text-sm text-[#5C5866] font-medium leading-relaxed whitespace-pre-wrap">
                    {currentTask.guidelines}
                  </p>
                </div>
              )}

              {currentTask.requirements && currentTask.requirements.length > 0 && (
                <div>
                  <h4 className="font-outfit-black text-sm uppercase text-[#1E1B24] mb-1">Requirements</h4>
                  <ul className="list-disc list-inside font-rubik text-sm text-[#5C5866] font-medium space-y-1">
                    {currentTask.requirements.map((req, i) => (
                      <li key={i}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
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