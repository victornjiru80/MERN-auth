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

       {!isUserLoggedIn ? (
            <img src={assets.header_img} alt="" className='w-46 h-26 rounded-md mb-6' />
            ) : (
              <p></p>
            ) } 

        <h1 className='flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2'>Hello { userData ? userData.name : 'Everyone'}!
           <img className='w-8 aspect-square' src={assets.hand_wave} alt="" />
        </h1>

        {!isUserLoggedIn ? (
           <h2 className='text-3xl sm:text-5xl font-semibold mb-4'>Welcome to our Community!</h2>
        ) : (
          <h2 className='text-3xl sm:text-5xl font-semibold mb-4'> </h2>
        )}

        {!isUserLoggedIn ? (
            <p className='mb-8 max-w-md'> </p>
        ) : (
            <p className='mb-8 max-w-md'> We're thrilled to have you as part of our community. Your presence adds value, and we can't wait to see the unique contributions you'll make. </p>
        )}


        {!isUserLoggedIn ? (
                <>
                    <p className='mb-8 max-w-md'>We are a diverse community of like-minded people and we welcome you to take this journey with us. We are confident that you will fit right in! Take a tour and learn more about us. </p>
                    <button className='border border-gray-500 rounded-full px-8 py-2.5 hover:bg-gray-100 transition-all cursor-pointer' onClick={()=>navigate('/login')}>Learn More</button>
                </>
                
          ) : (   



            <>
            <img className= "aspect-square, w-20" src={assets.hand_wave_2} />
            
            </>





        )}
    </div>
  );
};

export default Header;
