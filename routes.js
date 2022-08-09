const router = require('express').Router();

const homeController = require('./controllers/homeController');
const authController = require('./controllers/authController');
const cryptoController = require('./controllers/cryptoController');

router.use(homeController);
router.use('/auth', authController);
router.use('/cryptos', cryptoController);

router.use('*', function (req, res) {
    res.render('/404');
});

module.exports = router;