import mongoose from "mongoose";

//in this schema we only need the user to provide name email and password

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    verifyOtp: {type: String, default: ''},
    verifyOtpExpireAt: {type: Number, default: 0},
    isAccountVerified: {type: Boolean, default: false},
    resetOtp: {type: String, default: ''},
    resetOtpExpireAt: {type: Number, default: 0},
})




const userModel = mongoose.models.user|| mongoose.model('user', userSchema) //searches for the user model and if not available will create a new user


export default userModel;
