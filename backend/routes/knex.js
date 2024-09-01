const express = require('express');
const router = express.Router();

// Get route for checking knex version
router.get("/", function (req, res, next) {
  req.db
    .raw("SELECT VERSION()")
    .then((version) => console.log(version[0][0]))
    .catch((err) => {
      console.log(err);
      throw err;
    });
  res.send("Version Logged successfully");
});

module.exports = router;
