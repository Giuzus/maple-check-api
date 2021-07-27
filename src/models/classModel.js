var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var classSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    }
});

var Classes = mongoose.model('Classes', classSchema);

module.exports = Classes;