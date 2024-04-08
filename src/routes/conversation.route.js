const router = require('express').Router();
const passport = require('passport');
require('../middleware/passport');

const {
	getConversations,
	createConversation,
	getLastMessage,
	getRecentlyConversations
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
router.get(
	'/:conversationId',
	passport.authenticate('jwt', { session: false }),
	getLastMessage
);
router.get(
	'/recently/:quantity',
	passport.authenticate('jwt', { session: false }),
	getRecentlyConversations
);

module.exports = router;
