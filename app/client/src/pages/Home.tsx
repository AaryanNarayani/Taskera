/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Flag, Plus, Trash2 } from "lucide-react";
import CreateCourse from "@/components/DashboardBox/CreateCourse";
import CreateTask from "@/components/DashboardBox/CreateTask";
import ViewTask from "@/components/DashboardBox/ViewTask";
import Progress from "@/components/DashboardBox/Progress";
import axios from "axios";
import { BASE_URL } from "@/utils/vars";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setUser } from "@/Redux/user/UserSlice";
import Loader from "@/components/loader/Loader";

interface Course {
  id: string;
  userId: string;
  name: string;
  description: string;
  difficulty: number;
  tasks: any[];
}

const priorities = [
  { value: "High", label: "High", color: "text-red-600" },
  { value: "Medium", label: "Medium", color: "text-yellow-500" },
  { value: "Low", label: "Low", color: "text-green-500" },
];

const difficultyOptions = [
  { value: "Hard", label: "Hard", difficultyValue: 3 },
  { value: "Moderate", label: "Moderate", difficultyValue: 2 },
  { value: "Easy", label: "Easy", difficultyValue: 1 },
];

function Home() {
  const [taskModalOpen, setTaskModalOpen] = useState<boolean>(false);
  const [courseModalOpen, setCourseModalOpen] = useState<boolean>(false);
  const [courseTypes, setCourseTypes] = useState<Course[]>([]);
  const [courseData, setCourseData] = useState({
    name: "",
    description: "",
    difficulty: 0,
  });
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null);
  const [isPriorityDropdownOpen, setIsPriorityDropdownOpen] = useState(false);
  const [remindersSelected, setRemindersSelected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [taskTitle, setTaskTitle] = useState("");
  const [taskType, setTaskType] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [deadline, setDeadline] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("");

  const [formattedDate, setFormattedDate] = useState("");
  
  // Milestones as string array
  const [milestones, setMilestones] = useState<string[]>([]);
  const [showMilestones, setShowMilestones] = useState(false);
  const [isGeneratingMilestones, setIsGeneratingMilestones] = useState(false);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    setFormattedDate(`${year}-${month}-${day}`);
    setDeadline(e.target.value);
  };

  const user = useAppSelector((state: any) => state.user);
  const dispatch = useAppDispatch();
  const token = localStorage.getItem("token");

  // Milestone handling functions
  const addMilestone = () => {
    setMilestones([...milestones, ""]);
  };

  const updateMilestone = (index: number, value: string) => {
    const updatedMilestones = [...milestones];
    updatedMilestones[index] = value;
    setMilestones(updatedMilestones);
  };

  const removeMilestone = (index: number) => {
    const updatedMilestones = milestones.filter((_, i) => i !== index);
    setMilestones(updatedMilestones);
  };

  // Function to generate milestones using Groq API
  const generateMilestones = async () => {
    if (!taskTitle.trim()) {
      alert("Please enter a task title first");
      return;
    }
    
    setIsGeneratingMilestones(true);
    
    try {
      // Client-side Groq API call
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "user",
              content: `Generate 3-4 specific milestones for completing this task: "${taskTitle}". 
              Return only the milestone texts as a JSON object with a single "milestones" key containing an array of strings.`
            }
          ],
          response_format: { type: "json_object" }
        })
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      const generatedMilestones = JSON.parse(data.choices[0].message.content).milestones;
      
      if (Array.isArray(generatedMilestones)) {
        setMilestones(generatedMilestones);
        setShowMilestones(true);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error generating milestones:", error);
      alert("Failed to generate milestones. Please try again.");
    } finally {
      setIsGeneratingMilestones(false);
    }
  };

  const handleCourseDataChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setCourseData({
      ...courseData,
      [name]: name === "difficulty" ? parseInt(value) : value,
    });
  };

  const handleCourseSubmit = async () => {
    try {
      setSubmitLoading(true);
      const response = await axios.post(
        `${BASE_URL}/api/v1/general/courses`,
        courseData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Course created:", response.data);
      setCourseData({
        name: "",
        description: "",
        difficulty: 0,
      });
      setCourseModalOpen(false);

      fetchCourses();
    } catch (error: any) {
      console.error("Error creating course:", error.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleTaskSubmit = async () => {
    try {
      setSubmitLoading(true);
      const taskData = {
        name: taskTitle,
        type: taskType,
        courseId: selectedCourseId,
        deadline: formattedDate,
        priority: selectedPriority,
        estTime: parseFloat(estimatedTime),
        subtasks: milestones.filter(m => m.trim() !== ''),
      };

      console.log(taskData);

      const response = await axios.post(
        `${BASE_URL}/api/v1/tasks/create`,
        taskData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Task created:", response.data);
      setTaskTitle("");
      setTaskType("");
      setSelectedCourse("");
      setDeadline("");
      setSelectedPriority(null);
      setEstimatedTime("");
      setRemindersSelected(false);
      setMilestones([]);
      setShowMilestones(false);
      setTaskModalOpen(false);
    } catch (error: any) {
      console.error("Error creating task:", error.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/general/courses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCourseTypes(response.data);
    } catch (e: any) {
      console.error(e.message);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/v1/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        dispatch(setUser(response.data.user));
      } catch (e: any) {
        console.error(e.message);
      }
    };

    fetchData();
    fetchCourses();
  }, [token, dispatch]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col gap-3 px-3 sm:px-5 md:px-6 py-4 min-h-screen w-full overflow-x-hidden">
      <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl">
        Welcome back{" "}
        <span className="text-[var(--secondary)]">
          {user.username?.toUpperCase()}
        </span>
        ,
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
          <img
            src="minions.png"
            alt="Minions"
            className="w-16 sm:w-20 md:w-24"
          />
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

      {/* Task Modal */}
      {taskModalOpen && (
        <div
          onClick={() => setTaskModalOpen(false)}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-10 p-3"
        >
          <div
            className="relative bg-[var(--background-2)] w-full max-w-4xl rounded-md p-3 sm:p-5 z-20  overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between">
              <h1 className="text-3xl mb-3 font-regular">Create Task</h1>
              <button
                onClick={handleTaskSubmit}
                className="bg-[var(--secondary)] px-3 py-2 rounded-lg text-black font-bold sm:w-28 hover:bg-purple-400 flex-shrink-0"
                disabled={submitLoading}
              >
                {submitLoading ? "Creating..." : "Create"}
              </button>
            </div>
            <div className="flex flex-col sm:flex-row justify-between mb-4 gap-3">
              <input
                type="text"
                className="text-base sm:text-lg md:text-xl outline-none text-white w-full bg-[var(--background-2)] placeholder:text-gray-400 py-2"
                placeholder="Enter your task title"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                autoFocus
              />
            </div>
            
            {/* Modified: Milestones Section with AI Generation */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <button
                  onClick={() => setShowMilestones(!showMilestones)}
                  className="flex items-center gap-2 text-[var(--secondary)] hover:text-purple-400 transition-colors"
                >
                  <span className="flex gap-2 items-center">
                    {showMilestones ? (
                      <>Hide Milestones <ChevronUp /></>
                    ) : (
                      <>Show Milestones <ChevronDown /></>
                    )}
                  </span>
                </button>
                
                <button
                  onClick={generateMilestones}
                  disabled={isGeneratingMilestones || !taskTitle.trim()}
                  className="flex items-center gap-2 bg-[var(--secondary)] text-black px-3 py-1 rounded-md hover:bg-purple-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isGeneratingMilestones ? (
                    "Generating..."
                  ) : (
                    <>Generate Milestones</>
                  )}
                </button>
              </div>
              
              {showMilestones && (
                <div className="rounded-md mb-4 border border-white/35 p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-medium">Milestones</h3>
                    <button
                      onClick={addMilestone}
                      className="flex items-center gap-1 bg-[var(--secondary)] text-black px-2 py-1 rounded-md hover:bg-purple-400 transition-colors"
                    >
                      <Plus size={16} /> Add Milestone
                    </button>
                  </div>
                  
                  {milestones.length === 0 ? (
                    <p className="text-gray-400 italic">No milestones added yet. Click the button above to add one or use the "Generate Milestones" button.</p>
                  ) : (
                    <div className="space-y-2">
                      {milestones.map((milestone, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <button
                            onClick={() => removeMilestone(index)}
                            className="text-red-500 hover:text-red-400"
                          >
                            <Trash2 size={18} />
                          </button>
                          <div className="h-6 flex items-center justify-center text-md">
                            <span className="text-[var(--secondary)] font-bold">Milestone {index + 1}</span>&nbsp;: 
                          </div>
                          <input
                            type="text"
                            className="flex-grow bg-[var(--background-2)] rounded-md px-2 py-1 outline-none text-white"
                            placeholder={`Edit Milestone ${index + 1}`}
                            value={milestone}
                            onChange={(e) => updateMilestone(index, e.target.value)}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              <select
                name="taskType"
                id="taskType"
                className="bg-[var(--background-2)] border border-[var(--secondary)] py-2 rounded-md px-2 w-full text-white"
                value={taskType}
                onChange={(e) => setTaskType(e.target.value)}
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
                value={selectedCourse}
                onChange={(e) => {
                  setSelectedCourse(e.target.value);
                  setSelectedCourseId(
                    courseTypes.find((course) => course.name === e.target.value)
                      ?.id || ""
                  );
                }}
              >
                <option value="">Course Type</option>
                {courseTypes.map((course) => (
                  <option key={course.id} value={course.name}>
                    {course.name}
                  </option>
                ))}
              </select>

              <input
                type="date"
                placeholder="Deadline"
                className="bg-white text-black py-2 px-3 rounded-md border cursor-pointer hover:bg-gray-100 w-full"
                value={deadline}
                onChange={(e) => handleDateChange(e)}
              />

              <div
                className={`${
                  remindersSelected ? "bg-[var(--secondary)]" : "bg-white"
                } w-full rounded-md flex justify-center items-center text-black py-2 px-2`}
              >
                <input
                  type="checkbox"
                  checked={remindersSelected}
                  onChange={() => setRemindersSelected(!remindersSelected)}
                  className="mr-2"
                />
                Set Reminders
              </div>

              <div className="relative w-full">
                <div
                  className="bg-[var(--background-2)] border border-[var(--secondary)] py-2 px-2 rounded-md text-white cursor-pointer flex justify-between items-center"
                  onClick={() =>
                    setIsPriorityDropdownOpen(!isPriorityDropdownOpen)
                  }
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
                value={estimatedTime}
                onChange={(e) => setEstimatedTime(e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Course Modal */}
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
              <h1 className="text-3xl mb-3 font-regular">Create a Course</h1>
              <input
                type="text"
                name="name"
                className="text-lg sm:text-xl md:text-1xl outline-none text-[var(--secondary)] mb-3 w-full bg-[var(--background-2)] placeholder:text-gray-400 py-2"
                placeholder="Enter your Course Name"
                value={courseData.name}
                onChange={handleCourseDataChange}
                autoFocus
              />
              <input
                type="text"
                name="description"
                className="text-sm outline-none text-white w-full bg-[var(--background-2)] placeholder:text-gray-400 py-1"
                placeholder="Enter course description"
                value={courseData.description}
                onChange={handleCourseDataChange}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <select
                name="difficulty"
                className="bg-[var(--background-2)] border border-[var(--secondary)] py-2 rounded-md px-2 w-full text-white"
                value={courseData.difficulty}
                onChange={handleCourseDataChange}
              >
                <option value={0}>Difficulty</option>
                {difficultyOptions.map((option) => (
                  <option key={option.value} value={option.difficultyValue}>
                    {option.label}
                  </option>
                ))}
              </select>

              <button
                onClick={handleCourseSubmit}
                disabled={submitLoading || !courseData.name}
                className="bg-[var(--secondary)] px-4 py-2 rounded-lg text-black font-bold w-full sm:w-auto sm:min-w-28 hover:bg-[var(--ternary)] hover:text-white transition ease-in-out duration-300 mt-3 sm:mt-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitLoading ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;