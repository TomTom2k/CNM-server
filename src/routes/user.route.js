const router = require('express').Router();
const passport = require('passport');
require('../middleware/passport');

const upload = require('../middleware/upload');

const {
	addContactForUser,
	getAllContactOfUser,
	findUserByPhoneNumber,
	updateProfilePic,
	changePassword,
	updateUserInfo,
	updateUserPassword,
	addFriend,
	sentAddFriend,
	inFoUser,
	findUserById,
	cancelFriend,
	cancelRequestAddFriends,
	deleteFriend,
	getAllFriendsWithConversationId,
	findUsersByIds
} = require('../controllers/user.controller');

router.post(
	'/contact',
	passport.authenticate('jwt', { session: false }),
	addContactForUser
);
router.get(
	'/contact',
	passport.authenticate('jwt', { session: false }),
	getAllContactOfUser
);
router.get(
	'/find-user',
	passport.authenticate('jwt', { session: false }),
	findUserByPhoneNumber
);
router.patch(
	'/update-profile-pic',
	passport.authenticate('jwt', { session: false }),
	upload.single('profilePic'),
	updateProfilePic
);
router.put(
	'/change-password',
	// passport.authenticate('jwt', { session: false }),
	changePassword
);
router.put(
	'/update-info',
	passport.authenticate('jwt', { session: false }),
	updateUserInfo
);
router.patch(
	'/update-password',
	passport.authenticate('jwt', { session: false }),
	updateUserPassword
);
router.put(
	'/add-friend',
	passport.authenticate('jwt', { session: false }),
	addFriend
);
router.put(
	'/sent-request-add-friend',
	passport.authenticate('jwt', { session: false }),
	sentAddFriend
);
router.get(
	'/info-user',
	passport.authenticate('jwt', { session: false }),
	inFoUser
);
router.get(
	'/find-user-by-id/:userId',
	passport.authenticate('jwt', { session: false }),
	findUserById
);

router.put(
	'/cancel-friend',
	passport.authenticate('jwt', { session: false }),
	cancelFriend
);

router.put(
	'/cancel-request-add-friend',
	passport.authenticate('jwt', { session: false }),
	cancelRequestAddFriends
)

router.put(
	'/delete-friend',
	passport.authenticate('jwt', { session: false }),
	deleteFriend
);

router.get(
	'/get-all-friends-with-conversationid',
	passport.authenticate('jwt', { session: false }),
	getAllFriendsWithConversationId
);

router.get(
	'/find-users-by-ids',
	passport.authenticate('jwt', { session: false }),
	findUsersByIds
);

module.exports = router;
