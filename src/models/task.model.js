import mongoose,{Schema} from "mongoose";

const taskSchema = new Schema({
    taskContent : {
        type : String,
        require : true,
        index : true
    },
    taskTitle : {
        type : String,
        require : true,
    },
    taskStatus : {
        type : Boolean,
        default : fasle
    },
    taskUser : {
        type : Schema.Types.ObjectId,
        ref : "User"
    }
},{timestamps : true})

export default Task = mongoose.model("Task",taskSchema)