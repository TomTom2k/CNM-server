const router = require('express').Router();
const passport = require('passport');
require('../middleware/passport');

const upload = require('../middleware/upload');

const {
	addContactForUser,
	getAllContactOfUser,
	findUserByPhoneNumber,
	updateProfilePic,
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
router.patch(
	'/profile-pic',
	passport.authenticate('jwt', { session: false }),
	upload.single('profilePic'),
	updateProfilePic
);

module.exports = router;
