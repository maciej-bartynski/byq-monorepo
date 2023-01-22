const jwt = require('express-jwt').expressjwt;
const jwksRsa = require('jwks-rsa');
const EnvsService = require('../EnvsService');

const AuthService = {
    checkJwt: (req, res, next) => {
        next();
    },

    config(authConfig) {
        if (EnvsService.env.HTTPS) {
            this.checkJwt = jwt({
                secret: jwksRsa.expressJwtSecret({
                    cache: true,
                    rateLimit: true,
                    jwksRequestsPerMinute: 5,
                    jwksUri: `${authConfig.AUTH0_DOMAIN}/.well-known/jwks.json`
                }),
                audience: authConfig.audience,
                issuer: `${authConfig.AUTH0_DOMAIN}/`,
                algorithms: ['RS256'],
            })
        }
    }
}

module.exports = AuthService;