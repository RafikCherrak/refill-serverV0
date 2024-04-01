const express = require('express');
const router = express.Router();

router.get('/utilisateurs', list);
router.post('/utilisateurs', create);
router.put('/utilisateurs/:id', update);
router.delete('/utilisateurs/:id', remove);

module.exports = router;