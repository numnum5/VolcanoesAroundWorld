const express = require('express');
const router = express.Router();
const checkQueryParameters = require("../middleware/checkQueryParameters");

// Router for countries endpoint
router.get('/', checkQueryParameters, function(req, res, next){

	// Selects are the distinct countries from the volcanoes data
	req.db
		.from('data')
		.distinct('country')
		.orderBy('country', 'ASC')
		.then((rows) => {
			// Sends the data in an array
			rows = rows.map(e=>e.country)
			res.status(200).json(rows);  
		})
		.catch((e) => {
			// Catches any SQL related error 
			res.status(500).json({ error: true, message: e.message });
		});
});

module.exports = router;
