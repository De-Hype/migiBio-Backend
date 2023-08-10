import mongoose from 'mongoose'

const otpSchema = new mongoose.Schema({
   email:{
    type:String,
    required:true,
    unique:true,
   },
   number:{
        type:String,
        required:true,
        unique:true,
    },
    hashedRID:{
        type:String,
        unique:true,
    }
    
}, {timestamps:true})
otpSchema.index({createdAt:1}, {expireAfterSeconds:1200});

export default mongoose.model('OTP', otpSchema)

