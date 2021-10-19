const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send("Le serveur est prêt et fonctionnel!");
})

module.exports = router;