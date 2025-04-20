import jwt from 'jsonwebtoken'
import userModel from '../models/userModel.js';




const userAuth = async (req, res, next) =>{

    const token = req.cookies.token; //getting the token from the cookies
    
    //check if token exists, if not return error
    if(!token){
        return res.status(401).json({success: false, message: "Not authorized. Log in again"});
    }

    //token is available
    try {

        //decoding the token found in the cookies and find the id
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(tokenDecode.id); //find the user by id
        
        //if user is not found, return error
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
          }

          req.user = user; //add the user to the request object, so it can be used in the controller function


        //if there's an id,
      //  if(tokenDecode.id){
            //if theres an id the token will be added in the request body with the property userid
        //    req.body.userId = tokenDecode.id;
      //  }else{
       //     return res.json({success: false, message: "Not authorized, log in again"});
        //}
        console.log('Decoded Token:', tokenDecode);
        console.log('User:', user);

        next(); //will try to execute the controller function which is sendverifyOtp




    } catch (error) {
        return res.status(401).json({success: false, message: error.message});
    }
}


export default userAuth;