/**
 * @swagger
 * /api/user/sign-in-with-phone:
 *   post:
 *     summary: Sign in with phone number
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phoneNumber:
 *                 type: string
 *                 description: The phone number of the user.
 *               password:
 *                 type: string
 *                 description: The password for the user.
 *     responses:
 *       '200':
 *         description: Successfully signed in.
 *       '401':
 *         description: Unauthorized, invalid phone number or password.
 *       '500':
 *         description: Internal Server Error.
 */

/**
 * @swagger
 * /api/user/sign-up-with-phone:
 *   post:
 *     summary: Sign up with phone number
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phoneNumber:
 *                 type: string
 *                 description: The phone number for registration.
 *               password:
 *                 type: string
 *                 description: The password for the new user.
 *               fullName:
 *                 type: string
 *                 description: The full name of the new user.
 *               gender:
 *                 type: string
 *                 description: The gender of the new user
 *     responses:
 *       '200':
 *         description: Successfully signed up.
 *       '400':
 *         description: Bad Request, phone number already in use.
 *       '500':
 *         description: Internal Server Error.
 */

/**
 * @swagger
 * /api/user/secret:
 *   get:
 *     summary: Get user information (requires authentication)
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: Successfully fetched user information.
 *         content:
 *           application/json:
 *             example:
 *               message: 'User fetched successfully!'
 *               user:
 *                 userID: "123456"
 *                 fullName: "Doe John"
 *                 gender: "male"
 *                 phoneNumber: "+84387166789"
 *                 active: true
 *                 profilePic: ""
 */

/**
 * @swagger
 * /api/user/contact:
 *   get:
 *     summary: Get all contacts for a user
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: Successfully retrieved contacts.
 *         content:
 *           application/json:
 *             example:
 *               contacts:
 *                 - contactID: "abc123"
 *                   userID: "user123"
 *                   contactName: "Friend 1"
 *                   phoneNumber: "+1234567890"
 *                 - contactID: "def456"
 *                   userID: "user123"
 *                   contactName: "Friend 2"
 *                   phoneNumber: "+9876543210"
 *       '404':
 *         description: User not found.
 *       '500':
 *         description: Internal Server Error.
 */

/**
 * @swagger
 * /api/user/contact:
 *   post:
 *     summary: Add a new contact for a user
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               contactName:
 *                 type: string
 *                 description: The name of the new contact.
 *               phoneNumber:
 *                 type: string
 *                 description: The phone number of the new contact.
 *     responses:
 *       '201':
 *         description: Successfully added a new contact.
 *       '400':
 *         description: Bad Request, contact with the same phone number already exists.
 *       '404':
 *         description: User not found.
 *       '500':
 *         description: Internal Server Error.
 */
