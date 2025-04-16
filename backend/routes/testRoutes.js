const express = require('express');
const { createTest,getTestInfo,deleteTestHistory } = require('../Controller/testController');

const router = express.Router();

router.post('/create', createTest);

router.post('/getInfo',getTestInfo)

router.delete('deleteHistory',deleteTestHistory)

module.exports = router;
