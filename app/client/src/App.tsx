import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import './App.css'
import Landing from './pages/Landing'
import Home from './pages/Home'
import NavBar from './components/navbar/NavBar'
import SignUp from './pages/SignUp'
import SideBar from './components/sideBar/SideBar'
import Tasks from './pages/Tasks'
import Error from './pages/Error'
import OTPpage from './pages/OTPpage'
import Analytics from './pages/Analytics'
import Calendar from './pages/Calendar'
import { useEffect, useState } from 'react'
import Dates from './pages/Dates'
import Details from './pages/Details'
import Pomodoro from './pages/Pomodoro'
import AuthHOC from './hooks/AuthHoc'
import { Toaster } from 'sonner'
import { ThemeProvider } from './components/theme-provider'
import { Redirect } from './pages/Redirect'
import Profile from './pages/Profile'
import GroupsPage from './pages/Groups'


const AppLayout = () => {
  const [isLanding, setIsLanding] = useState(false)
  const location = useLocation()

  useEffect(() => {
    if (location.pathname === '/' || location.pathname === '/details'|| location.pathname === '/signup' || location.pathname === '/otpPage' || location.pathname === '/dates') {
      setIsLanding(true)
    } else {
      setIsLanding(false)
    }
  }, [location.pathname])

  return (
    <div className='bg-[--ternary] h-screen text-[--primary]'>
      <Toaster richColors/>
      <NavBar isLanding={isLanding}/>
      <div className='flex h-[calc(100%-60px)]'>
        <SideBar isLanding={isLanding}/>
        <Routes>
          <Route path='/' element={<Landing/>}></Route>
          <Route path='/home' element={<AuthHOC><Home /></AuthHOC>}></Route>
          <Route path='/tasks' element={<AuthHOC><Tasks/></AuthHOC>}></Route>
          <Route path='/signUp' element={<SignUp/>}></Route>
          <Route path='/error' element={<Error/>}></Route>
          <Route path='/otpPage' element={<OTPpage/>}></Route>
          <Route path='/analytics' element={<AuthHOC><Analytics/></AuthHOC>}/>
          <Route path='/calendar' element={<Calendar/>}/>
          <Route path='/Dates' element={<AuthHOC><Dates/></AuthHOC>}/>
          <Route path='/details' element={<Details/>}/>
          <Route path="/google/redirect" element={<Redirect />} />
          <Route path='/pomodoro' element={<AuthHOC><Pomodoro/></AuthHOC>}/>
          <Route path='/profile' element={<AuthHOC><Profile/></AuthHOC>}/>
          <Route path='/groups' element={<GroupsPage/>}/>
          <Route path='/groups/:id' element={<SpecificGroup/>}/>

          <Route path='*' element={<Error/>}/>
        </Routes>
      </div>
    </div>
  )
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
      <AppLayout />
      </Router>
    </ThemeProvider>
  )
}

export default App