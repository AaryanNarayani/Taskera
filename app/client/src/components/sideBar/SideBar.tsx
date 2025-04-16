/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAppSelector } from "@/lib/hooks";
import { CalendarClock, ChartNoAxesCombined, Home, Hourglass, LayoutList, LogOut, User, UsersRound } from "lucide-react"
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"

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
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const navigate = useNavigate();
    const user = useAppSelector((state) => state.user)
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

    const handleLogout = () => {
        localStorage.removeItem('token');
        
        navigate('/')
    }
    
    return (
        <>
            {!isLanding && (
                <div className=" min-w-[60px] relative border-r border-[--border-line] h-full flex flex-col items-center py-10 justify-between">
                    <div className="flex flex-col gap-5">
                        {list}
                    </div>
                    <div style={{
                        backgroundImage : `url(${user.avatar})`,
                        backgroundSize: 'cover',
                         backgroundRepeat: 'no-repeat'
                    }}  className="w-10 h-10 object-contain rounded-full cursor-pointer" onClick={() => setIsProfileOpen(!isProfileOpen)}/>
                    {isProfileOpen && <div className="absolute bottom-10 rounded-lg bg-[--background-2] text-[--secondary] left-20 w-fit flex flex-col  p-2" onBlur={() => setIsProfileOpen(false)}>
                        <button onClick={() => {
                            navigate('/profile')
                            setIsProfileOpen(false)
                        }} className="w-full hover:bg-[--secondary] hover:text-[--background-2] rounded-lg flex  items-center p-2 gap-2"><User/>Profile</button>
                        <button className="w-full hover:bg-[--secondary] hover:text-[--background-2] rounded-lg flex items-center p-2 gap-2" onClick={handleLogout}><LogOut/>Logout</button>
                    </div>}
                </div>
            )}
        </>
    )
}

export default SideBar