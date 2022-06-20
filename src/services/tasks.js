const Tasks = require('../models/taskModel');
const ArrayHelpers = require('../helpers/array-helpers');

module.exports = class TaskService {
    static async getUserTasks(userId)
    {
        let tasks = await Tasks.find({
            $or: [{ default: true }, { userId: userId }]
        });

        ArrayHelpers.sort(tasks);

        return tasks;
    }
}