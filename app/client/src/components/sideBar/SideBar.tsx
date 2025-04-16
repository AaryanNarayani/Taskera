/* eslint-disable @typescript-eslint/no-explicit-any */
import { CalendarClock, ChartNoAxesCombined, Home, Hourglass, LayoutList, UsersRound } from "lucide-react"
import { useState } from "react";
import { Link, useLocation } from "react-router-dom"

const sideBarItems = [{
    name: 'home',
    icon: <Home />,
    url: '/home'
},
{
    name: 'analytics',
    icon: <ChartNoAxesCombined />,
    url: '/analytics'
}, {
    name: 'tasks',
    icon: <LayoutList />,
    url: '/tasks'
}, {
    name: 'pomodoro',
    icon: <Hourglass />,
    url: '/pomodoro'
}, {
    name: 'calendar',
    icon: <CalendarClock />,
    url: '/calendar'
}, {
    name: 'groups',
    icon: <UsersRound />,
    url: '/groups'
},]

function SideBar({ isLanding } : any) {

    const [hoveredItem, setHoveredItem] = useState<string | null>(null);
    const location = useLocation();
    
    const list = sideBarItems.map((item, i) => (
        <Link 
            to={item.url} 
            key={i}
            className={`relative flex items-center ${location.pathname === item.url ? 'text-[--secondary]' : ''}`}
            onMouseEnter={() => setHoveredItem(item.name)}
            onMouseLeave={() => setHoveredItem(null)}
        >
            <div className="w-6 h-6">
                {item.icon}
            </div>
            {hoveredItem === item.name && (
                <p className="absolute left-8 bg-black/60 text-[--primary] px-2 py-1 rounded shadow capitalize z-10">
                    {item.name}
                </p>
            )}
        </Link>
    ))
    
    return (
        <>
            {!isLanding && (
                <div className="sticky min-w-[60px] border-r border-[--border-line] h-full flex flex-col items-center py-10 justify-between">
                    <div className="flex flex-col gap-5">
                        {list}
                    </div>
                    <div>A</div>
                </div>
            )}
        </>
    )
}

export default SideBar