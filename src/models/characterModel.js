var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var characterSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    position: {
        type: Number,
        required: false
    },
    userId: {
        type: String,
        required: true
    },
    configuration: {
        required: false,
        type: Object,
        hidden: {
            type: Boolean,
            required: true
        },
        tasks: [{
            task: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Tasks',
                required: true
            },
            hidden: {
                type: Boolean,
                reqiured: true
            },
            priority: {
                type: Number,
                reqiured: true
            }
        }]
    }
});

var Characters = mongoose.model('Characters', characterSchema);

module.exports = Characters;