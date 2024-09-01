const express = require('express');
const router = express.Router();
const checkVolcanoId = require("../middleware/checkVolcanoId");
const authorisation = require("../middleware/authorisation");


// Post endpoint for rating volcano
router.post('/rating/:id', authorisation, checkVolcanoId, function(req, res, next){
    const id = req.params.id;
    const currentUser = req.currentUser;

    // Checks if rating exists in the request body, if not sends error
    if (!req.body.rating) {
        res.status(400).json({ error : true, message: `Request body incomplete, rating is required.` });
        return;
    }

    // Checks if rating in body is a number or not
    if(isNaN(req.body.rating))
    {
        res.status(400).json({error : true, message : 'Rating should be a number.'})
        return;
    }
    // Parses rating extracted from body to an int type
    const parsedRating = parseFloat(req.body.rating);

    // Checks if rating is between 1 to 5
    if(parsedRating > 5 || parsedRating < 1)
    {
        res.status(400).json({error : true, message : 'Rating should be between 1 to 5.'})
        return;
    }

    // Queries the database 
    req.db
        .from('ratings')
        .where('volcano_id', id)
        .andWhere('username', currentUser.email)
        .then(rows => {
            // If user has already rated selected volcano, then throws error
            if (rows.length > 0) {
                throw new Error('User already rated this volcano.');
            }
            // If user has not rated yet, insert the rating into database
            return req.db.from('ratings').insert({ rating: parsedRating, username: currentUser.email, volcano_id: id });
        })
        .then(() => {
            res.status(201).json({ message: `Successfully rated volcano with id ${id}.` });
        })
        // Catch any error occuring from database
        .catch(error => {
            if(error.message === 'User already rated this volcano.')
            {
                res.status(409).json({error : true, message: error.message });
            }
            else res.status(500).json({error : true, message: error.message });
        });   
});


// Post route for commenting on a volcano 
router.post('/comment/:id', authorisation, checkVolcanoId, function(req, res, next){
    const id = req.params.id;
    const currentUser = req.currentUser;

    // Checks if comment in body exists
    if (!req.body.comment) {
        res.status(400).json({ error : true, message: `Request body incomplete, comment is required.`});
        return;
    }

    // Extract comment from body
    const {comment} = req.body;
    req.db
        // Insert comment with the given username and volcano id
        .from("comments")
        .insert({comment : comment, username : currentUser.email, volcano_id : id})
        .then(_ => {
            res.status(201).json({ message: `Successfully commented on the volcano with id ${id}.` });
            })
        // Catch any error occuring within the database
        .catch(error => {
            res.status(500).json({error : true, message: error.message });
        });
    
});

// Get route for fetching average rating for a volcano with the provided id
router.get('/rating/:id', checkVolcanoId, function(req, res, next){
    const id = req.params.id;
    req.db
    .from("ratings")
    .select("rating")
    // .avg("rating as average_rating")
    .where("volcano_id", '=', id)
    .then(ratings =>{

        // If there is no rating average_rating is set to 0 and returned
        if(ratings.length === 0)
        {
            res.status(200).json({average_rating : 0});
            return;
        }
        
        // Calculates the sum of the ratings
        ratings = ratings.map(e=>e.rating);
        let sum = 0;
        for(let i = 0; i < ratings.length; i++)
        {
            sum+=ratings[i];
        }
        // get average of ratings
        const average = Math.round((sum / ratings.length)*100)/100;
        res.status(200).json({average_rating : average});
    })
    .catch(error => {
        res.status(500).json({error : true, message: error.message });
    });
});

// Get route for fetching comments for a volcano with the provided id
router.get('/comment/:id', checkVolcanoId, function(req, res, next) {
    // Extracts vocalno id and request type


    if((Object.keys(req.query).length > 2) || (Object.keys(req.query).length == 2 && !req.query.username && !req.query.sortby))
    {
        res.status(400).json({error : true, message : "Invalid query parameters. Only sortBy and username are permitted."});
        return;
    }

    // Query parameters to allow users to sort comments by newest and by username
    const username = req.query.username;
    const sortBy = req.query.sortBy || 'ACS';
    const id = req.params.id;

    let query = req.db.from("comments").select('comment', 'time', 'username');

    if(username)
    {
        query = query.where('volcano_id', '=', id).where('username', '=', username);
    }
    else
    {
        query = query.where("volcano_id", '=', id);
    }
    query
    .orderBy('time', sortBy)
    .then(comments =>{
        res.status(200).json(comments)
    })
    .catch(error => {
        res.status(500).json({error : true, message: error.message });
    });
});


module.exports = router;