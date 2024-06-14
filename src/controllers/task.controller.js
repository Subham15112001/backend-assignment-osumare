import {ApiError} from '../utils/ApiError.js';
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {Task} from '../models/task.model.js';
import {ObjectId} from 'mongodb';
import jwt from "jsonwebtoken";
import mongoose,{isValidObjectId} from 'mongoose';

const createTask = asyncHandler(async (req,res,next) => {
    const {taskContent,taskTitle} = req.body;
    const taskUser = req.user?._id;

    if(!taskContent || !taskTitle){
        throw new ApiError(400,"all fields are neccessary")
    }
    console.log(taskUser)

    const task = await Task.create({
        taskContent,
        taskTitle,
        taskUser
    })

    if(!task){
        throw new ApiError(500,"error in creating task")
    }

    return res.status(200)
              .json(new ApiResponse(200,task,"task created successfully"))
})

const getTaskById = asyncHandler(async (req,res,next) => {
    
})

export {createTask}