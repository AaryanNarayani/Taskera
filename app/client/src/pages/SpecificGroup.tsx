import React, { useState } from 'react';

const SpecificGroup = () => {
    const [tasks, setTasks] = useState([
        { id: 1, name: "Login Page", description: "Develop Login Page", assignedTo: "Ziyad", status: "Completed" },
        { id: 2, name: "Login Page", description: "Develop Login Page", assignedTo: "Ziyad", status: "Completed" },
        { id: 3, name: "Login Page", description: "Develop Login Page", assignedTo: "Ziyad", status: "Completed" },
        { id: 4, name: "Login Page", description: "Develop Login Page", assignedTo: "Ziyad", status: "Completed" }
    ]);

    return (
        <div className="min-h-screen  p-8 w-full">
            <h1 className="text-2xl font-semibold text-white mb-6">Ockaknight</h1>
            <div className="max-w-4xl mx-auto">

                {/* Tab Navigation */}
                <div className="flex justify-center mb-6">
                    <div className="bg-gray-800 rounded-md inline-flex px-2 py-[5px]" >
                        <button className="px-4 py-1 bg-[--navbar]  rounded-lg text-sm text-white">Tasks</button>
                        <button className="px-4 py-1 text-gray-300 text-sm">Analytics</button>
                        <button className="px-4 py-1 text-gray-300 text-sm">Details</button>
                    </div>
                </div>

                {/* Task Table */}
                <div className="bg-indigo-100 bg-opacity-10 rounded- overflow-hidden">
                    {/* Table Header */}
                    <div className="grid grid-cols-4 text-sm py-3 px-4 bg-[--secondary] bg-opacity-20 rounded-md">
                        <div className="text-black">Task Name</div>
                        <div className="text-black">Description</div>
                        <div className="text-black">Assigned To</div>
                        <div className="text-black">Status</div>
                    </div>

                    {/* Table Body */}
                    {tasks.map((task) => (
                        <div
                            key={task.id}
                            className="grid grid-cols-4 text-sm py-3 px-4 border border-[--secondary] bg-gray-900 rounded-md"
                        >
                            <div className="text-indigo-300">{task.name}</div>
                            <div className="text-gray-300">{task.description}</div>
                            <div className="text-gray-300">{task.assignedTo}</div>
                            <div>
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    <span className="w-2 h-2 mr-1 bg-green-400 rounded-full"></span>
                                    {task.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SpecificGroup;