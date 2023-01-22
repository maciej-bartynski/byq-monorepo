const express = require('express');
const http = require('http');
const cors = require('cors');
const router = require('./routes/router');
const workspaceRouter = require('./routes/workspaceRouter');
const bodyParser = require('body-parser');
const DbService = require('./services/DbService');
const AccessService = require('./services/AccessService');

function App() {
    const app = express();
    const port = process.env.PORT;
    app.use(cors());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    DbService.connectDb();
    app.use(
        '/api/:userId/workspace/:workspaceId',
        AccessService.checkUserApiAccess,
        AccessService.checkWorkspaceApiAccess,
        workspaceRouter
    )

    app.use(
        '/api/:userId',
        AccessService.checkUserApiAccess,
        router
    )

    http.createServer(undefined, app).listen(port, () => {
        console.log(`Listening on port ${port}, server HTTP`)
    })
}

module.exports = App;