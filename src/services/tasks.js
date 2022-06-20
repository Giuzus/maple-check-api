const Tasks = require('../models/taskModel');


module.exports = class TaskService {
    async getUserTasks(userId)
    {
        let tasks = await Tasks.find({
            $or: [{ default: true }, { userId: userId }]
        });

        ArrayHelpers.sort(tasks);

        return tasks;
    }
}