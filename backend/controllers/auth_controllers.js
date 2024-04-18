import { error } from "console";
import bcrypt from 'bcryptjs';
import User from "../models/userModels.js";
import generateTokenAndSetCookie from "../utils/generateTokens.js";

export const signup = async (req,res) =>{
    try {
        const {fullName, userName, password, confirmPassword, gender} = req.body;

        if(password !== confirmPassword){
            return res.status(400).json({error:'Password not matched.'});
        }

        const user = await User.findOne({userName})

        if(user){
            return res.status(400).json({error:'User alreay exists.'});
        }

        //Hash the password here.
        const salt = await bcrypt.genSalt(10);

        const handlePassword = await bcrypt.hash(password, salt);

        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${userName}`;

        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${userName}`;

        const newUser = new User({
            fullName,
            userName,
            password: handlePassword,
            gender,
            profilePicture: gender === 'male' ? boyProfilePic : girlProfilePic
        })

        if(newUser){

            //Generate JWT tokens.
            generateTokenAndSetCookie(newUser._id,res);
            await newUser.save();

        res.status(201).json({
            _id: newUser.id,
            fullName: newUser.fullName,
            userName: newUser.userName,
            profilePicture: newUser.profilePicture
        })
        }else{
            return res.status(400).json({error:'Invalid User Data.'});
        }

    } catch (error) {
        console.log('Error in signup.',error.message);
        res.status(500).json({error: 'Internal Server Error.'});
    }
};

export const login = async (req,res) => {
    try {
        const {userName, password} = req.body;
        const user = await User.findOne({userName});
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || '');

        if(!user || !isPasswordCorrect){
            return res.status(400).json({error:'Invalid username or passord.'})
        }

        generateTokenAndSetCookie(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            userName: user.userName,
            profilePicture: user.profilePicture
        });

    } catch (error) {
        console.log('Error in login.',error.message);
        res.status(500).json({error: 'Internal Server Error.'});
    }
    
}

export const logout = (req,res) => {
    try {
        res.cookie('jwt','',{maxAge:0})
        res.status(200).json({message:'Logged Out Sucessfully.'})
    } catch (error) {
        console.log('Error in logout.',error.message);
        res.status(500).json({error: 'Internal Server Error.'});
    }
}
