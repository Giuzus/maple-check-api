const { google } = require('googleapis');
const config = require('../../configuration')


const scopes = [
    'https://www.googleapis.com/auth/userinfo.profile'
];



module.exports = (app) => {

    app.get('/auth/logout', async (req, res) => {
        let redirect = req.query['redirect'];

        res.cookie('auth');

        res.redirect(redirect);
    });


    app.get('/auth/authUrl', async (req, res) => {

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
            prompt: 'consent',
            scope: scopes,
            redirect_uri: redirect
        });

        res.status(200).send(authUrl);
    });

    app.post('/auth/getToken', async (req, res, next) => {

        try {
            console.log("get token")
            let code = req.body.code;
            console.log(`code: ${code}`)
            let redirect = req.body.redirect;
            console.log(`redirect: ${redirect}`)

            let oauth2Client = new google.auth.OAuth2(
                config.Google.ClientID,
                config.Google.Secret,
                redirect
            );

            
            let { tokens } = await oauth2Client.getToken(code)
            console.log(`access token: ${ tokens.access_token }`)
            console.log(`refresh token: ${ tokens.refresh_token }`)
            oauth2Client.setCredentials({ access_token: tokens.access_token, refresh_token: tokens.refresh_token });


            res.cookie('auth', tokens, {
                secure: true,
                sameSite: 'none',
            });

            res.status(200).send('Auth success');
        }
        catch (err) {
            next(err)
        }
    });

}