import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type : String,
        required : true,
        unique : true,
        trim : true,
        index : true
    },
    email: {
        type : String,
        required : true,
        // unique : true,
        // trim : true,
    },
    fullName: {
        type : String,
        required : true,
        trim : true,
        index : true
    },
    avatar: {
        type : String,
       
    },
    coverImage: {
        type : String,
    },
    watchHistory: [ 
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Video'
        }
    ],
    password: {
        type : String,
        required : true,
    },
    refreshToken: {
        type: String
    }

} , {timestamps : true})

export const User = mongoose.model('User' , userSchema);