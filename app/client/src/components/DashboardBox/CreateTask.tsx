import { ChartNoAxesCombined, FolderPlus, Plus, FilePlus2, Flag, MoveRight } from "lucide-react";

const CreateTask = ({handleChange}:any) => {
  return (
    <div
    className="bg-[var(--background-2)] w-[140px] h-[109px] flex flex-col p-4 rounded-md cursor-pointer"
    onClick={()=>handleChange(true)} 
  >
    <div
      className="w-[32px] h-[32px] border-2 border-[var(--secondary)]
      rounded-[2px] mt-2 mr-2 flex items-center justify-center text-[var(--secondary)] p-1"
    >
      {<Plus />}
    </div>

    <div className="mt-3 ">
      <span className="text-center w-[15vw]">Create Task</span>
    </div>
  </div>
  )
}

export default CreateTask