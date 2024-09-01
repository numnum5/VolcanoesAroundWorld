const express = require('express');
const router = express.Router();

// Get route for /volcanoes which fetches volcanoes given country in the query 
router.get('/', function (req, res, next) {

	// Checks if country property exists in the reqeust query
	if(!req.query.country)
	{
		res.status(400).json({error : true, message  : "Country is a required query parameter."});
		return;
	}

	// Checks if queries exceed more than 2 as well as if the second query property is populatedWithin
	if((Object.keys(req.query).length > 2) || (Object.keys(req.query).length === 2 && req.query.populatedWithin === undefined))
	{
		res.status(400).json({error : true, message : "Invalid query parameters. Only country and populatedWithin are permitted."});
		return;
	}

	// If populatedWithin query parameter exists,
    if(req.query.populatedWithin === undefined)
    {
        req.db
		.from('data')
		.select('id', 'name', 'country', 'region', 'subregion')
		.where('country', req.query.country)
		.orderBy('id', 'ASC')
		.then((rows) => {
			res.status(200).json(rows);
		})
		// Catches any errors occuring within the database
		.catch((e) => {
			res.status(500).json({ error: true, message: e.message });
		});
    }
    else
    {

		const allowedValues = ['5km', '10km', '30km', '100km'];
		// Check if populatedWithin is provided and is one of the allowed values
		if (!allowedValues.includes(req.query.populatedWithin)) {
			res.status(400).json({
				error: true,
				message: "Invalid value for populatedWithin. Only: 5km, 10km, 30km, 100km are permitted"
			});
			return;
		}
		
		// Selects volcanoes based on the given country and where populatedWithin value is not equal to 0
        req.db
			.from('data')
			.select('id', 'name', 'country', 'region', 'subregion')
			.where('country', req.query.country)
			.whereNot(`population_${req.query.populatedWithin}`, 0)
			.orderBy('id', 'ASC')
			.then((rows) => {
				res.status(200).json(rows); 
			})
			// Catches any errors occuring within the database
			.catch(e => {
				res.status(500).json({ error: true, message: e.message });
			});
    }

});



module.exports = router;
