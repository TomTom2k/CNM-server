const router = require('express').Router();

const userRoute = require('./user.route');
const messageRoute = require('./message.route');
const conversationRoute = require('./conversation.route');

router.use('/user', userRoute);
router.use('/message', messageRoute);
router.use('/conversation', conversationRoute);

router.use('/', (req, res) => {
	res.status(200).json({ message: 'start server success!!' });
});

module.exports = router;
