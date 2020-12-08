const router = require("express").Router();
const thoughtRoutes = require("./thought-routes");
const userRoutes = require("./user-routes");

// add prefix of `/thoughts` to routes created in `routes/api/thought-routes.js`
router.use("/thoughts", thoughtRoutes);
// add prefix of `/users` to routes created in `routes/api/user-routes.js`
router.use("/users", userRoutes);

module.exports = router;
