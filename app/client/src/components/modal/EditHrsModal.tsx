/* eslint-disable @typescript-eslint/no-explicit-any */
import { X } from 'lucide-react';
import { useState } from 'react';

function EditHrsModal({handleEdit, selectedDate, handleChange , setToggleModal}: any) {
    const [input, setInput] = useState(selectedDate?.hrs || '');

    const handleSubmit = () => {
        handleChange((prevData: any[]) => 
            prevData.map(item => 
                item.day === selectedDate.day 
                    ? {...item, hrs: Number(input)} 
                    : item
            )
        );
        handleEdit();
    }

    const handleInputChange = (e : any) => {
        if(e.target.value <= 14 && e.target.value >= 0){
            setInput(e.target.value);
        }
    }

    return (
        <div className='h-fit w-[400px] bg-[--background-2] absolute rounded-md flex flex-col items-center p-10'>
            <div className='w-full flex justify-end' onClick={() => {setToggleModal(false)}}><X className='text-white'/></div>
            <h1 className='text-[50px]'>{selectedDate?.day}</h1>
            <p className='text-[15px]'>Time alloted:</p>
            <div className='flex items-end gap-[4px] pt-2 relative'>
            <input 
                type="number"
                value={input}
                className='text-[--secondary] h-[40px] w-[40px] text-center rounded bg-[--ternary]'
                onChange={(e) => handleInputChange(e)}
                max={14}
                min={0}
            />
            <p className='text-[12px] absolute left-11'>hrs</p>
            </div>
            <button onClick={handleSubmit} className='mt-5 h-fit w-fit px-4 py-2 bg-[--secondary] rounded-lg text-[--ternary]'>Submit</button>        
        </div>
    )
}

export default EditHrsModal