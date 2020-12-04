const Bosses = require('../models/bossModel');

module.exports = (app) => {

    app.get('/bosses', async (req, res, next) => {
        try {

            let bosses = await Bosses.find();

            res.status(200).send(bosses);

        }
        catch (err) {
            next(err);
        }
    });
}