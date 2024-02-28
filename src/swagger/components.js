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
 *     Group:
 *       type: object
 *       properties:
 *         groupId:
 *           type: string
 *           description: The unique identifier for the group.
 *         name:
 *           type: string
 *           description: The name of the group.
 *         members:
 *           type: array
 *           items:
 *             type: string
 *           description: The array of user IDs who are members of the group.
 *         creatorId:
 *           type: string
 *           description: The ID of the user who created the group.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the group was created.
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the group was last updated.
 *
 *     Message:
 *       type: object
 *       properties:
 *         messageId:
 *           type: string
 *           description: The unique identifier for the message.
 *         senderId:
 *           type: string
 *           description: The ID of the user who sent the message.
 *         receiverId:
 *           type: string
 *           description: The ID of the user who received the message.
 *         groupId:
 *           type: string
 *           description: The ID of the group to which the message belongs (if any).
 *         content:
 *           type: string
 *           description: The content of the message.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the message was created.
 *
 *     Conversation:
 *       type: object
 *       properties:
 *         conversationId:
 *           type: string
 *           description: The unique identifier for the conversation.
 *         participantIds:
 *           type: array
 *           items:
 *             type: string
 *           description: The array of user IDs who are participants in the conversation.
 *         type:
 *           type: string
 *           enum:
 *             - group
 *             - individual
 *           description: The type of the conversation.
 *         lastMessageId:
 *           type: string
 *           description: The ID of the last message in the conversation.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the conversation was created.
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the conversation was last updated.
 */
