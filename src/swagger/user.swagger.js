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
 *               firstName:
 *                 type: string
 *                 description: The first name of the new user.
 *               lastName:
 *                 type: string
 *                 description: The last name of the new user.
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
 *                 UserID: "123456"
 *                 FirstName: "John"
 *                 LastName: "Doe"
 *                 PhoneNumber: "+1234567890"
 *                 AuthType: "local"
 *                 Role: "client"
 *                 Active: true
 */
