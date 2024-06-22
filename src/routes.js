const router = require("express").Router();

const homeController = require("./controllers/homeController");
const authController = require("./controllers/authController");
const cryptosController = require("./controllers/cryptosController");

router.use("/", homeController);
router.use("/auth", authController);
router.use("/cryptos", cryptosController);

router.all("*", (req, res) => {
    res.render("404");
});

module.exports = router;