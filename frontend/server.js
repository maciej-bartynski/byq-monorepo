const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const https = require('https');
const http = require('http');
const proxy = require('express-http-proxy');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
const EnvsService = require('./services/EnvsService');
const AuthService = require('./services/AuthService');
const AuthManagementServiceSingleton = require('./services/AuthManagementService');
EnvsService.config(process.env);
const authConfig = {
    AUTH0_CLIENTID: EnvsService.env.AUTH0_CLIENTID,
    AUTH0_DOMAIN: EnvsService.env.AUTH0_DOMAIN,
    AUTH0_AUDIENCE: EnvsService.env.AUTH0_AUDIENCE,
    AUTH0_NODE_ENV: EnvsService.env.AUTH0_NODE_ENV
}
AuthService.config(authConfig);
const AuthManagementService = AuthManagementServiceSingleton.getInstance(authConfig);

const app = express();
const port = EnvsService.env.PORT;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use('/users', AuthService.checkJwt, AuthManagementService.fetchAuth0Users);

app.use('/api/v2/access-token', proxy(EnvsService.env.AUTH0_DOMAIN, {
    proxyReqPathResolver: function (req) {
        const domain = EnvsService.env.AUTH0_DOMAIN;
        const url = `${domain}${req.baseUrl}${req.url}`;
        return url
    }
}))

app.use('/api/v2/me', proxy(EnvsService.env.AUTH0_DOMAIN, {
    proxyReqPathResolver: function (req) {
        const domain = EnvsService.env.AUTH0_DOMAIN;
        const url = `${domain}${req.baseUrl}${req.url}`;
        return url
    }
}))

app.use('/api', AuthService.checkJwt, proxy(EnvsService.env.API_SERVER, {
    proxyReqPathResolver: function (req) {
        const domain = EnvsService.env.API_SERVER;
        const url = `${domain}${req.baseUrl}${req.url}`;
        return url
    }
}));

app.use('/env/env.json', function (req, res) {
    return res.status(200).json(authConfig)
})

app.use(express.static('./react-app/build'));

app.get('*', function (req, res) {
    res.sendFile(`${__dirname}/react-app/build/index.html`);
});

if (EnvsService.env.HTTPS) {
    https.createServer({
        key: fs.readFileSync(`./cert/private.key`),
        cert: fs.readFileSync(`./cert/certificate.crt`),
        ca: fs.readFileSync(`./cert/ca_bundle.crt`),
    }, app).listen(port, () => {
        console.log(`Listening on port ${port}, server HTTPS`)
    })
} else {
    http.createServer(undefined, app).listen(port, () => {
        console.log(`Listening on port ${port}, server HTTP`)
    })
}