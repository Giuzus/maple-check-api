const Characters = require('../models/characterModel');
const DateHelpers = require('../helpers/date-helpers');


module.exports = (app) => {

    app.get('/characters', async (req, res, next) => {
        try {
            let characters = await Characters.find({userId: req.googleUser.id});
            return res.status(200).send(characters);
        } catch (err) {
            next(err);
        }
    });

    app.post('/characters', async (req, res, next) => {
        try {
            let character = req.body;
            
            character.userId = req.googleUser.id;

            let createdCharacter = await Characters.create(character);
            return res.status(201).send(createdCharacter);
        } catch (err) {
            next(err);
        }
    });

    app.put('/characters', async (req, res, next) => {
        try {
            let character = req.body;
            character = new Characters(character);
            character.userId = req.googleUser.id;

            let error = character.validateSync();
            if (error) {
                res.status(400).send(error.message);
            }

            let currentCharacter = await Characters.findById(character._id);
            if(currentCharacter.userId != req.googleUser.id)
            {
                res.status(400).send("Can't edit character");
            }

            await Characters.findOneAndUpdate({ _id: character._id }, character, { useFindAndModify: false });
            let updatedCharacter = await Characters.findById(character._id);

            return res.status(200).send(updatedCharacter);
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

