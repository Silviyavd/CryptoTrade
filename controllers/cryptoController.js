const router = require('express').Router();
const cryptoService = require('../services/cryptoService');
const userService = require('../services/userService');
const { isAuth } = require('../middlewares/authMiddleware');
const { getErrorMessage } = require('../utils/errorHelpers');
const { preloadCrypto, isCryptoOwner } = require('../middlewares/cryptoMiddlewares');

router.get('/', async (req, res) => {
    const cryptos = await cryptoService.getAll().lean();

    res.render('crypto', { cryptos });
});

router.get('/:cryptoId/details', async (req, res) => {
    const crypto = await cryptoService.getOneDetailed(req.params.cryptoId).populate('buyACrypto').lean();

    const isOwner = crypto.owner?._id == req.user?._id;

    const hasBought = crypto.buyACrypto.some(x => x._id == req.user?._id);

    res.render('crypto/details', {...crypto, isOwner: isOwner, hasBought });
});

router.get('/:cryptoId/edit', isAuth, preloadCrypto, isCryptoOwner, (req, res) => {
    res.render('crypto/edit', {...req.crypto});
});

router.post('/:cryptoId/edit', isAuth, preloadCrypto, isCryptoOwner, async (req, res) => {
    try {
    await cryptoService.update(req.params.cryptoId, req.body);

    res.redirect(`/cryptos/${req.params.cryptoId}/details`);
    } catch (error) {
        res.render('crypto/edit', {...req.body, error: getErrorMessage(error) });
    }
});

router.get('/:cryptoId/delete', isAuth, preloadCrypto, isCryptoOwner, async(req, res) => {
    await cryptoService.delete(req.params.cryptoId);

    res.redirect('/cryptos');
});

router.get('/create', isAuth, (req, res) => {
    res.render('crypto/create')
});

router.post('/create', isAuth, async (req, res) => {
    const cryptoData = {...req.body, owner: req.user._id};

    try {
        await cryptoService.create(cryptoData);

        res.redirect('/cryptos');
    } catch (error) {
        res.render('crypto/create', { ...req.body, error: getErrorMessage(error) });
    }
});

router.get('/:cryptoId/buy', isAuth, async(req, res) => {
    const crypto = await cryptoService.getOne(req.params.cryptoId);
    const user = await userService.getOne(req.user._id);

    crypto.buyACrypto.push(user);

    await crypto.save();

    res.redirect('details');
});

router.get('/search', isAuth, async(req, res) => {
    const cryptos = await cryptoService.getAll().lean();
    const submitted = false;

    res.render('crypto/search', {cryptos, submitted});
});

router.post('/search', isAuth, async(req, res) => {
    const matches = await cryptoService.getMatches(req.body.searchParam, req.body.paymentParam).lean();

    const submitted = true;

    res.render('crypto/search', { matches, submitted }); 
    });

module.exports = router;