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
	addMemberIntoGroup,
	removeUserIdInGroup,
	deleteConversation,
	chanceRoleOwner
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
router.post(
	'/:conversationId/add-member',
	passport.authenticate('jwt', { session: false }),
	addMemberIntoGroup
);
router.post(
	'/:conversationId/remove-member',
	passport.authenticate('jwt', { session: false }),
	removeUserIdInGroup
);
router.delete(
	'/:conversationId',
	passport.authenticate('jwt', { session: false }),
	deleteConversation
);
router.post(
	'/:conversationId/change-role-owner',
	passport.authenticate('jwt', { session: false }),
	chanceRoleOwner
);

module.exports = router;
