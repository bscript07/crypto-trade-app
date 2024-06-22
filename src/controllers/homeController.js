const router = require("express").Router();
const Crypto = require("../models/Crypto");
router.get("/", (req, res) => { 
    res.render("home");
});

router.get("/search", async (req, res) => {
    const name = req.query.name || "";
    const cryptos = await Crypto.find({ name: { $regex: name, $options: "i" },}).lean();

    res.render("search", { cryptos });
});

module.exports = router;