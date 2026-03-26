
const express = require('express');

const router = express.Router();

const LookupRoute = require('./lookupRoute');

router.use('/', LookupRoute);

module.exports = router;