const router = require('express').Router();
const passport = require('passport');
require('../middleware/passport');

const {
	signUpWithPhoneNumber,
	signInWithPhoneNumber,
	secret,
} = require('../controllers/user.controller');

router.get('/secret', passport.authenticate('jwt', { session: false }), secret);
router.post('/sign-up-with-phone', signUpWithPhoneNumber);
router.post(
	'/sign-in-with-phone',
	passport.authenticate('local', { session: false }),
	signInWithPhoneNumber
);

module.exports = router;
