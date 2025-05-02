import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios'
import { toast } from 'react-toastify';




const Login = () => {

  const navigate = useNavigate();

  const {backendUrl, setIsLoggedin, getUserData} =useContext(AppContext);

  const [state, setState] = useState('log in');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmitHandler = async (e)=>{
      try {
          e.preventDefault();
    
          axios.defaults.withCredentials = true;  //sending a cookie with the link
          let data;

        if(state === 'sign up'){
                const response = await axios.post(`${backendUrl}/api/auth/register`, {name, email, password}) //sending the name email and password together with the url
                data = response.data;

        } else {
                const response = await axios.post(`${backendUrl}/api/auth/login`, {email, password})
                data = response.data;
              }

                if(data && data.success){
                  setIsLoggedin(true);
                  getUserData()
                  navigate('/')
                }else{
                  toast.error(data.message || "Login failed");
                }
        
      } catch (error) {
        console.error("Error during login:", error);
        toast.error(error.message);
      }
  }

  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 '>
      

      <div className='bg-white p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-500 text-sm'>

        <h2 className='text-3xl font-semibold text-black-500 text-center mb-3'>{state === 'sign up' ? 'Create Account' : 'Log in'}</h2>

        <p className='text-center text-sm mb-6'>{state === 'sign up' ? 'Create your account' : 'Log in to your account'}</p>
 
        <form onSubmit={onSubmitHandler} >

          {state === 'sign up' && (
             <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333a5c]'>
              <img src={assets.person_icon} alt="" />
              <input onChange={e => setName(e.target.value)} value = {name}
               className='bg-white outline ' type="text" placeholder='Full Names' required />
             </div>
          )}
         
          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333a5c]'>
              <img src={assets.mail_icon} alt="" />
              <input 
              onChange={e => setEmail(e.target.value)} value = {email}
              className='bg-white w-full outline ' type="email" placeholder='Email' required />
          </div>

          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333a5c]'>
              <img src={assets.lock_icon} alt="" />
              <input 
                onChange={e => setPassword(e.target.value)} value = {password}
                className='bg-white outline ' type="password" placeholder='password' required />
          </div>

              { state === 'login' && 
               ( <p
                  onClick={()=> navigate('/reset-password')}
                  className='mb-4 text-indigo-600 cursor-pointer'>Forgot password?
                </p>) }

          <button className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-500 text-white font-medium'>{state}</button>

        </form>


        {state === 'sign up' ? (
          <p className='text-gray-400 text-center text-xs mt-4'>
              Already have an account? {' '}
              <span onClick={()=>setState('login')} className='text-blue-800 cursor-pointer underline'>Log in</span>
          </p>
        ) : (
          <p className='text-gray-600 text-center text-xs mt-4'>
            No account? {' '}
             <span onClick={()=>setState('sign up')} className='text-blue-800 cursor-pointer underline'>Register</span>
          </p>
        )}
        
        


      </div>
    </div>
  )
}

export default Login
