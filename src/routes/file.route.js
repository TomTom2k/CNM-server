const router = require('express').Router();
const passport = require('passport');
require('../middleware/passport');

const {
	getFileBuffer,
} = require('../controllers/file.controller');

router.get(
	'/:fileName',
	passport.authenticate('jwt', { session: false }),
	getFileBuffer
);

module.exports = router;