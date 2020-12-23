var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var completedQuestSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    questId: {
        type: String,
        required: true
    },
    completeDate: {
        type: Date,
        required: true
    }
});

var CompletedQuests = mongoose.model('CompletedQuests', completedQuestSchema);

module.exports = CompletedQuests;