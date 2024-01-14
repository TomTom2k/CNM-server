const router = require('express').Router();

const userRoute = require('./user.route');

router.use('/user', userRoute);

router.use('/', (req, res) => {
	res.status(200).json({ message: 'start server success!!' });
});

module.exports = router;
