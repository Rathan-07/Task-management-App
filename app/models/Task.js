const mongoose = require('mongoose')
const {Schema,model} = mongoose
const taskSchema = new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    title: String,
    description: String,
    priority: String,
    status: String,
    dueDate: Date,
    assignedUserId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] ,
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true }
},{timestamps: true})


// Task model
const Task = model('Task',taskSchema)
module.exports = Task