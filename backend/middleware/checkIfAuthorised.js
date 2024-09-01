const jwt = require('jsonwebtoken');


// A middlware for checking if a user is authorised
function checkIfAuthorised(req, res, next) {
	if (req.headers.authorization) {
		const authorizationHeader = req.headers.authorization;
        // Check if Authorization header matches the Bearer token pattern
        if (!authorizationHeader.match(/^Bearer /)) {
            res.status(401).json({ error: true, message: "Authorization header is malformed" });
            return;
        }

		// Extracts the token out of authorisation header
		const token = req.headers.authorization.replace(/^Bearer /, '');
		try {
			// Verifies the token
			const currentUser = jwt.verify(token, process.env.JWT_SECRET);
			// If verified intialisaes the necessary variables
			req.isAuthorised = true;
			req.currentUser = currentUser;
		} 
		// Catches any errors occuring from the verify method
		catch (e) 
		{
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
	}
	else
	{
		req.isAuthorised = false;
	}
	next();

}



module.exports = checkIfAuthorised;