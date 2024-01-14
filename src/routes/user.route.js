const { createUser, getAllUsers } = require('../controllers/user.controller');

const router = require('express').Router();

router.post('/', createUser);
router.get('/', getAllUsers);

module.exports = router;
