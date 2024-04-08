const router = require('express').Router();
const passport = require('passport');
require('../middleware/passport');

const upload = require('../middleware/upload');

const {
	sendMessage,
	getMessages,
	recallMessage,
	deleteMessageForMeOnly,
	shareMessage
} = require('../controllers/message.controller');

router.post(
	'/', 
	passport.authenticate('jwt', { session: false }), 
	upload.array('file'), 
	sendMessage
);
router.get(
	'/:conversationId',
	passport.authenticate('jwt', { session: false }),
	getMessages
);
router.patch(
	'/recall-message/:messageId',
	passport.authenticate('jwt', { session: false }),
	recallMessage
);
router.patch(
	'/delete-message-for-me-only/:messageId',
	passport.authenticate('jwt', { session: false }),
	deleteMessageForMeOnly
);
router.post(
	'/share-message',
	passport.authenticate('jwt', { session: false }),
	shareMessage
);

module.exports = router;
