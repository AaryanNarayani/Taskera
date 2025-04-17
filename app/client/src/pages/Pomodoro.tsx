/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { motion, useAnimation, AnimationControls } from "framer-motion";
import Play from "../components/playPause/Play";
import Pause from "../components/playPause/Pause";
import { Plus, RotateCcw, X, Clock, CheckSquare } from "lucide-react";
import axios from "axios";
import { BASE_URL } from "@/utils/vars";

interface PomodoroProps {
  duration?: number; // in seconds
  radius?: number;
}

interface Subtask {
  id: string;
  taskId: string;
  name: string;
  isCompleted: boolean;
}

interface Task {
  id: string;
  userId: string;
  name: string;
  type: string;
  priority: string | null;
  estTime: number;
  deadline: string;
  courseId: string | null;
  groupId: string | null;
  isCompleted: boolean;
  timeStudied: number;
  status: string;
  subtasks: Subtask[];
  events: any[];
}

interface TaskData {
  today: Task[];
  all: Task[];
}

export default function Pomodoro({
  duration = 25 * 60,
  radius = 60,
}: PomodoroProps): JSX.Element {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const controls: AnimationControls = useAnimation();
  const circumference: number = 2 * Math.PI * radius;

  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [startTime, setStartTime] = useState<number | null>(null);

  const [isPopUpActive, setIsPopUpActive] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'today' | 'all'>('today');

  const [taskData, setTaskData] = useState<TaskData>({
      today: [],
      all: []
  });
  
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    let interval: any | undefined;

    if (isPlaying) {
      setStartTime(Date.now() - elapsedTime * 1000);

      interval = setInterval(() => {
        const elapsed: number = (Date.now() - (startTime ?? Date.now())) / 1000;
        setElapsedTime(elapsed);

        const progress: number = Math.min(1, elapsed / duration);
        const offset: number = circumference * (1 - progress);
        controls.set({ strokeDashoffset: offset });

        if (elapsed >= duration) {
          setIsPlaying(false);
          clearInterval(interval);
          
          // Update timeStudied for selected task when timer completes
          if (selectedTask) {
            updateTaskTimeStudied(selectedTask.id, Math.floor(duration / 60));
          }
        }
      }, 16);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, startTime, duration, controls, circumference, selectedTask]);

  const togglePlay = (): void => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = (): void => {
    setIsPlaying(false);
    setElapsedTime(0);
    setStartTime(null);
    controls.set({ strokeDashoffset: circumference });
  };

  const updateTaskTimeStudied = async (taskId: string, minutes: number) => {
    try {
      await axios.patch(`${BASE_URL}/api/v1/tasks/${taskId}`, {
        timeStudied: (selectedTask?.timeStudied || 0) + minutes
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Refresh tasks data
      fetchTasks();
    } catch (error) {
      console.error('Error updating task time:', error);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/tasks/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setTaskData(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const selectTask = (task: Task) => {
    setSelectedTask(task);
    setIsPopUpActive(false);
  };

  const getPriorityColor = (priority: string | null) => {
    switch(priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-400';
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center w-full px-4">
        <div className="flex items-center justify-center relative w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl">
          <h1 className="absolute text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-medium">
            {`${Math.floor((duration - Math.floor(elapsedTime)) / 60)
              .toString()
              .padStart(2, "0")}:${Math.floor(
              (duration - Math.floor(elapsedTime)) % 60
            )
              .toString()
              .padStart(2, "0")}`}
          </h1>
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 200 200"
            className="select-none w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg"
          >
            <circle
              cx="100"
              cy="100"
              r={radius}
              stroke="currentColor"
              strokeWidth="6"
              fill="none"
              className="text-[--secondary] rounded-full"
            />

            <motion.circle
              cx="100"
              cy="100"
              r={radius}
              stroke="currentColor"
              strokeWidth="7"
              fill="none"
              className="text-[--background-2] rounded-full"
              style={{ rotate: 90, transformOrigin: "center", rotateX: 180 }}
              initial={{
                strokeDasharray: circumference,
                strokeDashoffset: circumference,
              }}
              animate={controls}
            />
          </svg>
        </div>
        
        {/* Controls moved outside the circle with more spacing */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 md:gap-10 mt-2 sm:mt-4 md:mt-2 translate-y-[-20%]">
          <button
            onClick={togglePlay}
            className="scale-75 sm:scale-90 md:scale-100"
            aria-label={isPlaying ? "Pause timer" : "Start timer"}
          >
            {isPlaying ? 
              <div className="transform scale-75 sm:scale-90 md:scale-100">
                <Pause /> 
              </div> : 
              <div className="transform scale-75 sm:scale-90 md:scale-100">
                <Play />
              </div>
            }
          </button>
          {elapsedTime !== 0 && (
            <button onClick={handleReset} className="text-[--secondary]">
              <RotateCcw size={24} className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12" />
            </button>
          )}
        </div>
        
        {/* Task display and add task button */}
        <div className="flex flex-col items-center justify-center mt-2 sm:mt-4 gap-4 w-full max-w-md">
          {selectedTask ? (
            <div className="w-full bg-[--background-2] rounded-lg p-4 flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-lg">Current Task:</h3>
                <button 
                  onClick={() => setSelectedTask(null)} 
                  className="text-[--secondary] hover:text-[--ternary]"
                >
                  <X size={18}/>
                </button>
              </div>
              <p className="text-xl font-bold">{selectedTask.name}</p>
              <div className="flex items-center gap-2 text-sm">
                <Clock size={16} className="text-[--secondary]" />
                <span>Time studied: {selectedTask.timeStudied} min</span>
              </div>
              <div className={`flex items-center gap-2 text-sm ${getPriorityColor(selectedTask.priority)}`}>
                <span className="capitalize">
                  {selectedTask.priority || 'No priority'}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-[--ternary] italic">No task selected</p>
          )}
          
          <button 
            onClick={() => {
              setIsPopUpActive(true);
            }} 
            className="bg-[--secondary] w-fit text-[--ternary] px-3 py-1 sm:px-4 sm:py-2 rounded flex items-center gap-2 sm:gap-3 text-sm sm:text-base"
          >
            {selectedTask ? 'Change task' : 'Add task'}<Plus size={14} className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
        
        {isPopUpActive && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-xl" >
            <div className="bg-[--ternary] rounded-lg shadow-lg w-full max-w-md max-h-[80vh] flex flex-col ">
              <div className="flex justify-between items-center p-4 border-b border-[--secondary]">
                <h2 className="text-xl font-bold">Select a Task</h2>
                <button 
                  onClick={() => setIsPopUpActive(false)}
                  className="text-[--secondary] hover:text-[--ternary] transition-colors"
                >
                  <X size={24}/>
                </button>
              </div>
              
              {/* Tabs */}
              <div className="flex border-b border-[--secondary] ">
                <button 
                  className={`flex-1 py-2 font-medium  ${activeTab === 'today' ? 'text-[--secondary] border-b-2 border-[--secondary]' : ' text-white'}`}
                  onClick={() => setActiveTab('today')}
                >
                  Today's Tasks
                </button>
                <button 
                  className={`flex-1 py-2 font-medium ${activeTab === 'all' ? 'text-[--secondary] border-b-2 border-[--secondary]' : ' text-white'}`}
                  onClick={() => setActiveTab('all')}
                >
                  All Tasks
                </button>
              </div>
              
              {/* Task list */}
              <div className="overflow-y-auto flex-1 p-2 ">
                {taskData[activeTab].length > 0 ? (
                  <ul className="space-y-2">
                    {taskData[activeTab]
                      .filter(task => !task.isCompleted)
                      .map(task => (
                        <li 
                          key={task.id}
                          className={`p-3 rounded-lg cursor-pointer transition-colors ${selectedTask?.id === task.id ? 'bg-[--secondary] bg-opacity-20' : 'hover:bg-[--background-2]'}`}
                          onClick={() => selectTask(task)}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="font-medium">{task.name}</p>
                              <div className="flex items-center gap-2 text-sm mt-1">
                                <Clock size={14} className="text-[--secondary]" />
                                <span>{task.estTime} min</span>
                                <span className={`ml-2 capitalize ${getPriorityColor(task.priority)}`}>
                                  {task.priority || 'No priority'}
                                </span>
                              </div>
                            </div>
                            {task.subtasks.length > 0 && (
                              <div className="flex items-center text-xs text-[--ternary]">
                                <CheckSquare size={14} className="mr-1" />
                                {task.subtasks.filter(st => st.isCompleted).length}/{task.subtasks.length}
                              </div>
                            )}
                          </div>
                        </li>
                      ))
                    }
                  </ul>
                ) : (
                  <div className="flex items-center justify-center h-40">
                    <p className=" text-white  italic ">No tasks available</p>
                  </div>
                )}
                
                {taskData[activeTab].length > 0 && 
                  taskData[activeTab].filter(task => !task.isCompleted).length === 0 && (
                  <div className="flex items-center justify-center h-40">
                    <p className="text-[--ternary] italic">No incomplete tasks available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}