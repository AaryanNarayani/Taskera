import {
  AlarmClock,
  ChevronDown,
  ChevronUp,
  Flag,
  Plus,
} from "lucide-react";
import { useEffect, useState } from "react";
import ProgressBar from "../progressBar/ProgressBar";
import Milestone from "./Milestone";
import {motion, AnimatePresence} from 'framer-motion'

interface Task {
  name: string;
  milestone?: any[];
  milestone1?: any;
  done: boolean;
}

function TaskCard({item, setTasks, taskIndex, updateSubtask}: {
    item: Task, 
    setTasks: any, 
    taskIndex: number,
    updateSubtask: (taskIndex: number, milestoneIndex: number, subtaskIndex: number, done: boolean) => void
}) {
  const [isCompleted, setIsCompleted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleCompleted = () => {
    const updatedIsCompleted = !isCompleted;
    setIsCompleted(updatedIsCompleted);
    
    setTasks((prevTasks: Task[]) => 
      prevTasks.map((task) => 
        task === item ? { ...task, done: updatedIsCompleted } : task
      )
    );
  }

  const milestoneArray = item.milestone?.map(milestone => milestone.subtasks);
  let subtaskLength = 0;
  let subtasksTrue: any[] = [];

  milestoneArray?.forEach((subtask: any) => {
    subtasksTrue = subtasksTrue.concat(
      subtask.filter((trueTask: any) => trueTask.done)
    );
    subtaskLength += subtask.length;
  });

  useEffect(()=>{
    const handleSame = () => {
      if(subtaskLength === subtasksTrue.length){
        setIsCompleted(true)
        setIsOpen(false)
      }
      else setIsCompleted(false)
    }
    handleSame();
  },[subtasksTrue.length, subtaskLength])


  return (
    <div className="flex gap-2 md:gap-3 py-3 md:py-4">
      <div
        onClick={() => {
          handleCompleted();
        }}
        className={`w-4 h-4 rounded-full ${
          isCompleted ? "bg-[--secondary]" : "bg-[--primary]"
        } border-6 border-black mt-6 flex-shrink-0`}
      />
      <div className="flex flex-col w-full bg-[--background-2] px-3 sm:px-6 md:px-10 py-4 md:py-7 rounded-xl gap-2 md:gap-4">
        <div
          className="flex justify-between w-full items-center cursor-pointer"
          onClick={() => {
            setIsOpen(!isOpen)
          }}
        >
          <h1 className={`${isCompleted && "line-through"} text-xl sm:text-2xl md:text-3xl lg:text-4xl truncate`}>
            {item.name}
          </h1>
          {isOpen ? <ChevronUp className="flex-shrink-0" /> : <ChevronDown className="flex-shrink-0" />}
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
          <div className="flex flex-wrap gap-2 md:gap-4">
            <button className="rounded border border-[--secondary] p-1 md:p-2 text-xs md:text-sm flex-shrink-0">
              8:00am - 9:00am
            </button>
            <button className="rounded border border-[--secondary] p-1 md:p-2 flex gap-1 md:gap-3 text-xs md:text-sm flex-shrink-0">
              <Flag size={16} />
              Normal
            </button>
            <button className="rounded border border-[--secondary] p-1 md:p-2 flex gap-1 md:gap-3 text-xs md:text-sm flex-shrink-0">
              <AlarmClock size={16} />
              Reminders
            </button>
          </div>
          <button className="bg-[--secondary] text-[--ternary] rounded-full h-fit w-fit p-1 flex-shrink-0">
            <Plus size={18} />
          </button>
        </div>

        <ProgressBar progress={subtasksTrue.length/subtaskLength} />
        <div>
          <AnimatePresence>
            {isOpen && item.milestone?.map((ms : any, i : number) => (
              <motion.div key={i}
                initial={{height : 0, opacity:0}}
                animate={{height: 'fit-content', opacity:1}}
                exit={{height : 0, opacity:0}}
                transition={{
                  duration: 0.3,
                  delay: 0.1,
                }}
              >
                <Milestone 
                  ms={ms} 
                  taskIndex={taskIndex}
                  milestoneIndex={i}
                  updateSubtask={updateSubtask}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default TaskCard;