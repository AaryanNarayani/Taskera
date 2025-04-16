import {  FolderPlus } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const ViewTask = () => {
    const navigate=useNavigate()
  return (
    <div>
       <div
        className="bg-[var(--background-2)] w-[140px] h-[109px] flex flex-col p-4 rounded-md cursor-pointer"
        onClick={()=>navigate('/tasks')} 
      >
        <div
          className="w-[32px] h-[32px] border-2 border-[var(--secondary)]
          rounded-[2px] mt-2 mr-2 flex items-center justify-center text-[var(--secondary)] p-1"
        >
          <FolderPlus />
        </div>
  
        <div className="mt-3 ">
          <span className="text-center w-[15vw]">View Tasks</span>
        </div>
      </div>
    </div>
  )
}

export default ViewTask
