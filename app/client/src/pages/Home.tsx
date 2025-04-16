/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Flag } from "lucide-react";
import CreateCourse from "@/components/DashboardBox/CreateCourse";
import CreateTask from "@/components/DashboardBox/CreateTask";
import ViewTask from "@/components/DashboardBox/ViewTask";
import Progress from "@/components/DashboardBox/Progress";
import axios from "axios";
import { BASE_URL } from "@/utils/vars";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setUser } from "@/Redux/user/UserSlice";
import Loader from "@/components/loader/Loader";

// interface HomeItem {
//   icon: React.ReactNode;
//   url: string;
//   title: string;
// }

const initialCourseTypes = ["EVS", "MCES", "FAFL", "RMIPR"];
const priorities = [
  { value: "High", label: "High", color: "text-red-600" },
  { value: "Medium", label: "Medium", color: "text-yellow-500" },
  { value: "Low", label: "Low", color: "text-green-500" },
];

function Home() {
  const [taskModalOpen, setTaskModalOpen] = useState<any>(false);
  const [courseModalOpen, setcourseModalOpen] = useState<any>(false);
  const [courseTypes, setCourseTypes] = useState(initialCourseTypes);
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null);
  const [isPriorityDropdownOpen, setIsPriorityDropdownOpen] = useState(false);
  const [remidersSelected, setRemidersSelected] = useState(false)
  const [loading, setLoading] = useState(true);


  const user = useAppSelector((state) => state.user)
  const dispatch = useAppDispatch();


  const token = localStorage.getItem('token');

  const handleCourseSubmit=() => { 
      //aaryan's logic 
      setcourseModalOpen(false)
   }
  const handleTaskSubmit=() => { 
      //aaryan's logic 
      setTaskModalOpen(false)
   }

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
            Authorization: `Bearer ${token}`
          }
        });
        dispatch(setUser(response.data.user));
      } catch (e : any) {
        console.error(e.message);
      }
    };

    fetchData();
  }, [token]);

   if (loading) {
    return (
      <>
        <Loader/>
        
      </>
    );
  }
  return (
    <div className="flex flex-col gap-3 px-5 py-4">
      <h1 className="text-[34px] ">Welcome back <span className="text-[var(--secondary)]">{user.username.toUpperCase()}</span>,</h1>
      <div className="flex gap-3">
        <CreateTask  handleChange={setTaskModalOpen}/>
        <CreateCourse  handleChange={setcourseModalOpen} />
        <ViewTask/>
        <Progress/>
      </div>

      {taskModalOpen && (
        <>
          <div onClick={()=>setTaskModalOpen(false)} className="h-[100vh] w-[100vw] absolute bg-black/50 top-0 left-0 flex items-center z-[10]">

            <div className="relative bg-[var(--background-2)] h-[40vh] w-[65vw] mx-auto rounded-md translate-y-[-10%] z-[20] px-8 py-6" onClick={(e) => e.stopPropagation()}>
              <div className="min-h-[20vh] mb-4 flex  justify-between ">
                <input
                  type="text"
                  className="text-xl outline-none text-white  w-[38vw] bg-[var(--background-2)] placeholder:text-gray-400 h-[8vh]"
                  placeholder="Enter your task title"
                  autoFocus
                />

                <div className="flex justify-end">
                  <button onClick={handleTaskSubmit} className="bg-[var(--secondary)]  px-3 py-1 rounded-[10px] text-center hover:bg-[var(--secondary)] w-[8vw] flex items-center text-black  h-[6vh] hover:bg-purple-400" >
                    <span className="text-black mx-auto font-bold "> Create </span>
                  </button>
                </div>
              </div>

              <div className="flex gap-3 items-center mb-4">
                <select
                  name="taskType"
                  id="taskType"
                  className="bg-[var(--background-2)] border border-[var(--secondary)] py-2 outline-none rounded-md px-2 w-[9vw] text-white"
                >
                  <option value="">Task Type</option>
                  <option value="Exam Preparation">Exam Preparation</option>
                  <option value="Assignment">Assignment</option>
                  <option value="Practice/Project">Practice/Project</option>
                  <option value="Reading">Reading</option>
                  <option value="Other">Other</option>
                </select>

                <select
                  className="bg-[var(--background-2)] border border-[var(--secondary)] py-2 outline-none rounded-md px-2 w-[9vw] text-white"
                >
                  <option value="">Course Type</option>
                  {courseTypes.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>

                <div className="relative">
                  <input
                    type="date"
                    placeholder="Deadline"
                    className="bg-white text-black py-2 px-3 rounded-md border cursor-pointer hover:bg-gray-100 w-[11vw]"
                  />
                </div>

                <div className={`${remidersSelected ? 'bg-[var(--secondary)]' : 'bg-white'} w-[11vw] 
                rounded-md flex justify-center items-center text-black py-2 px-1`}>
                  <input type="checkbox"
                    checked={remidersSelected}
                    onChange={() => setRemidersSelected(!remidersSelected)}
                    className="mr-2 bg-black" />
                  Set Reminders
                </div>

                <div className="relative w-[9vw]">
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
                    <div className="absolute bg-[var(--background-2)] border border-[var(--secondary)] mt-2 rounded-md w-full z-10">
                      {priorities.map((priority) => (
                        <div
                          key={priority.value}
                          className={`flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-gray-700 ${priority.color}`}
                          onClick={() => {
                            setSelectedPriority(priority.label);  
                            setIsPriorityDropdownOpen(false);
                          }}
                        >
                          <Flag /> {priority.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>



                <input type="text" className="py-2 rounded-md w-[8vw] text-black px-1" placeholder="Est. Time(hrs) " />


              </div>


            </div>
          </div>
        </>
      )}

      {courseModalOpen && (
        <>
          <div onClick={()=>setcourseModalOpen(false)} className="h-[100vh] w-[100vw] absolute bg-black/50 top-0 left-0 flex items-center z-[10]">

            <div className="relative bg-[var(--background-2)] h-[40vh] w-[65vw] mx-auto rounded-md translate-y-[-10%] z-[20] px-8 py-6" onClick={(e) => e.stopPropagation()}>
              <div className="min-h-[20vh] mb-4 flex  justify-between ">
                <div className="bg">
                <input
                  type="text"
                  className="text-[30px] outline-none  text-[--secondary] mb-3 w-[42vw] bg-[var(--background-2)] placeholder:text-gray-400 h-[8vh]"
                  placeholder="Enter your Course Name"
                  autoFocus
                />
                <input
                  type="text"
                  className="text-sm outline-none text-white  w-[42vw] bg-[var(--background-2)] placeholder:text-gray-400 h-[4vh]"
                  placeholder="Enter course description"
                  autoFocus
                />
                </div>

               
              </div>

              <div className="flex gap-3 items-center mb-4">
                <select
    
                  className="bg-[var(--background-2)] border border-[var(--secondary)] py-2 outline-none rounded-md px-2 w-[9vw] text-white"
                >
                  <option value="">Difficulty</option>
                  <option value="Exam Preparation">Hard</option>
                  <option value="Assignment">Moderate</option>
                  <option value="Reading">Easy</option>
                </select>

                <div className="flex justify-end">
                  <button 
                    onClick={handleCourseSubmit}
                  className="bg-[var(--secondary)]  px-3 py-1 rounded-[10px] text-center hover:bg-[var(--secondary)] w-[8vw] flex items-center text-black  h-[6vh] hover:bg-purple-400" >
                    <span className="text-black mx-auto font-bold "> Create </span>
                  </button>
                </div>


              </div>

          

            </div>
          </div>
        </>
      )}

      <div className="flex justify-center w-[90vw] mt-8">
        <div className="flex flex-col">
          <img src="minions.png" alt="" width="100px" className="m-auto" />
          <div className="w-[22vw] text-center">
            <h1 className="text-[29px] leading-tight">
              Create a new task to get started🌈
            </h1>
            <button
              className="bg-[var(--secondary)] text-black rounded-md px-3 py-2 mt-3"
              onClick={() => setTaskModalOpen(true)}
            >
              Create +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
