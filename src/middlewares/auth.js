const { google } = require('googleapis');
const config = require('../../configuration')

const scopes = [
    'https://www.googleapis.com/auth/userinfo.profile'
];

const oauth2Client = new google.auth.OAuth2(
    config.Google.ClientID,
    config.Google.Secret,
    config.Google.RedirectUrl
);

const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'online',
    scope: scopes
});

module.exports = (app) => {

    app.get('/auth/callback', async function (req, res) {

        let code = req.query.code;

        let { tokens } = await oauth2Client.getToken(code)

        res.cookie('auth', tokens);

        res.status(200).send('Auth success');
    });

    app.use((req, res, next) => {

        let authCookie = req.cookies['auth'];

        if (!authCookie?.access_token) {
            return res.status(401).send(authUrl);
        }

        oauth2Client.setCredentials({ access_token: authCookie.access_token });

        var oauth2 = google.oauth2({
            auth: oauth2Client,
            version: 'v2'
        });

        oauth2.userinfo.get(
            function (err, userInfo) {
                if (err) {
                    return res.status(401).send(authUrl);
                }

                req.googleUser = userInfo.data;

                return next();
            });
    });

}