import { createContext, useEffect, useState } from "react";
import axios from 'axios'
import { toast } from "react-toastify";



export const AppContext = createContext();


export const AppContextProvider = (props) =>{

    axios.defaults.withCredentials = true;    //for allowing cookies

    const backendUrl = "https://auth-backend-wdgd.onrender.com";
    const [isLoggedin, setIsLoggedin] = useState(false)
    const [userData, setUserData] = useState(false);

    
    const getAuthState = async() =>{
        try {
            const {data} = await axios.get(`${backendUrl}/api/auth/is-auth`)
            if(data.success){
                setIsLoggedin(true);
                getUserData();
            }  else{
                setIsLoggedin(false);
            }

        } catch (error) {
            if (error.response && error.response.status === 401) {
                 // Handle 401 Unauthorized gracefully
                console.log("User is not authenticated");
                setIsLoggedin(false);    // Ensure the user is logged out
            } else{
                console.error("Auth State Error:", error); // Handle other errors
            }
        }   
        
    }
    console.log("userData", userData)

    const getUserData = async ()=>{
        try {
            const {data} = await axios.get(`${backendUrl}/api/user/data`)
            data.success ? setUserData(data.userData) : toast.error(data.message);
        } catch (error) {
            toast.error(error.message);
        }   
    }

    useEffect(()=>{
        getAuthState();
    }, [])
    

    const value = {
        backendUrl,
        isLoggedin, setIsLoggedin,
        userData, setUserData,
        getUserData
    }
    return(
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}
