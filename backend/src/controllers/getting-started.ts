/**
 * @swagger
 * tags:
 *   name: Getting Started
 *   description: Guide to using the Abroad API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ApiGuide:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         content:
 *           type: string
 *         code_example:
 *           type: string
 */

/**
 * @swagger
 * /api/docs/getting-started:
 *   get:
 *     summary: Getting Started with the Abroad API
 *     tags: [Getting Started]
 *     description: |
 *       # Getting Started with the Abroad API
 *       
 *       Welcome to the Abroad API documentation. This guide will help you get started with using our API services for embassy and consular operations.
 *       
 *       ## API Versioning
 *       
 *       The Abroad API uses versioning to ensure backward compatibility as the API evolves. The current version is **v1**.
 *       
 *       All API endpoints should be accessed using the versioned URL format:
 *       ```
 *       https://api.abroad-app.com/api/v1/resource
 *       ```
 *       
 *       For development environments:
 *       ```
 *       http://localhost:4000/api/v1/resource
 *       ```
 *       
 *       To check the current API version and supported versions, use:
 *       ```
 *       GET /api/version
 *       ```
 *       
 *       ## Authentication
 *       
 *       Most API endpoints require authentication. The Abroad API uses JWT (JSON Web Token) for authentication.
 *       
 *       ### Step 1: Obtain an Authentication Token
 *       
 *       ```
 *       POST /api/v1/auth/login
 *       {
 *         "username": "your_username",
 *         "password": "your_password"
 *       }
 *       ```
 *       
 *       The response will include a token:
 *       ```json
 *       {
 *         "token": "eyJhbGciOiJIUzI1NiIs...",
 *         "user": {
 *           "id": 1,
 *           "username": "admin",
 *           "role": "ADMIN",
 *           "name": "Administrator"
 *         },
 *         "expiresIn": "24h"
 *       }
 *       ```
 *       
 *       ### Step 2: Use the Token in Requests
 *       
 *       Include the token in the Authorization header of all subsequent requests:
 *       
 *       ```
 *       Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
 *       ```
 *       
 *       ### Step 3: Refresh the Token Before Expiry
 *       
 *       To get a new token before expiry:
 *       
 *       ```
 *       POST /api/v1/auth/refresh-token
 *       ```
 *       
 *       ## Core Resources
 *       
 *       The Abroad API provides several key resources:
 *       
 *       1. **Citizens** - Manage citizen information
 *          - `GET /api/v1/citizens` - List all citizens
 *          - `POST /api/v1/citizens` - Create a new citizen
 *          - `GET /api/v1/citizens/{id}` - Get a specific citizen
 *       
 *       2. **Passports** - Handle passport applications and issuance
 *          - `GET /api/v1/passports` - List all passport applications
 *          - `POST /api/v1/passports` - Submit a new passport application
 *       
 *       3. **Visas** - Process visa applications 
 *          - `GET /api/v1/visa` - List all visa applications
 *          - `POST /api/v1/visa` - Submit a new visa application
 *       
 *       4. **Documents** - Upload and retrieve documents
 *          - `POST /api/v1/documents/upload` - Upload a document
 *          - `GET /api/v1/documents/{key}/download-url` - Get a download URL
 *       
 *       5. **Proxies** - Manage legal proxy authorizations
 *          - `GET /api/v1/proxies` - List all proxies
 *          - `POST /api/v1/proxies` - Create a new proxy
 *       
 *       ## Error Handling
 *       
 *       The API uses standard HTTP status codes to indicate the success or failure of requests:
 *       
 *       - 200: Success
 *       - 201: Created
 *       - 400: Bad Request - Usually a validation error
 *       - 401: Unauthorized - Authentication required or failed
 *       - 403: Forbidden - Insufficient permissions
 *       - 404: Not Found - Resource does not exist
 *       - 500: Server Error
 *       
 *       Error responses include a JSON object with an error message and optional details:
 *       
 *       ```json
 *       {
 *         "error": "Invalid input data.",
 *         "details": [
 *           {
 *             "field": "first_name_ar",
 *             "message": "First name must have at least 2 characters"
 *           }
 *         ]
 *       }
 *       ```
 *       
 *       ## Rate Limiting
 *       
 *       The API implements rate limiting to prevent abuse. The current limits are:
 *       
 *       - Standard endpoints: 100 requests per minute
 *       - Document upload endpoints: 20 uploads per minute
 *       
 *       When rate limited, the API will respond with a 429 Too Many Requests status code.
 *       
 *       ## Example: Creating a Citizen
 *       
 *       ```javascript
 *       // Using fetch API in JavaScript
 *       async function createCitizen(citizenData, token) {
 *         const response = await fetch('http://localhost:4000/api/v1/citizens', {
 *           method: 'POST',
 *           headers: {
 *             'Content-Type': 'application/json',
 *             'Authorization': `Bearer ${token}`
 *           },
 *           body: JSON.stringify(citizenData)
 *         });
 *         
 *         if (!response.ok) {
 *           const error = await response.json();
 *           throw new Error(`API error: ${error.error}`);
 *         }
 *         
 *         return await response.json();
 *       }
 *       
 *       // Example usage
 *       const newCitizen = {
 *         national_id: '1234567890',
 *         first_name_ar: 'محمد',
 *         last_name_ar: 'علي',
 *         first_name_en: 'Mohammed',
 *         last_name_en: 'Ali',
 *         father_name_ar: 'أحمد',
 *         father_name_en: 'Ahmed',
 *         mother_name_ar: 'فاطمة',
 *         mother_name_en: 'Fatima',
 *         gender: 'M',
 *         date_of_birth: '1990-01-01',
 *         place_of_birth: 'Tripoli',
 *         marital_status: 'SINGLE'
 *       };
 *       
 *       createCitizen(newCitizen, 'your_jwt_token_here')
 *         .then(result => console.log('Created citizen:', result))
 *         .catch(error => console.error(error));
 *       ```
 *       
 *       ## Further Resources
 *       
 *       - For detailed API specifications, explore the endpoints listed in this documentation
 *       - Check `/api/version` for information about API updates and deprecation schedules
 *       - Contact support@abroad-app.com for additional assistance
 *     security: []
 *     responses:
 *       200:
 *         description: Getting Started Guide
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "This endpoint provides documentation only. Please refer to the description."
 */

// This is a documentation-only file, no actual code is needed