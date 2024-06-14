import connectDB from "./db/index.js";
import dotenv from 'dotenv';
import { app } from "./app.js";
const port = process.env.PORT || 8000;

dotenv.config({
    path: './.env'
})

connectDB()
.then(()=>{
    app.listen(port,()=>{
        console.log(`server is running on port ${port}`)
    })
})
.catch((err)=>{
    console.log("server is not running",err)
})


