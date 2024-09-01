
// A middleware function for checking if email and password exist in the body
function bodyCheck(req, res, next)
{
    const email = req.body.email;
    const password = req.body.password;

    // Checks if email and password properties exist in the body
    if (!email || !password) {
        res.status(400).json({
            error: true,
            message: "Request body incomplete, both email and password are required",
        });
        return;
    }
    next();
}
module.exports = bodyCheck;