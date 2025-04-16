/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import TimePicker from "../time/TimePicker";
import { X } from "lucide-react";

function EditHrsModal({handleEdit, selectedDate, handleChange, setToggleModal}: any) {
    const [input, setInput] = useState(selectedDate?.hrs || '');
    const [startTime, setStartTime] = useState('09:00');
    const [endTime, setEndTime] = useState('17:00');
    
    useEffect(() => {
      if (selectedDate?.startTime) setStartTime(selectedDate.startTime);
      if (selectedDate?.endTime) setEndTime(selectedDate.endTime);
    }, [selectedDate]);
  
    const handleSubmit = () => {
      handleChange((prevData: any[]) =>
        prevData.map(item =>
          item.day === selectedDate.day
            ? {...item, hrs: Number(input), startTime, endTime}
            : item
        )
      );
      handleEdit();
    }
  
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(e.target.value);
      if (!isNaN(value) && value <= 14 && value >= 0) {
        setInput(e.target.value);
      }
    }
  
    const handleTimeChange = () => {

      if (startTime && endTime) {
        const [startHour, startMinute] = startTime.split(':').map(Number);
        const [endHour, endMinute] = endTime.split(':').map(Number);
        
        let hours = endHour - startHour;
        let minutes = endMinute - startMinute;
        
        if (minutes < 0) {
          hours -= 1;
          minutes += 60;
        }
        
        const totalHours = hours + (minutes / 60);
        setInput(totalHours.toFixed(2));
      }
    }
  
    useEffect(() => {
      handleTimeChange();
    }, [startTime, endTime]);
  
    return (
      <div className="h-fit w-[400px] bg-gray-800 absolute rounded-md flex flex-col items-center p-10 shadow-lg">
        <div className="w-full flex justify-end">
          <button onClick={() => setToggleModal(false)} className="text-gray-300 hover:text-white">
            <X />
          </button>
        </div>
        
        <h1 className="text-4xl font-bold mb-4 text-white">{selectedDate?.day}</h1>
        
        <div className="w-full space-y-4">
          <div className="flex items-end gap-2 pt-2 relative">
            <div className="flex-1">
              <p className="text-sm mb-1 text-gray-300">Hours allocated:</p>
              <div className="flex items-center">
                <input
                  type="number"
                  value={input}
                  className="text-white h-10 w-20 text-center rounded bg-gray-700 border border-gray-600"
                  onChange={handleInputChange}
                  max={14}
                  min={0}
                  step="0.25"
                />
                <span className="ml-2 text-gray-300">hrs</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <TimePicker 
              label="Start Time" 
              value={startTime} 
              onChange={setStartTime} 
            />
            <TimePicker 
              label="End Time" 
              value={endTime} 
              onChange={setEndTime} 
            />
          </div>
          
          <button 
            onClick={handleSubmit} 
            className="w-full mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    );
  }
  
  export default EditHrsModal;