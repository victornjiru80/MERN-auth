import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken' //for generating a token for authentication
import userModel from '../models/userModel.js';
import transporter from '../config/nodemailer.js'
import { EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE } from '../config/emailTemplates.js';




//userController for registering
export const register = async (req, res)=>{


    const {name, email, password} = req.body;

    if(!name || !email || !password){
        return res.json({success: false, message: 'missing details!'})
    }

//name email and password are available. saving the info on the database
    try {

        const existingUser = await userModel.findOne({email});  //checks whether the email in the request exists

        if(existingUser){
            return res.json({success:false, message: "user already exists"});   //if the email exists then we return a message stating they already exist
        }

        //if the user doesn't exist, encrypt their password and store it
        const hashedPassword = await bcrypt.hash(password, 10);  //encrypting the passwords

        const user = await userModel.create({name, email, password: hashedPassword});

        // the user is stored in the database
        await user.save();

        //generating a token for authentication and sending it with cookies
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'})  //whenever a new user is created in the database then the db generates a new _id automatically

        //send the token to the users in the response and in the response the cookie is added containing the token
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',  //if node environment is production, it adds none. Otherwise it is strict
            maxAge: 7 * 24 * 60 * 60 * 1000   //7days expiry date
        });

        //sending a welcome email
  /*      const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome to my project',
            text: `welcome to Victor's demo site. Your account has been created with email: ${email}`
        }

        await transporter.sendMail(mailOptions);  */

        return res.json({success: true, 
                         message: "User registered successfully",
                         userId: user._id}); //sending the userId and isAccountVerified status to the client

    } catch (error) {
        res.json({success: false, message: error.message});
    }

}




//userController for logging in

export const login = async (req, res)=>{
    //name isn't required. user already registered
    const {email, password} = req.body;

    //validating email and password
    if (!email || !password){
        return res.json({success:false, message: 'Email and password are required'})
    }


    try {
        const user = await userModel.findOne({email});

        if(!user){
            return res.json({success: false, message: 'Invalid email'});
        }


        //comparing passwords
        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.json({success: false, message: 'Invalid password'});
        }

        //if passwords match, generate a token to authenticate the user and log them in
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'})  

        //send the token to the users in the response and in the response the cookie is added containing the token
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',  //if node environment is production, it adds none. Otherwise it is strict
            maxAge: 7 * 24 * 60 * 60 * 1000   //7days expiry date
        })
        
        return res.json({success: true,
                        message: "User logged in successfully",
                        userId: user._id}); //sending the userId and isAccountVerified status to the client


    } catch (error) {
        return res.json({success: false, message: error.message});
    }
}



//logout controller function

export const logout = async (req, res)=>{
    try {
        
        res.clearCookie('token', {    //token(cookie name)
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
        })

        return res.json({ success: true, message: 'logged out' });

    } catch (error) {
        return res.json({success: false, message: error.message});
    }
};




//user email verification controller
//sending verification  OTP to the user email

export const sendVerifyOtp = async (req, res)=>{

/*    try {

        const {userId} = req.body;

        const user = await userModel.findById(userId);

        if(user.isAccountVerified){
            return res.json({success: false, message: "Account already verified"});
        }

        //if user isn't verified a OTP will be sent to the user.

       const otp = String(Math.floor(100000 + Math.random() * 900000)); //generating random 6-letter number 

       user.verifyOtp = otp;
       user.verifyOtpExpireAt = Date.now() + 24 * 60 * 

       //send back an email with OTP code
       const mailOption = {
        from: process.env.SENDER_EMAIL,
        to: user.email,
        subject: 'Account verification OTP',
        text: `Your OTP is ${otp}. Verify your account using this OTP`,
        html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email)
       }

       await transporter.sendMail(mailOption);
       
       res.json({success: true, message: 'Verification otp sent to email'});



    } catch (error) {
        return res.json({success: false, message: error.message});
    }

*/
}




// get the otp and verify user account

export const verifyEmail = async (req, res)=>{

     const {userId} = req.body;

    //check whether userId and otp are available

    if(!userId ){
         return res.json({success: false, message: "missing details"});
        }

    //both are available
  try {
        
        const user = await userModel.findById(userId);

      if (!user){
            return res.json({success: false, message: "user not found"});
        }

    
        //if no matching otp
        if(user.verifyOtp === '' || user.verifyOtp !== otp){
            return res.json({success: false, message: "invalid OTP"});
       }

        //valid otp, check for expiry
       if(user.verifyOtpExpireAt <  Date.now()){
            return res.json({success: false, message: "otp expired"});
       }

        //valid otp
       
        user.verifyOtp = '';
       user.verifyOtpExpireAt = 0;

     
      user.isAccountVerified = true;

      await user.save();

        return res.json({success: true, message: "email verified successfully", userId: user._id});

  } catch (error) {
      return res.json({success: false, message: error.message});
   }

}



//check whether user is authenticated

export const isAuthenticated = async (req, res) =>{
        
  /*  try {

        return res.json({success: true});
        
    } catch (error) {
        return res.json({success: false, message: error.message});
    }
    
     */
}



//send password reset OTP

export const sendResetOtp = async (req, res) =>{

   /* const {email} = req.body;

    //check if email is available
    if(!email){
        return res.json({success: false, message: 'Email is required'});
    }

    try {
        
        const user = await userModel.findOne({email});
        if(!user){
            return res.json({success: false, message: 'user not found'});
        }

        //suppose user is found
        const otp = String(Math.floor(100000 + Math.random() * 900000)); //generating random 6-letter number 

        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
        
        await user.save();

       //send back an email where we will send an OTP 
 /*      const mailOption = {
        from: process.env.SENDER_EMAIL,
        to: user.email,
        subject: 'Password Reset OTP',
        html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email)
       };

       await transporter.sendMail(mailOption); 

       return res.json({success: true, message: 'otp sent to the email'});


    } catch (error) {
        return res.json({success: false, message: error.message});
    }

    */
}




//Reset user password

export const resetPassword = async (req, res) => {

  /* const {email, otp, newPassword} = req.body;

    if(!email || !otp || !password){
        return res.json({success: false, message: 'Email, OTP and new Password are required'});
    }

    try {
        
        const user = await userModel.findOne({email});

        //no user email found?
        if(!user){
            return res.json({success: false, message: "User not found"});
        }

        //user is available
        if(user.resetOtp === '' || user.resetOtp !== otp){
            return res.json({success: false, message: "invalid OTP"});
        }

        //expired otp
        if (user.resetOtpExpireAt < Date.now()){
            return res.json({success: false, message: 'otp expired'});
        }

        //valid otp, encrypt first the password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        //update the password in the db
        user.password = hashedPassword;

        user.resetOtp = ''  //reset the otp
        user.resetOtpExpireAt = 0;


        await user.save();

        return res.json({success: true, message: 'password has been reset successfully'});

    } catch (error) {
        return res.json({success: false, message: error.message});
    }
        
*/

}
