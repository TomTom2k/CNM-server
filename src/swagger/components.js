/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         UserID:
 *           type: string
 *           description: The unique identifier for the user.
 *         FirstName:
 *           type: string
 *           description: The first name of the user.
 *         LastName:
 *           type: string
 *           description: The last name of the user.
 *         Password:
 *           type: string
 *           description: The hashed password of the user.
 *         Email:
 *           type: string
 *           description: The email address of the user.
 *         PhoneNumber:
 *           type: string
 *           description: The phone number of the user.
 *         AuthType:
 *           type: string
 *           enum: ['phone', 'email', 'google']
 *           default: 'local'
 *           description: The authentication type of the user.
 *         Role:
 *           type: string
 *           enum: ['staff', 'client']
 *           default: 'client'
 *           description: The role of the user.
 *         Active:
 *           type: boolean
 *           default: false
 *           description: Indicates whether the user is active.
 *         CreatedAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the user was created.
 *         UpdatedAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the user was last updated.
 */
