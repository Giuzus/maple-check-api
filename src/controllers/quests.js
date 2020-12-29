const Quests = require('../models/questModel');

const CompletedQuests = require('../models/completedQuestModel');

module.exports = (app) => {

    app.get('/quests/:date', async (req, res, next) => {
        try {

            let quests = await Quests.find();
            let date = null;
            if (req.params.date) {
                date = new Date(req.params.date);
            }
            else {
                date = new Date();
            }
            date.setHours(0, 0, 0, 0);

            console.log(`Get quests`);
            console.log(`Date: ${date}`);
            console.log(`User: ${req.googleUser.name}(${req.googleUser.id})`);

            let completedQuests = await CompletedQuests.find({
                userId: req.googleUser.id,
                completeDate: date
            });

            quests = quests.map(quest => {
                quest.completed = completedQuests.some(completed => completed.questId == quest._id)

                return quest;
            });

            res.status(200).send(quests);

        }
        catch (err) {
            next(err);
        }
    });

    app.post('/quests/changestate', async (req, res, next) => {

        try {

            if (typeof req.body.id === 'undefined'
                || typeof req.body.completed === 'undefined'
                || typeof req.body.date === 'undefined')
                return res.send(400, "Invalid parameters");

            let date = null;
            if (req.body.date) {
                date = new Date(req.body.date);
            }
            else {
                date = new Date();
            }

            date.setHours(0, 0, 0, 0);

            console.log(`Change quest state`);
            console.log(`Date: ${date}`);
            console.log(`User: ${req.googleUser.name}(${req.googleUser.id})`);
            console.log(`Quest: ${req.body.id}`);
            console.log(`Completed: ${req.body.completed}`);

            if (req.body.completed) {
                //add new completed quest for day   
                await CompletedQuests.create({
                    userId: req.googleUser.id,
                    questId: req.body.id,
                    completeDate: date
                });
            }
            else {
                //delete completed quest for day
                await CompletedQuests.findOneAndDelete({
                    userId: req.googleUser.id,
                    questId: req.body.id,
                    completeDate: date
                });
            }
        } catch (err) {
            next(err);
        }

    });

}