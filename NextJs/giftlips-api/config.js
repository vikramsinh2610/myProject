module.exports =
    {
        AUTH0_CONFIG: {
            authRequired: false,
            auth0Logout: true,
            secret: process.env.AUTH0_CLIENT_SECRET,
            baseURL: process.env.AUTH0_BASE_URL,
            clientID: process.env.AUTH0_CLIENT_ID,
            issuerBaseURL: process.env.AUTH0_DOMAIN
        }
    }
