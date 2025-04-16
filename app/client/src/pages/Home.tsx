import { useEffect, useState } from "react";
import { Flag } from "lucide-react";
import CreateCourse from "@/components/DashboardBox/CreateCourse";
import CreateTask from "@/components/DashboardBox/CreateTask";
import ViewTask from "@/components/DashboardBox/ViewTask";
import Progress from "@/components/DashboardBox/Progress";
import axios from "axios";
import { BASE_URL } from "@/utils/vars";

const initialCourseTypes = ["EVS", "MCES", "FAFL", "RMIPR"];
const priorities = [
  { value: "High", label: "High", color: "text-red-600" },
  { value: "Medium", label: "Medium", color: "text-yellow-500" },
  { value: "Low", label: "Low", color: "text-green-500" },
];

function Home() {
  const [taskModalOpen, setTaskModalOpen] = useState<any>(false);
  const [courseModalOpen, setCourseModalOpen] = useState<any>(false);
  const [courseTypes, setCourseTypes] = useState(initialCourseTypes);
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null);
  const [isPriorityDropdownOpen, setIsPriorityDropdownOpen] = useState(false);
  const [remidersSelected, setRemidersSelected] = useState(false);
  const token = localStorage.getItem('token');

  const handleCourseSubmit = () => { 
    setCourseModalOpen(false);
  };
  
  const handleTaskSubmit = () => { 
    setTaskModalOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`${BASE_URL}/api/v1/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}` 
        }
      });
      console.log(response.data);
    } 

    fetchData();
  }, [token]);

  return (
    <div className="flex flex-col gap-3 px-3 sm:px-5 md:px-6 py-4 min-h-screen w-full overflow-x-hidden">
      <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl">
        Welcome back <span className="text-[var(--secondary)]">Aaryan</span>,
      </h1>
      
      {/* Dashboard boxes - now with 2x2 grid on mobile view */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 w-full lg:w-11/12 xl:w-6/12 2xl:w-9/12">
        <CreateTask handleChange={setTaskModalOpen} />
        <CreateCourse handleChange={setCourseModalOpen} />
        <ViewTask />
        <Progress />
      </div>

      {/* Get started component - placed below the dashboard boxes */}
      <div className="flex justify-center mt-8 w-full">
        <div className="flex flex-col items-center px-4">
          <img src="minions.png" alt="Minions" className="w-16 sm:w-20 md:w-24" />
          <div className="text-center">
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl leading-tight">
              Create a new task to get started🌈
            </h1>
            <button
              className="bg-[var(--secondary)] text-black rounded-md px-3 py-2 mt-3 text-sm sm:text-base"
              onClick={() => setTaskModalOpen(true)}
            >
              Create +
            </button>
          </div>
        </div>
      </div>

      {taskModalOpen && (
        <div 
          onClick={() => setTaskModalOpen(false)} 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-10 p-3"
        >
          <div 
            className="relative bg-[var(--background-2)] w-full max-w-4xl rounded-md p-3 sm:p-5 z-20" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col sm:flex-row justify-between mb-4 gap-3">
              <input
                type="text"
                className="text-base sm:text-lg md:text-xl outline-none text-white w-full bg-[var(--background-2)] placeholder:text-gray-400 py-2"
                placeholder="Enter your task title"
                autoFocus
              />
              <button 
                onClick={handleTaskSubmit} 
                className="bg-[var(--secondary)] px-3 py-2 rounded-lg text-black font-bold sm:w-28 hover:bg-purple-400 flex-shrink-0"
              >
                Create
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              <select
                name="taskType"
                id="taskType"
                className="bg-[var(--background-2)] border border-[var(--secondary)] py-2 rounded-md px-2 w-full text-white"
              >
                <option value="">Task Type</option>
                <option value="Exam Preparation">Exam Preparation</option>
                <option value="Assignment">Assignment</option>
                <option value="Practice/Project">Practice/Project</option>
                <option value="Reading">Reading</option>
                <option value="Other">Other</option>
              </select>

              <select
                className="bg-[var(--background-2)] border border-[var(--secondary)] py-2 rounded-md px-2 w-full text-white"
              >
                <option value="">Course Type</option>
                {courseTypes.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              <input
                type="date"
                placeholder="Deadline"
                className="bg-white text-black py-2 px-3 rounded-md border cursor-pointer hover:bg-gray-100 w-full"
              />

              <div className={`${
                remidersSelected ? 'bg-[var(--secondary)]' : 'bg-white'
              } w-full rounded-md flex justify-center items-center text-black py-2 px-2`}>
                <input 
                  type="checkbox"
                  checked={remidersSelected}
                  onChange={() => setRemidersSelected(!remidersSelected)}
                  className="mr-2"
                />
                Set Reminders
              </div>

              <div className="relative w-full">
                <div
                  className="bg-[var(--background-2)] border border-[var(--secondary)] py-2 px-2 rounded-md text-white cursor-pointer flex justify-between items-center"
                  onClick={() => setIsPriorityDropdownOpen(!isPriorityDropdownOpen)}
                >
                  {selectedPriority ? (
                    <span>{selectedPriority}</span>
                  ) : (
                    <span>Difficulty</span>
                  )}
                  <span>▼</span>
                </div>
                {isPriorityDropdownOpen && (
                  <div className="absolute bg-[var(--background-2)] border border-[var(--secondary)] mt-2 rounded-md w-full z-30">
                    {priorities.map((priority) => (
                      <div
                        key={priority.value}
                        className={`flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-gray-700 ${priority.color}`}
                        onClick={() => {
                          setSelectedPriority(priority.label);  
                          setIsPriorityDropdownOpen(false);
                        }}
                      >
                        <Flag size={16} /> {priority.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <input 
                type="text" 
                className="py-2 rounded-md w-full text-black px-2" 
                placeholder="Est. Time(hrs)" 
              />
            </div>
          </div>
        </div>
      )}

      {courseModalOpen && (
        <div 
          onClick={() => setCourseModalOpen(false)} 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-10 p-3"
        >
          <div 
            className="relative bg-[var(--background-2)] w-full max-w-4xl rounded-md p-3 sm:p-5 z-20" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col mb-4">
              <input
                type="text"
                className="text-lg sm:text-xl md:text-2xl outline-none text-[var(--secondary)] mb-3 w-full bg-[var(--background-2)] placeholder:text-gray-400 py-2"
                placeholder="Enter your Course Name"
                autoFocus
              />
              <input
                type="text"
                className="text-sm outline-none text-white w-full bg-[var(--background-2)] placeholder:text-gray-400 py-1"
                placeholder="Enter course description"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <select
                className="bg-[var(--background-2)] border border-[var(--secondary)] py-2 rounded-md px-2 w-full text-white"
              >
                <option value="">Difficulty</option>
                <option value="Hard">Hard</option>
                <option value="Moderate">Moderate</option>
                <option value="Easy">Easy</option>
              </select>

              <button 
                onClick={handleCourseSubmit}
                className="bg-[var(--secondary)] px-4 py-2 rounded-lg text-black font-bold w-full sm:w-auto sm:min-w-28 hover:bg-purple-400 mt-3 sm:mt-0"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;