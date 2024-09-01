// A middleware function for checking if any queries exist in the url
function checkQueryParameters(req, res, next)
{
    // Checks if query parameters exist
	if(Object.keys(req.query).length > 0)
    {
        res.status(400).json({error: true, message: "Invalid query parameters. Query parameters are not permitted."})
    }
    next();
}

module.exports = checkQueryParameters;