require('dotenv').config()

const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const config = require('./configuration');
const cors = require('cors');

console.log("Connect to MONGO")
mongoose.connect(config.Mongo.URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const app = express();

app.use(cors({
    credentials: true,
    origin: config.CORS.origin
}));

app.use(cookieParser());
app.use(express.json())
app.use(express.urlencoded({ extended: true}))

//Register auth controller
require('./src/controllers/auth.js')(app);

//Register auth middlewares
require('./src/middlewares/auth.js')(app);

//Register user controller
require('./src/controllers/user.js')(app);

//Register Tasks controller
require('./src/controllers/task.js')(app);

//Register Tasks controller
require('./src/controllers/task.js')(app);

//Register Characters controller
require('./src/controllers/character.js')(app);

if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.send({
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

//The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function (req, res) {
    res.status(404).send();
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {

    console.log(`App listening on port ${PORT}`);

});