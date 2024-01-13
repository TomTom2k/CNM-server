const router = require('express').Router();

router.use('/', (req, res) => {
	res.status(200).json({ message: 'start server success!!' });
});

module.exports = router;
