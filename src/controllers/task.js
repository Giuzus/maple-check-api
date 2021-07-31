const Tasks = require('../models/taskModel');
const CompletedTasks = require('../models/completedTaskModel');
const DateHelpers = require('../helpers/date-helpers');

const weeklyQuestResetDay = 1; //monday;
const weeklyBossResetDay = 4; //thursday;

const QUEST_TYPE = 'QUEST';
const BOSS_TYPE = 'BOSS';

module.exports = (app) => {

    app.get('/tasks/day/:date', async (req, res, next) => {
        try {

            let date = null;
            if (req.params.date) {
                date = new Date(Number(req.params.date));
                if (date == "Invalid Date") {
                    return res.status(400).send('Invalid date');
                }
            }
            else {
                date = new Date();
            }
            date.setHours(0, 0, 0, 0);

            let weeklyResetDay = type == QUEST_TYPE ? weeklyQuestResetDay : weeklyBossResetDay;

            let startOfWeek = DateHelpers.GetStartOfWeek(date, weeklyResetDay);
            let endOfWeek = DateHelpers.GetEndOfWeek(startOfWeek);

            

            let tasks = await Tasks.find();
            let completedTasks = await CompletedTasks.aggregate([
                {
                    $lookup: {
                        from: "tasks",
                        localField: "task",
                        foreignField: "_id",
                        as: 'task'
                    }
                },
                {
                    $unwind: '$task'
                },
                {
                    $match: {
                        userId: req.googleUser.id,
                        $or: [{
                            completeDate: date,
                            'task.repeats': 'DAILY'
                        },
                        {
                            completeDate: { $gte: startOfWeek, $lte: endOfWeek },
                            'task.repeats': 'WEEKLY'
                        }]
                    }
                }
            ]);


            let result = tasks.map(task => {
                let ret = { ...task._doc }

                ret.completed = completedTasks.some(completed => completed.task._id.equals(quest._id))
                return ret;
            });

            res.status(200).send(result);
        }
        catch (err) {
            next(err);
        }
    });

    app.post('/tasks/changestate', async (req, res, next) => {

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

            if (req.body.completed) {
                //add new completed task for day   
                await CompletedTasks.create({
                    userId: req.googleUser.id,
                    task: req.body.id,
                    completeDate: date
                });
            }
            else {
                //delete completed quest for day
                await CompletedTasks.findOneAndDelete({
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

    app.get('/tasks', async (req, res, next) => {
        try {
            let tasks = await Tasks.find({
                $or: [{default: true}, { userId: req.googleUser.id }]
            });

            return res.status(200).send(tasks);
        } catch (err) {
            next(err);
        }
    });

    app.get('/tasks/:id', async (req, res, next) => {
        try {

            let taskId = req.params.id;

            let task = await Tasks.findById(taskId);
            return res.status(200).send(task);
        } catch (err) {
            next(err);
        }
    });

    app.post('/tasks', async (req, res, next) => {
        try {
            let task = req.body;
            task.default = false;
            task.userId = req.googleUser.id;

            let createdTask = await Tasks.create(task);
            return res.status(201).send(createdTask);
        } catch (err) {
            next(err);
        }
    });

    app.put('/tasks', async (req, res, next) => {
        try {
            let task = req.body;
            task.default = false;

            task = new Tasks(task);

            let error = task.validateSync();
            if (error) {
                res.status(400).send(error.message);
            }

            let query = await Tasks.findOneAndUpdate({ _id: task._id }, task, { useFindAndModify: false });
            let updatedTask = await Tasks.findById(task._id);

            return res.status(200).send(updatedTask);
        } catch (err) {
            next(err);
        }
    });

    app.delete('/tasks', async (req, res, next) => {
        try {
            let taskId = req.body.id;

            if (!taskId) {
                res.status(400).send("Task ID required");
            }

            let task = await Tasks.findById(taskId);

            if (task.default) {
                return res.status(400).send("Can't delete default tasks");
            }

            let deletedTask = await Tasks.deleteOne({ _id: taskId });
            if (deletedTask.deletedCount > 0) {
                res.status(204);
            }
            else {
                res.status(404);
            }

            res.send();
        } catch (err) {
            next(err);
        }
    });

}

