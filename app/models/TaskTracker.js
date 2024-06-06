const mongoose = require('mongoose');
const {Schema,model} = mongoose
const timeLogSchema = new Schema({
    task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true }, // Reference to Task
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User
    startDateTime: { type: Date, required: true }, // Start date and time of the time log
    endDateTime: { type: Date, required: true }, // End date and time of the time log
    duration: { type: Number, default: 0 } //
});

const TimeTracker = model('TimeLog', timeLogSchema);
module.exports = TimeTracker
