const express = require('express');
const router = express.Router();

// Get route for fetching student information
router.get('/', function(req, res, next) {
    res.status(200).json({ name : "Junseo Pyun", student_number : "n11736062"});
});



module.exports = router;