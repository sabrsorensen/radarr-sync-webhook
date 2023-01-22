const express = require('express');
const { sonarrSync, sonarrImportAll } = require('../sonarrSync.js');
const { getUrlParam } = require('../util');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { series: { id = '' } } = req.body;
    const profile = getUrlParam(req, 'profile');
    const response = await sonarrSync({ id, profile });
    res.send(response);
  } catch (e) {
    const message = 'Malformed webhook request';
    console.log(message, req.body);
    res.status(400).send(message);
  }
});

router.post('/all', async (req, res) => {
  const profile = getUrlParam(req, 'profile');
  const response = await sonarrImportAll({ profile });
  res.send(response);
});

router.post('/:id', async (req, res) => {
  const profile = getUrlParam(req, 'profile');
  const { id } = req.params;
  const response = await sonarrSync({ id, profile });
  res.send(response);
});

module.exports = router;
