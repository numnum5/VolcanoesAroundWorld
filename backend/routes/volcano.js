const express = require('express');
const router = express.Router();
const checkIfAuthorised = require("../middleware/checkIfAuthorised");
const checkVolcanoId = require("../middleware/checkVolcanoId");
const checkQueryParameters = require("../middleware/checkQueryParameters");


// Get route for fetching individual volcano data
router.get('/:id', checkQueryParameters, checkIfAuthorised, checkVolcanoId, function (req, res, next) {
	
	const id = req.params.id;

	// Builds query based on the authroisation of current user
	let query = req.db.from('data');
    if(req.isAuthorised === true)
    {
		// Selects all columns for authenticated users
		query = query.select('*');
    }
	else
	{
		// Selects columns for unauthenticated users
		query = query.select('id', 'name', 'country', 'region', 'subregion', 'last_eruption', 'summit', 'elevation', 'latitude', 'longitude');

	}
	query.where('id', '=', id)
	.then((volcanoes) => {
		res.status(200).json(volcanoes[0]);
	})
	.catch((e) => {
		res.status(500).json({ error: true, message: e.message });
	});
});


module.exports = router;