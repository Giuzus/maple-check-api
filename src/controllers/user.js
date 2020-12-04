

module.exports = (app) => {

    app.get('/user', (req, res, next) => {

        try {
            let user = req.googleUser;

            res.status(200).send(user);
        }
        catch (err) {
            next(err);
        }

    });

}