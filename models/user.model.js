import mongoose from "mongoose"

const userSchema = mongoose.Schema({
    name: {
        type:String,
        required:[true,"User name is required"],
        trim: true,
        minLength:2,
        maxLength:15,
    },

    email:{
        type:String,
        required:[true,"Email is required"],
        unique: true,
        trim: true,
        lowercase:true,
        match: [
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            "Please provide a valid email address"
          ]

    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"],
       
      }
     

},{Timestamp: true});


const User = mongoose.model('User', userSchema);

export default User;

