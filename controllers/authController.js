const router = require('express').Router();
const authService = require('../services/authService');
const { cookieSessionName } = require('../constants');
const { isAuth, isGuest } = require('../middlewares/authMiddleware');
const { getErrorMessage } = require('../utils/errorHelpers');

router.get('/login', isGuest, (req, res) => {
    res.render('auth/login')
});

router.post('/login', isGuest, async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await authService.login(email, password);
        const token = await authService.createToken(user);
    
        res.cookie(cookieSessionName, token, {httpOnly: true});
        res.redirect('/');
    } catch (error) {
        return res.render('auth/login', { error: getErrorMessage(error) });
    }
});

router.get('/register', isGuest, (req, res) => {
    res.render('auth/register')
});

router.post('/register', isGuest, async (req, res) => {
    const { username, email, password, repeatPassword } = req.body;

    if (password !== repeatPassword) {
        return res.render('auth/register', { error: 'Passwords missmatch!' });
    }

    try {
        const createdUser = await authService.create({ username, email, password });
        const token = await authService.createToken(createdUser);

        res.cookie(cookieSessionName, token, {httpOnly: true});
        res.redirect('/');
    } catch (error) {
        return res.render('auth/register', { error: getErrorMessage(error) });
    }
});

router.get('/logout', isAuth, (req, res) => {
    res.clearCookie(cookieSessionName);
    res.redirect('/');
});

module.exports = router;