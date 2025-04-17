import { useState, useEffect } from "react";

interface SubtaskProps {
  subtask: {
    id: string;
    name: string;
    isCompleted: boolean;
  };
  taskId: string;
  updateSubtask: (taskId: string, subtaskId: string, isCompleted: boolean) => void;
}

function SubTask({ subtask, taskId, updateSubtask }: SubtaskProps) {
  const [isCompleted, setIsCompleted] = useState(subtask.isCompleted);

  // Keep local state in sync with props
  useEffect(() => {
    setIsCompleted(subtask.isCompleted);
  }, [subtask.isCompleted]);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.checked;
    setIsCompleted(newValue);
    updateSubtask(taskId, subtask.id, newValue);
  };

  return (
    <div className="flex gap-2 items-center py-1">
      <input 
        type="checkbox" 
        checked={isCompleted}
        onChange={handleCheckboxChange}
        className="w-4 h-4 cursor-pointer"
      />
      <p className={`${isCompleted ? 'line-through text-gray-400' : ''}`}>
        {subtask.name}
      </p>
    </div>
  );
}

export default SubTask;