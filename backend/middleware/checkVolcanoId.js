// Middleware that check if volcano id exists in the database
function checkVolcanoId(req, res, next)
{
    const id = req.params.id;

    // Searches the database for volcano with the id provided in the params
    req.db
    .from('data')
    .select('*')
    .where('id', '=', id)
    .then((volcano)=>{
        // If volcano with id does not exist
        if(volcano.length === 0)
        {
            throw new Error(`Volcano with ID: ${id} not found`)
        }
        next();
    })
    .catch(e=>{
        res.status(404).json({error : true, message : e.message});
    });
}

module.exports = checkVolcanoId;