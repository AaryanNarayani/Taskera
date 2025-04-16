/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef } from 'react'
import EditHrsModal from '../components/modal/EditHrsModal';
import { MoveRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Dates() {
    const [dateData, setDateData] = useState([
        {day : "Monday" , hrs : 2},
        {day : "Tuesday" , hrs : 2},
        {day : "Wednesday" , hrs : 2},
        {day : "Thursday" , hrs : 2},
        {day : "Friday" , hrs : 2},
        {day : "Saturday" , hrs : 2},
        {day : "Sunday" , hrs : 2},
    ]);

    const [selectedDate, setSelectedDate] = useState({day : "", hrs : 0});
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

    const handleSubmit =() =>{
        navigate('/home');
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
                            selectedDate = {selectedDate}
                            handleChange={setDateData}
                            setToggleModal = {setToggleModal}
                        />
                    </div>
                </div>
            )}

            <div className='h-fit w-[50vw] bg-[--background-2] rounded-md flex flex-col items-center p-[40px]'>
                <p className='text-[40px] text-center pb-12'>
                    Tell us the number of <span className='text-[--secondary] text-[45px] font-bold'> Hours</span> you spare to accomplish your goals
                </p>
                <div className='flex w-full justify-center gap-8 flex-wrap'>
                    {dateData.map((value, index) => (
                        <div 
                            className='flex flex-col gap-4'
                            key={index}
                            onClick={() => handleEdit(value)}
                        >
                            <div className='h-[65px] w-[65px] bg-white text-center text-[--ternary] rounded-full border-[--secondary] border-[4px] flex items-center justify-center'>
                                {value.day.slice(0,3)}
                            </div>
                            <div className='text-center text-[--secondary]'>{value.hrs}hr</div>
                        </div>
                    ))}
                    <div className='bg-[var(--secondary)] h-fit  rounded-[100px] px-6 py-3  text-center mt-1 text-black ' onMouseOver={() => setIsHovered(true)} onMouseOut={() => setIsHovered(false)}>
                     <button onClick={handleSubmit} className='w-fit flex gap-2 items-center'>
                        Next
                            <MoveRight className={`mx-auto ${isHovered ? 'rotate-[-45deg]' : ''}  transition-all hover:cursor-pointer delay-50`} />
                            </button>
                            </div>
                </div>
            </div>
        </div>
    )
}

export default Dates