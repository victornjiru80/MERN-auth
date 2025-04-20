import userModel from '../models/userModel.js'



export const getUserData = async (req, res) =>{

    try {
        
        const userId =req.user._id; //get userId from token

        //find user in db using userId
        const user = await userModel.findById( userId );

        //if no user found
        if(!user){
            return res.json({success: false, message: 'user not found'});
        };

        res.json({
            success: true,
            userData: {
                userId: user._id,
                email: user.email,
                name: user.name,
                isAccountVerified: user.isAccountVerified
            }
        });
        

    } catch (error) {
        return res.json({success: false, message: error.message});
    }
}