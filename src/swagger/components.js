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
 *         userID:
 *           type: string
 *           description: The unique identifier for the user.
 *         fullName:
 *           type: string
 *           description: The full name of the user.
 *         password:
 *           type: string
 *           description: The hashed password of the user.
 *         gender:
 *           type: string
 *           enum:
 *             - male
 *             - female
 *           description: The gender of the user.
 *         phoneNumber:
 *           type: string
 *           description: The phone number of the user.
 *         active:
 *           type: boolean
 *           description: Indicates whether the user is active.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the user was created.
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the user was last updated.
 *         profilePic:
 *           type: string
 *           description: The profile picture of the user
 *     Contact:
 *       type: object
 *       properties:
 *         contactID:
 *           type: string
 *           description: The unique identifier for the contact.
 *         userID:
 *           type: string
 *           description: The ID of the user who owns the contact.
 *         contactName:
 *           type: string
 *           description: The name of the contact.
 *         phoneNumber:
 *           type: string
 *           description: The phone number of the contact.
 */
