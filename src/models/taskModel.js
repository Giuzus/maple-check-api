var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var taskSchema = new Schema({
    repeats: {
        type: String,
        default: 'DAILY',
        enum: ['DAILY', 'WEEKLY'],
        required: true
    },
    type: {
        type: String,
        default: 'QUEST',
        enum: ['QUEST', 'BOSS'],
        required: true
    },
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    crystalValue: {
        type: Number,
        required: false
    },
    userId: {
        type: String,
        required: false
    },
    default: {
        type: Boolean,
        required: true
    },
});

var Tasks = mongoose.model('Tasks', taskSchema);

module.exports = Tasks;