const router = require('express').Router();
const passport = require('passport');
require('../middleware/passport');

const upload = require('../middleware/upload');

const {
	sendMessage,
	getMessages,
} = require('../controllers/message.controller');

router.post('/', passport.authenticate('jwt', { session: false }), upload.array('image'), sendMessage);
router.get(
	'/:conversationId',
	passport.authenticate('jwt', { session: false }),
	getMessages
);

module.exports = router;
