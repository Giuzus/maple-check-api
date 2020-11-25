const { google } = require('googleapis');
const config = require('../../configuration')

const scopes = [
    'https://www.googleapis.com/auth/userinfo.profile'
];

const oauth2Client = new google.auth.OAuth2(
    config.GoogleClientID,
    config.GoogleSecret,
    config.GoogleRedirectUrl
);

const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes
});

module.exports = (app) => {
    
    app.get('/auth/callback', async function(req, res){
        
        let code = req.query.code;

        let { tokens } = await oauth2Client.getToken(code)
        
        res.cookie('auth', tokens);
        
        res.redirect('/')
    });
    
    app.use((req, res, next) => {

        let authCookie = req.cookies['auth'];

        oauth2Client.setCredentials({ access_token: authCookie.access_token });

        var oauth2 = google.oauth2({
            auth: oauth2Client,
            version: 'v2'
        });

        oauth2.userinfo.get(
            function (err, userInfo) {
                if (err) {
                    return res.redirect(url);
                }
                
                req.googleUser = userInfo.data;

                return next();
            });
    });
    
}