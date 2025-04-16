/* eslint-disable @typescript-eslint/no-explicit-any */
import { Bell } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { ModeToggle } from "../mode-toggle"

function NavBar({isLanding} : any) {

  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const handleAuth = () => {
    if(token){
      localStorage.removeItem('token');
      navigate("/")
    }
    else
    {
      navigate('/signup');
    }
  }

  return (
    <div className={`flex justify-between ${isLanding ? 'absolute z-10' : 'border-b'} border-[--border-line] items-center h-[60px] pr-5 w-full`}>
        <div className={`text-[20px] w-[60px] ${isLanding ? '' : 'border-r'} border-[--border-line] h-full flex justify-center items-center`}>
            <Link to='/'><img src="/Taskera.png" alt="" className="h-16 w-16 object-cover" /></Link>
        </div>
        <div className="flex gap-10 items-center">
            <ModeToggle/>
           {!isLanding &&  <button><Bell className="text-white"/></button>}
            {isLanding && <button onClick={handleAuth} className=" h-fit bg-[--secondary] text-[--ternary] px-4 py-1 rounded-md font-medium">{token ? 'Logout' : 'Login'}</button>}
        </div>
    </div>
  )
}

export default NavBar