const router = require('express').Router();
const passport = require('passport');
require('../middleware/passport');

const {
	sendMessage,
	getMessages,
} = require('../controllers/message.controller');

router.post('/', passport.authenticate('jwt', { session: false }), sendMessage);
router.get('/', passport.authenticate('jwt', { session: false }), getMessages);

module.exports = router;
