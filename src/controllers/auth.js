const { google } = require('googleapis');
const config = require('../../configuration')


const scopes = [
    'https://www.googleapis.com/auth/userinfo.profile'
];



module.exports = (app) => {

    app.get('/auth/authUrl', async function (req, res) {

        let redirect = req.query['redirect'];

        if (!redirect)
            return res.status(400).send('No redirect url');

        let oauth2Client = new google.auth.OAuth2(
            config.Google.ClientID,
            config.Google.Secret,
            redirect
        );

        let authUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes,
            redirect_uri: redirect
        });

        res.status(200).send(authUrl);
    });

    app.post('/auth/getToken', async function (req, res, next) {

        try {


            let code = req.body.code;
            let redirect = req.body.redirect;

            let oauth2Client = new google.auth.OAuth2(
                config.Google.ClientID,
                config.Google.Secret,
                redirect
            );

            let { tokens } = await oauth2Client.getToken(code)

            res.cookie('auth', tokens);

            res.status(200).send('Auth success');
        }
        catch (err) {
            next(err)
        }
    });

}