const Bosses = require('../models/bossModel');
const CompletedBosses = require('../models/completedBossModel');
const DateHelpers = require('../helpers/date-helpers');

const weeklyResetDay = 4; //thursday;

module.exports = (app) => {

    app.get('/bosses/:date', async (req, res, next) => {
        try {

            let bosses = await Bosses.find();
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

            console.log(`Get bosses`);
            console.log(`Date: ${date}`);
            console.log(`User: ${req.googleUser.name}(${req.googleUser.id})`);

            let completedBosses = await CompletedBosses.aggregate([
                {
                    $lookup: {
                        from: "bosses",
                        localField: "boss",
                        foreignField: "_id",
                        as: 'boss'
                    }
                },
                {
                    $unwind: '$boss'
                },
                {
                    $match: {
                        userId: req.googleUser.id,
                        $or: [{
                            completeDate: date,
                            'boss.type': 'DAILY'
                        },
                        {
                            completeDate: { $gte: startOfWeek, $lte: endOfWeek },
                            'boss.type': 'WEEKLY'
                        }]
                    }
                }
            ]);


            let result = bosses.map(boss => {
                let ret = { ...boss._doc };
                ret.completed = completedBosses.some(completed => completed.boss._id.equals(boss._id))
                return ret;
            });

            res.status(200).send(result);
        }
        catch (err) {
            next(err);
        }
    });

    app.post('/bosses/changestate', async (req, res, next) => {

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

            console.log(`Change boss state`);
            console.log(`Date: ${date}`);
            console.log(`User: ${req.googleUser.name}(${req.googleUser.id})`);
            console.log(`Boss: ${req.body.id}`);
            console.log(`Completed: ${req.body.completed}`);

            if (req.body.completed) {
                //add new completed quest for day   
                await CompletedBosses.create({
                    userId: req.googleUser.id,
                    boss: req.body.id,
                    completeDate: date
                });
            }
            else {
                //delete completed quest for day
                await CompletedBosses.findOneAndDelete({
                    userId: req.googleUser.id,
                    boss: req.body.id,
                    completeDate: date
                });
            }

            return res.status(200).send("Success");

        } catch (err) {
            next(err);
        }

    });

}

