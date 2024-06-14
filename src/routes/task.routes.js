import { Router } from "express";
import { createTask } from "../controllers/task.controller.js";
import {verifyJWT} from '../middlewares/auth.middleware.js';

const taskRouter = Router();

taskRouter.route("/createTask").post(verifyJWT,createTask)

export default taskRouter