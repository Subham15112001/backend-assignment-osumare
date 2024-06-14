import mongoose,{Schema} from "mongoose";

const taskSchema = new Schema({
    task : {
        type : String,
        require : true,
        index : true
    },
    taskUser : {
        type : Schema.Types.ObjectId,
        ref : "User"
    }
},{timestamps : true})

export default Task = mongoose.model("Task",taskSchema)