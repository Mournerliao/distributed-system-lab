const express = require('express');
const expressWs = require('express-ws');
const router = express.Router();
const wsController = require('../Controllers/websocket');

expressWs(router);

router.ws('/', wsController.listen);

module.exports = router;
