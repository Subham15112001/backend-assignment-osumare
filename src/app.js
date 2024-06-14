import express from 'express';
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();

//cofigur cors
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    creadentials:true
}))

//limit json size
app.use(express.json({limit:"16kb"}))

//configure url, extended true so that we can have obj inside obj
app.use(express.urlencoded({extended: true}))

//to store asset in file name public
app.use(express.static("public"))

//to read user cookies 
app.use(cookieParser())

//-----------------------------------------------------------------
import userRouter from './routes/user.routes.js'
import taskRouter from './routes/task.routes.js'

app.use("/api/v1/users",userRouter)
app.use("/api/v1/tasks",taskRouter)

export {app}