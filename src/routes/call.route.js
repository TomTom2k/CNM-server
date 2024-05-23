const router = require('express').Router();

const {
	makeACallOne,
	makeACallGroup,
} = require('../controllers/call.controller');

router.post('/make-a-call-one', makeACallOne);
router.post('/make-a-call-group', makeACallGroup);

module.exports = router;
