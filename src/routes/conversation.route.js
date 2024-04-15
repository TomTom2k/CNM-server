const router = require('express').Router();
const passport = require('passport');
require('../middleware/passport');

const upload = require('../middleware/upload');

const {
	getConversations,
	createConversation,
	getLastMessage,
	getRecentlyConversations,
	getRecentlyFriendConversations,
	deleteConversation
} = require('../controllers/conversation.controller');

router.get(
	'/',
	passport.authenticate('jwt', { session: false }),
	getConversations
);
router.post(
	'/',
	passport.authenticate('jwt', { session: false }),
	upload.single('groupAvatar'),
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
router.get(
	'/recently-with-friend/:quantity',
	passport.authenticate('jwt', { session: false }),
	getRecentlyFriendConversations
);
router.delete(
	'/:conversationId',
	passport.authenticate('jwt', { session: false }),
	deleteConversation
);

module.exports = router;
