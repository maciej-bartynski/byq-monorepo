const express = require('express');
const router = require('express').Router();
const cors = require('cors');
const http = require('http');
const otherUsers = require('./other-users.json');
const me = require('./me.json');

const app = express();
app.use(cors());

router.get('/v2/users', async function (req, res) {
    return res.status(200).json(otherUsers)
});
router.get('/v2/me', async (req, res) => {
    return res.status(200).json(me)
});
router.get('/v2/access-token', async function (req, res) {
    return res.status(200).send("token.1234567890");
});

app.use('/api', router)

const port = 4040;
const server = http.createServer(undefined, app);

server.listen(port, () => {
    console.log(`Listening on port ${port}, server HTTP`)
})