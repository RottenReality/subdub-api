import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String, 
        required:[true, 'User Name is required'],
        trim: true,
        minLength: 2,
        maxLenght: 50,
    },
    email: {
        type: String,
        required: [true, 'User Email is required'],
        unique: true,
        trim: true,
        minLength: 5,
        maxLength: 255,
        match:[/\S+@\S+\.\S+/, 'Please fill a valid email adress'],
    },
    password: {
        type: String,
        required: [true, 'User Password is required'],
        trim: true,
        minLength: 6,
    }
}, { timestamps: true })

const User = mongoose.model('User', userSchema)

export default User