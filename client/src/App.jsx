import { Routes ,Route} from 'react-router-dom';
import Home from "./pages/Home"
import Dashboard from "./pages/Dashboard"
import Layout from "./pages/Layout"
import Preview from "./pages/Preview"
import {login , setLoading } from "../src/app/feature/authSlice"
import ResumeBulider from "./pages/ResumeBulider"
import { useDispatch } from 'react-redux';
import {Toaster} from "react-hot-toast"
import api from "./configs/api"
import { useEffect } from 'react';
function App() {
  const dispatch = useDispatch()
  const getUserData = async () => {
  const token = localStorage.getItem('token')
    try {
      if (token) {
        const { data}= await api.get('/api/user/data', {headers: { Authorization:token } })

        if (data.user) {
              console.log(data.user);
          dispatch(login({token , user:data.user}))
        }
        dispatch(setLoading(false))
      }
      else{
        dispatch(setLoading(false))

      }
    } catch (error) {
        dispatch(setLoading(false))
        console.log(error.message);
        
    }
  }
  useEffect(()=>{
    getUserData()
  },[])
  return (
    <>
     <Toaster/>
     <Routes>
      <Route path="/" element ={<Home/>}/>
      <Route path='app' element ={<Layout/>}>
        <Route index element={<Dashboard />} />
        <Route path='builder/:resumeId' element={<ResumeBulider />}/>
      </Route>
      <Route path='preview/:resumeId' element={<Preview/>}/>
      
     </Routes>
    </>
  )
}

export default App
