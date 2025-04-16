import { useState } from "react";
import TaskCard from "../components/task/TaskCard"
import { Plus } from "lucide-react";
import ProgressBar from "../components/progressBar/ProgressBar";

interface Subtask {
  name: string;
  done: boolean;
}

interface Milestone {
  name: string;
  subtasks: Subtask[];
  done: boolean;
}

interface Task {
  name: string;
  milestone: Milestone[];
  done: boolean;
}

function Tasks() {
    const [isActive, setIsActive] = useState<string>('All');
    const [tasks, setTasks] = useState<Task[]>([{
    name : 'Exam study',
    milestone:[{
        name:'Get resources',
        subtasks: [{
            name:'gather resources',
            done:false,
        },{
            name:'gather youtube study material',
            done:false,
        }],
        done:false,
    },{
        name:'Buy Blue Book',
        subtasks: [{
            name:'go to clg',
            done:false,
        },{
            name:'Get money',
            done:false,
        }],
        done:false,
    }],
    done:false
},{
    name : 'EVS OBA completion',
    milestone:[{
        name:'Buy Pink Book',
        subtasks: [{
            name:'go to clg',
            done:false,
        },{
            name:'go to stationary',
            done:false,
        },{
            name:'buy a 12rs pink book',
            done:false,
        }],
        done:false,
    }],
    done:false
},{
    name : 'Mathematics Linear Algebra',
    milestone:[{
        name:'Gather study resources',
        subtasks: [{
            name:'Ask friends about pdf',
            done:false,
        },{
            name:'Sort important notes from RD Sharma book',
            done:false,
        },{
            name:'Browse on web',
            done:false,
        }],
        done:false,
    },{
        name:'Make short notes',
        subtasks: [{
            name:'Solve Important problems on sticky note',
            done:false,
        },{
            name:'Mark Important Exercise numbers',
            done:false,
        },{
            name:'Revise',
            done:false,
        }],
        done:false,
    }],
    done:false
},])

    const handleAddTask = () => {
        console.log('task added')
    }

    const list = ['Today', 'All'].map((item : any,i : number) => (
        <button key={i} onClick={()=>{setIsActive(item)}} className={`${isActive === item ? 'bg-[--secondary] text-[--ternary]' : 'bg-[--background-2]  text-[--secondary]'} rounded px-3 py-1`}>{item}</button>
    ))

    const updateSubtask = (taskIndex: number, milestoneIndex: number, subtaskIndex: number, done: boolean) => {
        const newTasks = [...tasks];
        newTasks[taskIndex].milestone[milestoneIndex].subtasks[subtaskIndex].done = done;
        
        const allSubtasksDone = newTasks[taskIndex].milestone[milestoneIndex].subtasks.every(subtask => subtask.done);
        newTasks[taskIndex].milestone[milestoneIndex].done = allSubtasksDone;
        
        const allMilestonesDone = newTasks[taskIndex].milestone.every(milestone => milestone.done);
        newTasks[taskIndex].done = allMilestonesDone;

        setTasks(newTasks);
    }

    const taskList = tasks.map((task, taskIndex) => (
        <div key={taskIndex}>
            <TaskCard 
                item={task} 
                setTasks={setTasks} 
                taskIndex={taskIndex}
                updateSubtask={updateSubtask}
            />
        </div>
    ));

    const length = tasks.length;
    const donetaskList = tasks.filter((item : any) => (item.done))
    const doneLength = donetaskList.length;

  return (
    <div className="w-full flex flex-col items-center py-6 md:py-10 gap-2 md:gap-4 px-4 md:px-0">
        <div className="flex w-full md:w-11/12 lg:w-5/6 xl:w-2/3 items-center justify-between">
            <div className="flex gap-2 md:gap-4">
                {list}
            </div>
            <button className="bg-[--secondary] text-[--ternary] rounded-full p-1" onClick={handleAddTask}><Plus/></button>
        </div>
        <div className="w-full md:w-11/12 lg:w-5/6 xl:w-2/3">
            <div className="sticky top-0 z-10">
                <ProgressBar progress={doneLength/length}/>
            </div>
            {taskList}
        </div>
    </div>
  )
}

export default Tasks