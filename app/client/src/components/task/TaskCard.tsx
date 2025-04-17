import {
  AlarmClock,
  ChevronDown,
  ChevronUp,
  Flag,
  Plus,
} from "lucide-react";
import { useState } from "react";
import ProgressBar from "../progressBar/ProgressBar";
import { motion, AnimatePresence } from 'framer-motion';
import SubTask from "./SubTasks";

interface Subtask {
  id: string;
  taskId: string;
  name: string;
  isCompleted: boolean;
}

interface Task {
  id: string;
  name: string;
  type: string;
  priority: string | null;
  estTime: number;
  deadline: string;
  isCompleted: boolean;
  subtasks: Subtask[];
}

interface TaskCardProps {
  item: Task;
  updateTask: (taskId: string, isCompleted: boolean) => void;
  updateSubtask: (taskId: string, subtaskId: string, isCompleted: boolean) => void;
}

function TaskCard({ item, updateTask, updateSubtask }: TaskCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Format deadline for display
  const formatDeadline = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Calculate subtask completion stats
  const completedSubtasks = item.subtasks.filter(subtask => subtask.isCompleted).length;
  const totalSubtasks = item.subtasks.length;
  const progress = totalSubtasks > 0 ? completedSubtasks / totalSubtasks : 0;

  // Handle task completion toggle
  const handleCompleted = () => {
    updateTask(item.id, !item.isCompleted);
  };

  return (
    <div className="flex gap-2 md:gap-3 py-3 md:py-4">
      <div
        onClick={handleCompleted}
        className={`w-4 h-4 rounded-full ${
          item.isCompleted ? "bg-[--secondary]" : "bg-[--primary]"
        } border-6 border-black mt-6 flex-shrink-0 cursor-pointer`}
      />
      <div className="flex flex-col w-full bg-[--background-2] px-3 sm:px-6 md:px-10 py-4 md:py-7 rounded-xl gap-2 md:gap-4">
        <div
          className="flex justify-between w-full items-center cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <h1 className={`${item.isCompleted && "line-through"} text-xl sm:text-2xl md:text-3xl lg:text-4xl truncate`}>
            {item.name}
          </h1>
          {isOpen ? <ChevronUp className="flex-shrink-0" /> : <ChevronDown className="flex-shrink-0" />}
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
          <div className="flex flex-wrap gap-2 md:gap-4">
            <button className="rounded border border-[--secondary] p-1 md:p-2 text-xs md:text-sm flex-shrink-0">
              {formatDeadline(item.deadline)}
            </button>
            <button className="rounded border border-[--secondary] p-1 md:p-2 flex gap-1 md:gap-3 text-xs md:text-sm flex-shrink-0">
              <Flag size={16} />
              {item.priority || "Normal"}
            </button>
            <button className="rounded border border-[--secondary] p-1 md:p-2 flex gap-1 md:gap-3 text-xs md:text-sm flex-shrink-0">
              <AlarmClock size={16} />
              {item.estTime}h
            </button>
          </div>
          <button className="bg-[--secondary] text-[--ternary] rounded-full h-fit w-fit p-1 flex-shrink-0">
            <Plus size={18} />
          </button>
        </div>

        <ProgressBar progress={progress} />
        
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="border-l ml-1 p-4"
            >
              {item.subtasks.map((subtask) => (
                <SubTask
                  key={subtask.id}
                  subtask={subtask}
                  taskId={item.id}
                  updateSubtask={updateSubtask}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default TaskCard;