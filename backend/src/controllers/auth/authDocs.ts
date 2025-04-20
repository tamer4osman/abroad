/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         user_id:
 *           type: integer
 *           description: The auto-generated ID of the user
 *         username:
 *           type: string
 *           description: Username for authentication
 *         email:
 *           type: string
 *           format: email
 *           description: Email address of the user
 *         full_name:
 *           type: string
 *           description: Full name of the user
 *         role:
 *           type: string
 *           enum: [ADMIN, OFFICER, MANAGER, USER]
 *           description: Role determining user permissions
 *         department:
 *           type: string
 *           description: Department the user belongs to
 *         is_active:
 *           type: boolean
 *           description: Whether the user account is active
 *         last_login:
 *           type: string
 *           format: date-time
 *           description: Timestamp of last successful login
 *       example:
 *         user_id: 1
 *         username: 'john.doe'
 *         email: 'john.doe@example.com'
 *         full_name: 'John Doe'
 *         role: 'OFFICER'
 *         department: 'Passport Office'
 *         is_active: true
 *         last_login: '2023-05-15T10:30:00Z'
 */

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication and authorization
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Authenticate user and get token
 *     tags: [Authentication]
 *     description: Authenticates user credentials and returns a JWT token for API access
 *     security: [] # No authentication required for this endpoint
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Authentication successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token for API access
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 expiresIn:
 *                   type: string
 *                   description: Token expiration period
 *       401:
 *         description: Authentication failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid username or password
 *       500:
 *         description: Server error
 *
 * /api/auth/refresh-token:
 *   post:
 *     summary: Refresh authentication token
 *     tags: [Authentication]
 *     description: Get a new JWT token using an existing valid token
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: New JWT token
 *                 expiresIn:
 *                   type: string
 *                   description: Token expiration period
 *       401:
 *         description: Invalid or expired token
 *       500:
 *         description: Server error
 *
 * /api/auth/me:
 *   get:
 *     summary: Get current user information
 *     tags: [Authentication]
 *     description: Returns detailed information about the currently authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Server error
 *
 * /api/auth/change-password:
 *   post:
 *     summary: Change user password
 *     tags: [Authentication]
 *     description: Change the password for the currently authenticated user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 format: password
 *               newPassword:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Current password is incorrect
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: |
 *         JWT Authorization header using the Bearer scheme.
 *         
 *         Enter your token in the format: Bearer {token}
 *         
 *         Example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *         
 *         Authentication and authorization in the Abroad API:
 *         
 *         1. **Authentication** - Obtain a JWT token by sending credentials to the `/api/auth/login` endpoint
 *         2. **Token Usage** - Include the token in the Authorization header of your requests
 *         3. **Token Refresh** - Use `/api/auth/refresh-token` to get a new token before expiry
 *         4. **Role-Based Access** - Different API endpoints require specific user roles
 *         
 *         Available roles in the system:
 *         - `ADMIN`: Full system access
 *         - `MANAGER`: Access to reporting and supervision features
 *         - `OFFICER`: Access to citizen data and document processing
 *         - `USER`: Limited access to basic features
 *   responses:
 *     UnauthorizedError:
 *       description: Access token is missing or invalid
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               error:
 *                 type: string
 *                 example: Authentication required. No token provided.
 *     ForbiddenError:
 *       description: The user does not have required permissions
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               error:
 *                 type: string
 *                 example: Access denied. Insufficient permissions.
 */

// This is a documentation-only file, no actual code is needed