import { ChartNoAxesCombined } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const Progress = () => {
    const navigate=useNavigate()
  return (
    <div
    className="bg-[var(--background-2)] w-[140px] h-[109px] flex flex-col p-4 rounded-md cursor-pointer"
    onClick={()=>navigate('/analytics')} 

  >
    <div
      className="w-[32px] h-[32px] border-2 border-[var(--secondary)]
      rounded-[2px] mt-2 mr-2 flex items-center justify-center text-[var(--secondary)] p-1"
    >
       <ChartNoAxesCombined />
    </div>

    <div className="mt-3 ">
      <span className="text-center w-[15vw]">Your Progress</span>
    </div>
  </div>
  )
}

export default Progress