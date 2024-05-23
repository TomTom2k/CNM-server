const router = require('express').Router();

const userRoute = require('./user.route');
const authRoute = require('./auth.route');
const messageRoute = require('./message.route');
const conversationRoute = require('./conversation.route');
const fileRoute = require('./file.route')
const otpRoute = require('./otp.route')
const callRoute = require('./call.route')

router.use('/user', userRoute);
router.use('/auth', authRoute);
router.use('/message', messageRoute);
router.use('/conversation', conversationRoute);
router.use('/file', fileRoute);
router.use('/otp', otpRoute);
router.use('/call', callRoute);

router.use('/', (req, res) => {
	res.status(200).json({ message: 'start server success!!' });
});

module.exports = router;
