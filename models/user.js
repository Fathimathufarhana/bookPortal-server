import { model, Schema } from "mongoose";
import uniqueValidator from 'mongoose-unique-validator'

const userSchema = new Schema({
  
    first_name:{
        type:String,
        required:true
    },
    last_name:{
        type:String,
    },
    gender: {
        type: String,
        enum: ["male", "female"]
    },
    date_of_birth: {
        type: Date,
        required: true,
        trim: true,
    },
    phone_number: {
        type: Number,
        unique:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password: {
         type: String, 
         required: true 
    },
    role: {
        type: String,
        default:"client"
    }
},{ timestamps : true })

userSchema.plugin(uniqueValidator);

const User = model("User", userSchema)

export default User