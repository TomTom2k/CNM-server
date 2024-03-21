const router = require('express').Router();
const passport = require('passport');
require('../middleware/passport');

const upload = require('../middleware/upload');

const {
	sendMessage,
	getMessages,
	deleteMessage,
	revokeMessage
} = require('../controllers/message.controller');

router.post('/', passport.authenticate('jwt', { session: false }), upload.array('image'), sendMessage);
router.get(
	'/:conversationId',
	passport.authenticate('jwt', { session: false }),
	getMessages
);

// DELETE request to delete a specific message
router.put('/delete/:messageId', passport.authenticate('jwt', { session: false }), deleteMessage);
// PUT request to revoke a specific message
router.put('/revoke/:messageId', passport.authenticate('jwt', { session: false }), revokeMessage);
module.exports = router;
