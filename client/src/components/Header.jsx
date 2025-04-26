import React, { useContext, useState, useEffect } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'






const Header = () => {
  
  const {userData, isLoggedin} = useContext(AppContext);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false); // State to track login status
  const navigate = useNavigate();

   // Update the state whenever isLoggedin changes
   useEffect(() => {
    setIsUserLoggedIn(isLoggedin);
  }, [isLoggedin]);


  return (
    <div className='flex flex-col items-center mt-20 px-4 text-center text-gray-800'>
        <img src={assets.header_img} alt="" className='w-46 h-46 rounded-full mb-6' />
        <h1 className='flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2'>Hello { userData ? userData.name : 'Everyone'}!
           <img className='w-8 aspect-square' src={assets.hand_wave} alt="" />
        </h1>
        <h2 className='text-3xl sm:text-5xl font-semibold mb-4'>Welcome to our Community!</h2>

        {isUserLoggedIn ? (
                <p className='mb-8 max-w-md'>
                  Welcome to our community! We're thrilled to have you join us and become a part of something special. Here, you'll find a supportive and engaging environment where ideas are shared, connections are made, and everyone is valued. Whether you're here to learn, contribute, or simply connect with like-minded individuals, know that you’re among friends. We can’t wait to see the unique perspective and energy you bring—welcome aboard!
                </p>
                 <p className='mb-8 max-w-md'>
                    Now that you're here with us, We would like to show you what our community is about and hopefully your journey with us will be worthwhile!
                 </p>
          ) : (   
             <>
                <p className='mb-8 max-w-md'>We are a diverse community of like-minded people and we welcome you to take this journey with us. We are confident that you will fit right in! Take a tour and learn more about us. </p>
                <button className='border border-gray-500 rounded-full px-8 py-2.5 hover:bg-gray-100 transition-all cursor-pointer' onClick={()=>navigate('/login')}>Learn More</button>
             </>
        )}
    </div>
  );
};

export default Header;
