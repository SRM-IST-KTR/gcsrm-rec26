"use client";

import React, { useState, useEffect } from "react";
import Dropdown from "@/components/common/Dropdown";
import { RecruitmentTask } from "./types";
import { X } from "lucide-react";

interface TaskDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks?: RecruitmentTask[];
}

export function TaskDetailsModal({ isOpen, onClose, tasks = [] }: TaskDetailsModalProps) {
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

  // Strictly sync task ID when category changes
  useEffect(() => {
    if (selectedCategory) {
      const availableTasks = tasks.filter((t) => t.taskType === selectedCategory);
      if (availableTasks.length > 0) {
        // Default to the first task if current selection is invalid or empty for this category
        const isValid = availableTasks.some((t) => getTaskId(t) === selectedTaskId);
        if (!isValid) {
          setSelectedTaskId(getTaskId(availableTasks[0]));
        }
      } else {
        setSelectedTaskId("");
      }
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

  const currentTask = filteredTasks.find((t) => getTaskId(t) === selectedTaskId) || filteredTasks[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Added overflow-visible so dropdown lists can float cleanly outside the modal box bounds */}
      <div className="relative w-[95vw] sm:w-[80vw] md:w-[65vw] lg:w-[50vw] xl:w-[45vw] max-h-[90vh] bg-white border-[3px] border-[#1E1B24] rounded-xl shadow-[8px_8px_0px_#1E1B24] flex flex-col overflow-visible">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-[#FFD93D] border-b-[3px] border-[#1E1B24] rounded-t-xl">
          <h2 className="font-outfit-black text-xl text-[#1E1B24] uppercase tracking-wide">
            Task Details
          </h2>
          <button
            onClick={onClose}
            className="p-1 border-2 border-[#1E1B24] rounded bg-white hover:bg-[#EF4444] transition-colors group cursor-pointer"
          >
            <X size={20} className="text-[#1E1B24] group-hover:text-white transition-colors" />
          </button>
        </div>

        {/* Content - overflow-y-auto restricted only here so dropdowns aren't clipped */}
        <div className="p-4 sm:p-5 flex flex-col gap-4 flex-1 min-h-0 overflow-y-auto overflow-x-visible">
          {/* Controls with explicit high z-index layering */}
          <div className="flex flex-col gap-3 shrink-0 relative z-30">
            <div className="flex flex-col gap-1.5 relative">
              <label className="font-outfit-black text-sm text-[#1E1B24] uppercase">Category</label>
              <Dropdown
                value={selectedCategory}
                onChange={(val) => {
                  setSelectedCategory(val);
                  const firstMatch = tasks.find((t) => t.taskType === val);
                  if (firstMatch) setSelectedTaskId(getTaskId(firstMatch));
                }}
                options={categoryOptions}
                placeholder="Select Category"
                triggerBg="bg-white"
                disabled={categoryOptions.length === 1}
              />
            </div>

            <div className="flex flex-col gap-1.5 relative z-20">
              <label className="font-outfit-black text-sm text-[#1E1B24] uppercase">Task Name</label>
              <Dropdown
                value={selectedTaskId}
                onChange={(val) => setSelectedTaskId(val)}
                options={taskOptions}
                placeholder="Select Task"
                disabled={filteredTasks.length <= 1}
                triggerBg="bg-white"
              />
            </div>
          </div>

          {/* Task Details Display */}
          {currentTask && (
            <div className="flex flex-col gap-3 mt-1 p-4 bg-[#FFFDF0] border-2 border-[#1E1B24] rounded-xl shadow-[4px_4px_0px_#1E1B24]">
              <div>
                <h3 className="font-outfit-black text-[22px] text-[#1E1B24] leading-tight mb-2">
                  {currentTask.title}
                </h3>
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
          )}
        </div>
      </div>
    </div>
  );
}