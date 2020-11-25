const express = require('express');
const cookieParser = require('cookie-parser');

const registerAuthMiddlewares = require('./src/middlewares/auth.js')

const app = express();

app.use(cookieParser());

registerAuthMiddlewares(app);

app.get('/', async (req, res) => {

    res.status(200).send(`Hello ${ req.googleUser.name }`).end();

});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {

    console.log(`App listening on port ${PORT}`);

});