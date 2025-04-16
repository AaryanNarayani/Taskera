import React from 'react';
import { Pen, Pencil } from 'lucide-react';
import { Flag } from "lucide-react";
const Profile = () => {
    // Mock data for user and courses
    const user = {
        name: "AARYAN",
        email: "aaryannarayani@gmail.com",
        avatar: "/avatar.jpg" // Placeholder for avatar image
    };

    const courses = [
        { id: 1, name: "RMPIR", progress: 30 },
        { id: 2, name: "STPM", progress: 45 },
        { id: 3, name: "EVS", progress: 60 },
        { id: 4, name: "FAFL", progress: 75 }
    ];

    // Mock data for tasks history
    const tasks = [
        { id: 1, title: 'EVS OBA ASSIGNMENT', completionDate: '17/10/24' },
        { id: 2, title: 'EVS OBA ASSIGNMENT', completionDate: '17/10/24' },
        { id: 3, title: 'EVS OBA ASSIGNMENT', completionDate: '17/10/24' },
        { id: 4, title: 'EVS OBA ASSIGNMENT', completionDate: '17/10/24' }
    ];

    return (
        <div className='flex flex-col'>
            <div className="flex flex-col items-center h-[90%] w-[80%] mx-auto mt-4 rounded-lg bg-[--background-2] p-4">
                {/* User Profile Header */}

                <div className="flex items-center gap-4 mb-8 w-full">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-sky-200 ml-12 mt-4">
                        {/* Placeholder avatar */}
                        <img
                            src="https://lh3.googleusercontent.com/a/ACg8ocIRTahCqY53VGp6AfWVn0Jp5K1Xv_03I_De5n_KKHTJwIF3VpM=s96-c"
                            alt="User avatar"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex flex-col ml-4">
                        <div className='flex gap-5 '>
                            <h2 className="text-[46px] font-semibold text-white">{user.name}</h2>
                            <div className='flex items-center justify-center  cursor-pointer ' >
                                <div className=" bg-[--secondary] h-[50px] w-[50px] rounded-full flex justify-center items-center" >
                                    <Pencil color='black' />
                                </div>
                            </div>
                        </div>
                        <p className="text-md  ml-[10px]">{user.email}</p>
                    </div>
                </div>

                {/* Enrolled Courses Section */}
                <div className="w-[94%] mb-6 ">
                    <h3 className="text-[26px] font-bold text-white mb-4">Enrolled courses</h3>

                    <div className=" flex  flex-wrap  gap-4  w-[96%] mx-auto ">
                        {courses.map((course) => (
                            <div
                                key={course.id}
                                className="bg-[--ternary] p-4 rounded-lg h-[140px] w-[400px]"
                            >
                                <h4 className="font-medium text-[24px] mb-1 text-[--secondary]" >{course.name}</h4>
                                <div className='flex justify-start items-center gap-3 '>
                                    <p className="text-sm text-gray-400 mb-2">Course Progress</p>

                                    {/* Progress Bar */}
                                    <div className="w-[60%] bg-slate-700 h-[6px] mb-3 rounded-full">
                                        <div
                                            className="bg-[--secondary] h-full rounded-full"
                                            style={{ width: `${course.progress}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Insights Button */}
                                <button className="bg-[--secondary]  bg-opacity-20 text-black py-1 px-4 rounded-md text-sm font-semibold hover:bg-opacity-30 transition duration-300">
                                    View Tasks
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

              
                {/* Tasks History Section */}
                
            </div>


            <div className="w-[80%] mx-auto mt-6 bg-[--background-2] p-4 rounded-lg ">
                    <h3 className="text-[26px] font-bold text-white mb-4">Tasks History</h3>
                    
                    <div className="flex flex-wrap gap-4 w-[96%] mx-auto">
                        {tasks.map(task => (
                            <div 
                                key={task.id} 
                                className="bg-[--ternary] p-4 rounded-lg relative h-[120px] w-[39%]"
                            >
                                <h4 className="text-[--secondary] text-[26px] font-medium">{task.title}</h4>
                                <p className="ml-2 text-sm">
                                    Completion Date : {task.completionDate}
                                </p>
                                <div className="absolute bottom-4 left-4 translate-y-[-40%]">
                                    <div className="w-4 h-4 ml-2 "><Flag fill='#A7C957' color='#A7C957'/></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>  
        </div>
    );
};

export default Profile;