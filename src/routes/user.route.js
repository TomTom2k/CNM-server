const router = require('express').Router();
const passport = require('passport');
require('../middleware/passport');

const {
	signUpWithPhoneNumber,
	signInWithPhoneNumber,
	secret,
	addContactForUser,
	getAllContactOfUser,
} = require('../controllers/user.controller');

// API auth
router.get('/secret', passport.authenticate('jwt', { session: false }), secret);
router.post('/sign-up-with-phone', signUpWithPhoneNumber);
router.post(
	'/sign-in-with-phone',
	passport.authenticate('local', { session: false }),
	signInWithPhoneNumber
);

// API for user
router.post(
	'/contact',
	passport.authenticate('jwt', { session: false }),
	addContactForUser
);
router.get(
	'/contact',
	passport.authenticate('jwt', { session: false }),
	getAllContactOfUser
);

module.exports = router;
