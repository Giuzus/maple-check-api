var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var characterSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    level: {
        type: Number,
        required: true
    },
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class'
    },
    position: {
        type: Number,
        required: false
    },
    userId: {
        type: String,
        required: true
    }
});

var Characters = mongoose.model('Characters', characterSchema);

module.exports = Characters;