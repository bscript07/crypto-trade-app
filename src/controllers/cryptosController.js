const router = require("express").Router();

const { isAuth } = require("../middleware/authMiddleware");
const { getErrorMessage } = require("../utils/errorUtils");
const cryptosService = require('../services/cryptosService');
const Crypto = require("../models/Crypto");
router.get("/", async (req, res) => {
    const cryptos = await cryptosService.getAll().lean();

    res.render("cryptos/catalog", { cryptos }); 
});

router.get("/:cryptoId/details", async (req, res) => {
    const cryptoId = req.params.cryptoId;
    const userId = req.user?._id;

    const crypto = await cryptosService.getOneDetailed(cryptoId, userId);
    const isOwner = crypto.owner && crypto.owner._id.equals(req.user?._id);

    res.render("cryptos/details", { ...crypto, isOwner });
});

router.get("/:cryptoId/buy-handler", async (req, res) => {
    const cryptoId = req.params.cryptoId;
    const userId = req.user?._id;
    
    const crypto = await Crypto.findById(cryptoId);

    crypto.buyers.push(userId);
    await crypto.save();

    res.redirect(`/cryptos/${cryptoId}/details`);
});

router.get("/create", isAuth, (req, res) => {
    res.render("cryptos/create");
});

router.post("/create", isAuth, async (req, res) => {
    const cryptoData = req.body;

    try {
        await cryptosService.create(req.user._id, cryptoData);

        res.redirect("/cryptos");
    } catch (err) {
        res.render("cryptos/create", { ...cryptoData, error: getErrorMessage(err) });
    }
});

router.get("/:cryptoId/edit", isCryptoOwner, async (req, res) => {
    res.render("cryptos/edit", { ...req.crypto });
});

router.post("/:cryptoId/edit", isCryptoOwner, async (req, res) => {

    const cryptoData = req.body;

    try {
        await cryptosService.edit(req.params.cryptoId, cryptoData);

        res.redirect(`/cryptos/${req.params.cryptoId}/details`);
    } catch (err) {
        res.render("cryptos/edit", { ...cryptoData, error: getErrorMessage(err)});
    }
});

router.get("/:cryptoId/delete", isCryptoOwner, async (req, res) => {
    
    await cryptosService.delete(req.params.cryptoId);

    res.redirect("/cryptos");
});

async function isCryptoOwner(req, res, next) {
    const crypto = await cryptosService.getOne(req.params.cryptoId).lean();

    if (crypto.owner != req.user?._id) {
        return res.redirect(`/cryptos/${req.params.cryptoId}/details`);
    }

    req.crypto = crypto;
    next();
} 

module.exports = router;