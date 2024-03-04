const router = require('express').Router();
const passport = require('passport');
require('../middleware/passport');

const {
	addContactForUser,
	getAllContactOfUser,
	findUserByPhoneNumber,
} = require('../controllers/user.controller');

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
router.get(
	'/find-user',
	passport.authenticate('jwt', { session: false }),
	findUserByPhoneNumber
);

module.exports = router;
