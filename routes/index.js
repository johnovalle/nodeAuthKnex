const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
  res.render('../src/index');
});

router.get('/signup', (req, res) => {
  res.render('../src/signup');
});

module.exports = router;