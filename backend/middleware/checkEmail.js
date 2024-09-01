
// A middleware function for checking if email in the parameter is exists in the database
function checkEmail(req, res, next)
{
    const email = req.params.email;
    req.db
        .from('users')
        .select('*')
        .where('email', '=', email)
        .then((users)=>{
            // If user with given email address does not exist in the database
            if(users.length === 0)
            {
                throw new Error('User not found');
            }
            next();
        })
        .catch(e=>{
            if(e.message === 'User not found')
            {
                res.status(404).json({error : true, message : e.message})
            }
            else
            {
                res.status(500).json({error : true, message : e.message})
            }
        });
    
}

module.exports = checkEmail;