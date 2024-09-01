const jwt = require('jsonwebtoken');


// A middleware function for checking if an user is authorised based on their bearer token
function authorisation(req, res, next) {

	// Checks if authorisation extists in the headers of the request
	if (!(req.headers.authorization)) {
		res.status(401).json({
			error: true,
			message: "Authorization header ('Bearer token') not found",
		});
		return;
	}

	const authorizationHeader = req.headers.authorization;
	// Check if authorisation header matches the Bearer token pattern
	if (!authorizationHeader.match(/^Bearer /)) {
		res.status(401).json({ error: true, message: "Authorization header is malformed" });
		return;
	}
	
	// Extracts the token out of the header
	const token = req.headers.authorization.replace(/^Bearer /, '');
	try {
		// Verifies the token
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		// If token is verified, currentUser is set as the value returned from verify
		req.currentUser = decoded;
	} catch (e) {
		if (e.name === 'TokenExpiredError')
		{
			res.status(401).json({ error: true, message: 'JWT token has expired' });
		} 
		else 
		{
			res.status(401).json({ error: true, message: 'Invalid JWT token' });
		}
		return;
	}

	// Goes to the next middleware function
	next();
}
module.exports = authorisation;
