import {ApiError} from '../utils/ApiError.js';
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {User} from '../models/user.model.js';
import {ObjectId} from 'mongodb';
import jwt from "jsonwebtoken";
import mongoose,{isValidObjectId} from 'mongoose';

const generateAccessTokenAndRefreshToken = (userId) => {

}
const registerUser = asyncHandler(async (req,res,next) => {
    const {username,fullname,email,password} = req.body;

    if([username,fullname,email].some((value) => value.trim() === "" )){
        throw new ApiError(400,"all fields are required")
    }

    const UserExist = await User.findOne({
        $or : [
           {"username" : username},
           {"email" : email}
        ]
    })

    if(UserExist){
        throw new ApiError(400,"user already exist")
    }

    const user = await User.create({
        fullname,
        email,
        password,
        username : username.toLowerCase(),
    }) 

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(200)
              .json(new ApiResponse(200,createdUser,"user created successfully"))
})


export {registerUser}