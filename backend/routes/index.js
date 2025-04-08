const express = require('express');
const control = require('../controllers/controller');

const router = express.Router();

// Example routes - candidates will need to adjust these based on their schema design
router.get('/data', control.getData);
router.get('/artists', control.getAllArtist);
router.get('/artist/:artistId', control.getArtistData);
router.get('/artist/id/:artistName', control.getArtistIdByName);

module.exports = router;
