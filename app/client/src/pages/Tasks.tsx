/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import TaskCard from "../components/task/TaskCard";
import { Plus } from "lucide-react";
import ProgressBar from "../components/progressBar/ProgressBar";
import { BASE_URL } from "@/utils/vars";
import axios from "axios";

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

function Tasks() {
  const [isActive, setIsActive] = useState<string>('All');
  const [taskData, setTaskData] = useState<TaskData>({
    today: [],
    all: []
  });

  const handleAddTask = () => {
    console.log('task added');
    // Implement task addition logic here
  }

  const list = ['Today', 'All'].map((item: string, i: number) => (
    <button 
      key={i} 
      onClick={() => {setIsActive(item)}} 
      className={`${isActive === item ? 'bg-[--secondary] text-[--ternary]' : 'bg-[--background-2] text-[--secondary]'} rounded px-3 py-1`}
    >
      {item}
    </button>
  ));

  useEffect(() => {
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
    }
    fetchTasks();
  }, []);

  // Function to update a task's completion status
  const updateTask = (taskId: string, isCompleted: boolean) => {
    setTaskData(prevData => {
      const newData = JSON.parse(JSON.stringify(prevData));
      ['today', 'all'].forEach(category => {
        const taskIndex = newData[category].findIndex((t: Task) => t.id === taskId);
        if (taskIndex !== -1) {
          newData[category][taskIndex].isCompleted = isCompleted;
          // If task is marked complete, mark all subtasks complete
          if (isCompleted) {
            newData[category][taskIndex].subtasks.forEach((subtask: Subtask) => {
              subtask.isCompleted = true;
            });
          }
        }
      });
      return newData;
    });
  };

  // Function to update a subtask's completion status
  const updateSubtask = (taskId: string, subtaskId: string, isCompleted: boolean) => {
    setTaskData(prevData => {
      const newData = JSON.parse(JSON.stringify(prevData));
      
      ['today', 'all'].forEach(category => {
        const taskIndex = newData[category].findIndex((task: Task) => task.id === taskId);
        if (taskIndex !== -1) {
          const subtaskIndex = newData[category][taskIndex].subtasks.findIndex(
            (subtask: Subtask) => subtask.id === subtaskId
          );
          
          if (subtaskIndex !== -1) {
            newData[category][taskIndex].subtasks[subtaskIndex].isCompleted = isCompleted;
            
            // Check if all subtasks are completed
            const allSubtasksCompleted = newData[category][taskIndex].subtasks.every(
              (subtask: Subtask) => subtask.isCompleted
            );
            
            // Update task completion status
            newData[category][taskIndex].isCompleted = allSubtasksCompleted;
          }
        }
      });
      
      return newData;
    });
  };

  // Display tasks based on active tab
  const displayTasks = isActive === 'Today' ? taskData.today : taskData.all;
  
  const taskList = displayTasks.map((task) => (
    <div key={task.id}>
      <TaskCard 
        item={task} 
        updateTask={updateTask}
        updateSubtask={updateSubtask}
      />
    </div>
  ));

  const totalTasks = displayTasks.length;
  const completedTasks = displayTasks.filter(task => task.isCompleted).length;
  const progress = totalTasks > 0 ? completedTasks / totalTasks : 0;

  return (
    <div className="w-full flex flex-col items-center py-6 md:py-10 gap-2 md:gap-4 px-4 md:px-0">
      <div className="flex w-full md:w-11/12 lg:w-5/6 xl:w-2/3 items-center justify-between">
        <div className="flex gap-2 md:gap-4">
          {list}
        </div>
        <button className="bg-[--secondary] text-[--ternary] rounded-full p-1" onClick={handleAddTask}>
          <Plus/>
        </button>
      </div>
      <div className="w-full md:w-11/12 lg:w-5/6 xl:w-2/3">
        <div className="sticky top-0 z-10">
          <ProgressBar progress={progress}/>
        </div>
        {taskList}
      </div>
    </div>
  )
}

export default Tasks;