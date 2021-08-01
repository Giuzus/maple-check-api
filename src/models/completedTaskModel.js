var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var completedTaskSchema = new Schema({
    character: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Characters'
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