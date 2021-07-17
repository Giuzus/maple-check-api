var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var completedTaskSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    task: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tasks'
    },
    completeDate: {
        type: Date,
        required: true
    }
});

var CompletedTasks = mongoose.model('CompletedTasks', completedTaskSchema);

module.exports = CompletedTasks;