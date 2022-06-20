const Characters = require('../models/characterModel');
const ArrayHelpers = require('../helpers/array-helpers');
const TaskService = require('../services/tasks')
const ObjectId = require('mongoose').Types.ObjectId;

module.exports = (app) => {

    app.get('/characters', async (req, res, next) => {
        try {
            let characters = await Characters.aggregate([
                {
                    $match: {
                        userId: req.googleUser.id
                    }
                }
            ]);

            ArrayHelpers.sort(characters);

            return res.status(200).send(characters);
        } catch (err) {
            next(err);
        }
    });

    app.get('/characters/:id', async (req, res, next) => {
        try {

            let characterId = req.params.id;

            let character = await Characters.aggregate([
                {
                    $match: {
                        _id: ObjectId(characterId),
                        userId: req.googleUser.id
                    }
                }
            ]);

            if (character.length == 0) {
                return res.status(404).send();
            }

            return res.status(200).send(character[0]);

        } catch (err) {
            next(err);
        }
    });

    app.post('/characters', async (req, res, next) => {
        try {
            let character = req.body;

            character.userId = req.googleUser.id;

            let tasks = await TaskService.getUserTasks(req.googleUser.id);

            character.configuration = {
                hidden: false,
                tasks: tasks.map((task,i)=> ({ task: task._id, hidden: false, priority: i}))
            }

            let createdCharacter = await Characters.create(character);

            createdCharacter = await Characters.aggregate([
                {
                    $match: {
                        _id: ObjectId(createdCharacter.id)
                    }
                }
            ]);

            return res.status(201).send(createdCharacter[0]);
        } catch (err) {
            next(err);
        }
    });

    app.put('/characters', async (req, res, next) => {
        try {
            let character = req.body;
            character = new Characters(character);
            character.userId = req.googleUser.id;

            if (!character?.configuration) {
                character.configuration = {
                    hidden: false,
                    tasks: []
                }
            }

            let error = character.validateSync();
            if (error) {
                res.status(400).send(error.message);
            }

            let currentCharacter = await Characters.findById(character._id);
            if (currentCharacter.userId != req.googleUser.id) {
                res.status(400).send("Can't edit character");
            }

            await Characters.findOneAndUpdate({ _id: character._id }, character, { useFindAndModify: false });


            let updatedCharacter = await Characters.aggregate([
                {
                    $match: {
                        _id: ObjectId(character.id)
                    }
                },
                {
                    $lookup: {
                        from: "classes",
                        localField: "class",
                        foreignField: "_id",
                        as: 'class'
                    }
                },
                {
                    $unwind: '$class'
                }
            ]);

            return res.status(200).send(updatedCharacter[0]);
        } catch (err) {
            next(err);
        }
    });

    app.delete('/characters', async (req, res, next) => {
        try {
            let characterId = req.body.id;

            if (!characterId) {
                res.status(400).send("Character ID required");
            }

            let character = await Characters.findById(characterId);

            if (character.userId != req.googleUser.id) {
                return res.status(400).send("Can't delete character");
            }

            let deletedCharacter = await Characters.deleteOne({ _id: characterId });
            if (deletedCharacter.deletedCount > 0) {
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

