var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var questSchema = new Schema({
    type: {
        type: String,
        default: 'DAILY',
        enum: ['DAILY', 'WEEKLY'],
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
    order: {
        type: Number,
        required: false
    }
});

var Quests = mongoose.model('Quests', questSchema);

module.exports = Quests;