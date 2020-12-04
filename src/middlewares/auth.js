const { google } = require('googleapis');
const config = require('../../configuration')

const oauth2Client = new google.auth.OAuth2(
    config.Google.ClientID,
    config.Google.Secret
);

module.exports = (app) => {

    app.use((req, res, next) => {

        let authCookie = req.cookies['auth'];

        if (!authCookie?.access_token) {
            return res.status(401).send();
        }

        oauth2Client.setCredentials({ access_token: authCookie.access_token });

        var oauth2 = google.oauth2({
            auth: oauth2Client,
            version: 'v2'
        });

        oauth2.userinfo.get(
            function (err, userInfo) {
                if (err) {
                    return res.status(401).send();
                }

                req.googleUser = userInfo.data;

                return next();
            });
    });

}