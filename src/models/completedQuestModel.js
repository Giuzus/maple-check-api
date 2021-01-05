var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var completedQuestSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    quest: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quests'
    },
    completeDate: {
        type: Date,
        required: true
    }
});

var CompletedQuests = mongoose.model('CompletedQuests', completedQuestSchema);

module.exports = CompletedQuests;