module.exports = {
    Environment: process.env.ENVIRONMENT,
    Google: {
        ClientID: process.env.GOOGLE_CLIENT_ID,
        Secret: process.env.GOOGLE_SECRET,
        RedirectUrl: process.env.REDIRECT_URL,
    },
    Mongo: {
        URI: process.env.MONGO_URI
    },
    CORS: {
        origin: process.env.CORS_ORIGIN
    }
}