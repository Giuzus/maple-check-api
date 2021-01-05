var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var completedBossesSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    boss: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bosses'
    },
    completeDate: {
        type: Date,
        required: true
    }
});

var CompletedBosses = mongoose.model('CompletedBosses', completedBossesSchema);

module.exports = CompletedBosses;