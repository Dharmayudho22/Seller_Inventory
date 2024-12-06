const express = require('express');
const {passport, authenticateJWT} = require('../passport');

const { getUserById, register, updateProfile, GoogleCheck, loginManual, logout, googleCallback} = require('../controllers');
const { registerRateLimiter, loginRateLimiter} = require('../middlewares/RateLimit');

const registerValidation = require('../middlewares/validation/user/RegisterValidation');
const updateProfileValidation = require('../middlewares/validation/user/UpdateProfileValidation');

const router = express.Router();

router.get('/profile', authenticateJWT, getUserById);

router.post('/daftar', registerRateLimiter ,registerValidation, register);
router.post('/login', loginRateLimiter ,registerValidation ,loginManual);
router.get('/logout', authenticateJWT ,logout);

router.get('/userGoogle', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/auth/callback', googleCallback, GoogleCheck);

router.put('/profile', updateProfileValidation ,authenticateJWT, updateProfile);
router.get('/profile', authenticateJWT, getUserById);

module.exports = router;