import {ApiError} from '../utils/ApiError.js';
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {User} from '../models/user.model.js';
import {ObjectId} from 'mongodb';
import jwt from "jsonwebtoken";
import mongoose,{isValidObjectId} from 'mongoose';

const generateAccessTokenAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken; // insert refreshtoken

        await user.save({ validateBeforeSave : false}); // validateBeforeSave : false , important or else all info will ve needed in current user 

        return {accessToken,refreshToken};

    } catch (error) {
        throw new ApiError(500,error.message)
    }
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

const loginUser = asyncHandler(async (req,res,next) => {
    const {email,password} = req.body;

    if(!email || !password){
        throw new ApiError(400,"all fields are required")
    }

    const user = await User.findOne({
        "email" : email
    })

    if(!user){
        throw new ApiError(400,"user has not signup")
    }

    const passwordCheck = await user.isPasswordCorrect(password);

    if(!passwordCheck){
        throw new ApiError(400,"error password is incorrect")
    }

    const {accessToken,refreshToken} = await generateAccessTokenAndRefreshToken(user?._id);

    const loginUser = await User.findById(user?._id).select("-password -refreshToken");

    const option = {
        httpOnly:true,
        secure:true
    }

    return res.status(200)
               .cookie("accessToken",accessToken,option)
               .cookie("refreshToken",refreshToken,option)
               .json(new ApiResponse(200,{
                user:loginUser,
                accessToken,
                refreshToken
               },
               "user login successfully"
            ))

 })

const logoutUser = asyncHandler(async (req,res,next) => {
    const logout = await User.findByIdAndUpdate(req.user?._id, 
        {
            $unset: {
                "refreshToken": ""
            }
        },
        {
            new: true
        }
    )

    if(!logout){
        throw new ApiError(500,"unable to logout")
    }

    return res.status(200)
              .json(new ApiResponse(200,{},"logout user"))
})

export {
    registerUser,
    loginUser,
    logoutUser
}