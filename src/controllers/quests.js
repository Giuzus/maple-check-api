const Quests = require('../models/questModel');

module.exports = (app) => {

    app.get('/quests', async (req, res, next) => {
        try {

            let quests = await Quests.find();

            res.status(200).send(quests);

        }
        catch (err) {
            next(err);
        }
    });
}