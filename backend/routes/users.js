// Imports
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const authorisation = require("../middleware/authorisation");
const checkIfAuthorised = require("../middleware/checkIfAuthorised");
const checkEmail = require("../middleware/checkEmail");
const bodyCheck = require("../middleware/bodyCheck");


// Acquire Jwt secret key
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;



// Post route for login
router.post('/login', bodyCheck, function (req, res, next) {
	// Gets the email and password from the request object
	const email = req.body.email;
	const password = req.body.password;

	// Creates query to see if users with given email exist in the database
	const queryUser = req.db.from('users').select('*').where('email', '=', email);
	queryUser
	.then((users) => {
		// if user does not exist in the database
		if (users.length === 0) {
			throw new Error('Incorrect email or password');
		}

		// Compare password hashes
		const user = users[0];
		return bcrypt.compare(password, user.hash);
	})
	.then((match) => {
		// If password does not match throw error
		if (!match) {
			throw new Error('Incorrect email or password');
		}

		// Sets the expiry data in 24 hours
		const expires_in = 60 * 60 * 24;
		const exp = Math.floor(Date.now() / 1000) + expires_in;

		// Signs the token with the secrete key
		const token = jwt.sign({ email, exp }, JWT_SECRET);
		res.status(200).json({
			token,
			token_type: 'Bearer',
			expires_in,
		});
	})
	.catch(e=>{
		if(e.message === 'Incorrect email or password')
		{
			res.status(401).json({ error : true, message: e.message})				
		}
		else
		{
			res.status(500).json({ error : true, message: e.message})		
		}
	});
});




router.get('/:email/profile', checkIfAuthorised, checkEmail, function(req, res, next)
{
	const email = req.params.email;
	if(req.isAuthorised === true && email === req.currentUser.email)
	{
		req.db
		.from('users')
		.select("email", "firstName", "lastName","dob", "address")
		.where('email', '=', email)
		.then(data=>{
			res.status(200).json(data[0]);
		})
		.catch(e=>{
			res.status(500).json({ error : true, message : e.message});
		});
	}
	else
	{
		req.db
		.from('users')
		.select("email", "firstName", "lastName")
		.where('email', '=', email)
		.then(data=>{
			res.status(200).json(data[0]);
		})
		.catch(e=>{
			res.status(500).json({ error : true, message : e.message});
		});
	}
});

// Put route for updating user profile with the provided email in the url parameter
router.put('/:email/profile', authorisation, function(req, res, next) {
	// Checks if firstName, lastName, dob, and address exist in the request body
	if (!req.body.firstName || !req.body.lastName || !req.body.dob || !req.body.address){
		res.status(400).json({ error : true, message: "Request body incomplete: firstName, lastName, dob and address are required."});
		return;
	}

	// Checks if properties in the req.body is of type string
	if(typeof req.body.firstName !== 'string' || typeof req.body.lastName !== 'string' || typeof req.body.address !== 'string')
	{
		res.status(400).json({ error : true, message: "Request body invalid: firstName, lastName and address must be strings only."});
		return;
	}
	const email = req.params.email;

	// Checks if the email in the paramter is the same one as the bearer token
	if(req.currentUser.email !== email)
	{
		res.status(403).json({ error : true, message: "Forbidden"});
		return;
	}

	// Checks for valid date format for dob
	if(!isValidDateFormat(req.body.dob))
	{
		res.status(400).json({ error : true, message: "Invalid input: dob must be a real date in format YYYY-MM-DD."});
		return;
	}
	
	// Checks if dob is in the past
	if(!isDateInThePast(req.body.dob))
	{
		res.status(400).json({ error : true, message: "Invalid input: dob must be a date in the past."});
		return;
	}

	
	const extractedData = req.body;

	
	req.db
		.from('users')
		.where('email', email)
		.update(extractedData)
		.then(_ => {
			res.status(200).json({email : email, ...extractedData}); 
		})
		.catch((e) => {
			res.status(500).json({ error: true, message: e.message });
		});

});


// Post route for registering user
router.post('/register', bodyCheck, function (req, res, next) {
	const email = req.body.email;
	const password = req.body.password;

	const queryUsers = req.db.from('users').select('*').where('email', '=', email);
	queryUsers
		.then((users) => {

			// Checks if user exists in the database
			if (users.length > 0) {
				throw new Error('User already exists');
			}
			
			// Insert user into DB
			const saltRounds = 10;
			const hash = bcrypt.hashSync(password, saltRounds);

			// Returns insert query for further chaining
			return req.db.from('users').insert({ email, hash });
		})
		.then(() => {
			res.status(201).json({message: 'User created' });
		})
		// Catches any errors occuring within database
		.catch((e) => {
			if(e.message === 'User already exists')
			{
				res.status(409).json({ error: true, message: e.message });
			}
			else
			{
				res.status(500).json({ error: true, message: e.message });
			}
		});
});





const isValidDateFormat = (dateString) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;

    // Check if the date string matches the expected format
    if (!regex.test(dateString)) {
        return false;
    }

	const [year, month, day] = dateString.split('-').map(Number);

    // Determine the maximum number of days for the given month and year
    const maxDaysInMonth = new Date(year, month, 0).getDate();

    // Check if the parsed day is within the valid range for the given month and year
    if (day < 1 || day > maxDaysInMonth) {
        return false;
    }
	const date = new Date(dateString);
	const date2 = new Date(year, month - 1, day);
    return date instanceof Date && date2 instanceof Date && !isNaN(date) && !isNaN(date2);
};

const isDateInThePast = (dateString) => {
    // Create a Date object for the given date string
    const givenDate = new Date(dateString);
    
    // Get the current date
    const currentDate = new Date();
    
    // Compare the given date with the current date
    return givenDate < currentDate;
};
module.exports = router;
