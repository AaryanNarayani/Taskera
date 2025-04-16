/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef } from 'react'
import EditHrsModal from '../components/modal/EditHrsModal';
import { MoveRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '@/utils/vars';

function Dates() {
    const [dateData, setDateData] = useState([
        {day: "Monday", hrs: 2, startTime: "09:00", endTime: "11:00"},
        {day: "Tuesday", hrs: 2, startTime: "09:00", endTime: "11:00"},
        {day: "Wednesday", hrs: 2, startTime: "09:00", endTime: "11:00"},
        {day: "Thursday", hrs: 2, startTime: "09:00", endTime: "11:00"},
        {day: "Friday", hrs: 2, startTime: "09:00", endTime: "11:00"},
        {day: "Saturday", hrs: 2, startTime: "09:00", endTime: "11:00"},
        {day: "Sunday", hrs: 2, startTime: "09:00", endTime: "11:00"},
    ]);

    const [selectedDate, setSelectedDate] = useState({
        day: "", 
        hrs: 0,
        startTime: "09:00",
        endTime: "11:00"
    });
    
    const [toggleModal, setToggleModal] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const modalRef = useRef(null);

    const navigate = useNavigate();

    const handleEdit = (value: any) => {
        setSelectedDate(value);
        setToggleModal(true);
    }    

    const closeModal = () => {
        setToggleModal(false);
    }

    const handleSubmit = async () => {
        try {
            const response = await axios.post(
                `${BASE_URL}/api/v1/tasks/availability`, 
                { dateData }, 
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log(response.data);
            navigate('/home');
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const formatTimeRange = (startTime: string, endTime: string) => {
        return `${startTime} - ${endTime}`;
    }

    return (
        <div className='h-[calc(100vh-60px)] w-[100vw] flex justify-center items-center'>
            {toggleModal && (
                <div className='fixed inset-0 bg-black/50 backdrop-blur-sm z-10 flex items-center justify-center'>
                    <div ref={modalRef} className='absolute left-[39vw] top-[30vh]'>
                        <EditHrsModal 
                            handleEdit={closeModal} 
                            selectedDay={selectedDate.day} 
                            selectedHrs={selectedDate.hrs}
                            selectedDate={selectedDate}
                            handleChange={setDateData}
                            setToggleModal={setToggleModal}
                        />
                    </div>
                </div>
            )}

            <div className='h-fit w-fit bg-[--background-2] rounded-md flex flex-col items-center p-[40px]'>
                <p className='text-[30px] text-center pb-12'>
                    Tell us the number of <span className='text-[--secondary] text-[45px] font-bold'> Hours</span> you spare to accomplish your goals
                </p>
                <div className='flex w-full justify-center gap-8 flex-wrap'>
                    {dateData.map((value, index) => (
                        <div 
                            className='flex flex-col gap-4 hover:scale-105 transition-transform cursor-pointer'
                            key={index}
                            onClick={() => handleEdit(value)}
                        >
                            <div className='h-[65px] w-[65px] bg-white text-center text-[--ternary] rounded-full border-[--secondary] border-[4px] flex items-center justify-center'>
                                {value.day.slice(0,3)}
                            </div>
                            <div className='text-center'>
                                <div className='text-[--secondary] font-medium'>{value.hrs}hr</div>
                                <div className='text-xs text-gray-400 mt-1'>
                                    {formatTimeRange(value.startTime, value.endTime)}
                                </div>
                            </div>
                        </div>
                    ))}
                    
                </div>
                <div className='bg-[var(--secondary)] h-fit rounded-[100px] px-6 py-3 text-center mt-10 text-black' 
                        onMouseOver={() => setIsHovered(true)} 
                        onMouseOut={() => setIsHovered(false)}
                    >
                        <button onClick={handleSubmit} className='w-fit flex gap-2 items-center'>
                            Next
                            <MoveRight className={`mx-auto ${isHovered ? 'rotate-[-45deg]' : ''} transition-all hover:cursor-pointer delay-50`} />
                        </button>
                    </div>
            </div>
        </div>
    );
}

export default Dates;