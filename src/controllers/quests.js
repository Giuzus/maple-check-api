const Quests = require('../models/questModel');
const CompletedQuests = require('../models/completedQuestModel');
const DateHelpers = require('../helpers/date-helpers');

const weeklyResetDay = 1; //monday;

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

            let startOfWeek = DateHelpers.GetStartOfWeek(date, weeklyResetDay);
            let endOfWeek = DateHelpers.GetEndOfWeek(startOfWeek);

            console.log(`Get quests`);
            console.log(`Date: ${date}`);
            console.log(`User: ${req.googleUser.name}(${req.googleUser.id})`);

            let completedQuests = await CompletedQuests.aggregate([
                {
                    $lookup: {
                        from: "quests",
                        localField: "quest",
                        foreignField: "_id",
                        as: 'quest'
                    }
                },
                {
                    $unwind: '$quest'
                },
                {
                    $match: {
                        userId: req.googleUser.id,
                        $or: [{
                            completeDate: date,
                            'quest.type': 'DAILY'
                        },
                        {
                            completeDate: { $gte: startOfWeek, $lte: endOfWeek },
                            'quest.type': 'WEEKLY'
                        }]
                    }
                }
            ]);


            let result = quests.map(quest => {
                let ret = { ...quest._doc }

                ret.completed = completedQuests.some(completed => completed.quest._id.equals(quest._id))
                return ret;
            });

            res.status(200).send(result);
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
                    quest: req.body.id,
                    completeDate: date
                });
            }
            else {
                //delete completed quest for day
                await CompletedQuests.findOneAndDelete({
                    userId: req.googleUser.id,
                    quest: req.body.id,
                    completeDate: date
                });
            }

            return res.status(200).send("Success");

        } catch (err) {
            next(err);
        }

    });

}

