const router = require('express').Router();
const passport = require('passport');
require('../middleware/passport');

const {
	getConversations,
	createConversation,
} = require('../controllers/conversation.controller');

router.get(
	'/',
	passport.authenticate('jwt', { session: false }),
	getConversations
);
router.post(
	'/',
	passport.authenticate('jwt', { session: false }),
	createConversation
);

module.exports = router;
