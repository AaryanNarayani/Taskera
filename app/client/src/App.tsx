import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import './App.css'
import Landing from './pages/Landing'
import Home from './pages/Home'
import NavBar from './components/navbar/NavBar'
import SignUp from './pages/SignUp'
import SideBar from './components/sideBar/SideBar'
import Tasks from './pages/Tasks'
import Error from './pages/Error'
import Analytics from './pages/Analytics'
import Calendar from './pages/Calendar'
import { useEffect, useState } from 'react'


const AppLayout = () => {
  const [isLanding, setIsLanding] = useState(false)
  const location = useLocation()

  useEffect(() => {
    if (location.pathname === '/') {
      setIsLanding(true)
    } else {
      setIsLanding(false)
    }
  }, [location.pathname])

  return (
    <div className='bg-[--ternary] h-screen text-[--primary]'>
      <NavBar isLanding={isLanding}/>
      <div className='flex h-[calc(100%-60px)]'>
        <SideBar isLanding={isLanding}/>
        <Routes>
          <Route path='/' element={<Landing/>}/>
          <Route path='/home' element={<Home/>}/>
          <Route path='/tasks' element={<Tasks/>}/>
          <Route path='/signUp' element={<SignUp/>}/>
          <Route path='/analytics' element={<Analytics/>}/>
          <Route path='/calendar' element={<Calendar/>}/>
          <Route path='*' element={<Error/>}/>
        </Routes>
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  )
}

export default App