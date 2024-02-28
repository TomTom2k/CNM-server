const router = require('express').Router();
const passport = require('passport');
require('../middleware/passport');

const {
	getListConversations,
} = require('../controllers/conversation.controller');

router.get(
	'/',
	passport.authenticate('jwt', { session: false }),
	getListConversations
);

module.exports = router;
