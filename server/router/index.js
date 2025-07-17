const Router = require('express').Router;
const userController = require("../controllers/user-controller");
const router = new Router();
const {body} = require("express-validator");
const authMiddleware = require("../middlewares/auth-middleware");
const passport = require('passport');
const tokenService = require('../services/token-service');
const UserDto = require('../dtos/user-dto');

router.get('/activate/:link', userController.activate);
router.get('/refresh', userController.refresh);
router.get('/users', authMiddleware, userController.getUsers);
router.get('/confirm-login/:token', userController.confirmLogin);
router.post('/registration',
    body("email").isEmail(),
    body("password").isLength({min: 3, max: 32}),
    userController.registration
);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password', userController.resetPassword);
router.post('/change-password', authMiddleware, userController.changePassword);
router.post('/2fa/enable', authMiddleware, userController.enable2FA);
router.post('/2fa/disable', authMiddleware, userController.disable2FA);

// Google OAuth
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: process.env.CLIENT_URL + '/login?error=google',
    session: true
}), async (req, res) => {
    // Выдаём JWT-токены и редиректим на фронт
    const user = req.user;
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    // Можно передать токены через query или через cookie
    res.cookie('refreshToken', tokens.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
    // Редирект на фронт с accessToken в query (или просто на главную)
    res.redirect(`${process.env.CLIENT_URL}/?accessToken=${tokens.accessToken}`);
});

module.exports = router;