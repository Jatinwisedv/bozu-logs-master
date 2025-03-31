import { Router } from 'express';
import { AdminController } from '../Controller/adminController';
import authMiddleware from '../Middleware/authMiddleware';
const router = Router();

const adminController :AdminController = new AdminController();


/**
 * @swagger
 * /admin/postAdmin:
 *   post:
 *     summary: Create a new admin user
 *     description: |
 *       This endpoint allows a SUPERADMIN to create a new admin user.
 *       The request body must contain admin details, and the authenticated user must have the SUPERADMIN role.
 *     tags: [Admin]
 *     requestBody:
 *       description: Admin details to create a new admin user
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               adminName:
 *                 type: string
 *                 example: "nusarat"
 *               adminEmail:
 *                 type: string
 *                 example: "nmv@example.com"
 *               password:
 *                 type: string
 *                 example: "securePassword123#"
 *               role:
 *                 type: string
 *                 enum: [ADMIN, SUPERADMIN]
 *                 example: "ADMIN"
 *             required:
 *               - adminName
 *               - adminEmail
 *               - password
 *               - role
 *     responses:
 *       201:
 *         description: Admin created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/AdminObject'
 *                 message:
 *                   type: string
 *                   example: "default admin created successfully"
 *                 statusCode:
 *                   type: number
 *                   example: 201
 *                 success:
 *                   type: boolea
 *                   example: true
 *                 isOperationalError:
 *                   type: boolean
 *                   example: false
 *       400:
 *         description: Bad request (e.g., id or _id passed in the request body, admin already exists, or validation failed)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorObj'
 *       401:
 *         description: Unauthorized (e.g., admin not authenticated or not a SUPERADMIN)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorObj'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorObj'
 */
router.post('/admin/postAdmin',authMiddleware ,adminController.postAdmin.bind(adminController));

/**
 * @swagger
 * /admin/postDefaultAdmin:
 *   post:
 *     summary: Create a default admin user
 *     description: Creates a default admin user in the system
 *     tags: [Admin]
 *     responses:
 *       201:
 *         description: Default admin created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 date:
 *                   $ref: '#/components/schemas/AdminObject'
 *                 message:
 *                   type: string
 *                   example: "default admin created successfully"
 *                 statusCode:
 *                   type: number
 *                   example: 201
 *                 success:
 *                   type: boolea
 *                   example: true
 *                 isOperationalError:
 *                   type: boolean
 *                   example: false
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorObj'
 */
router.post('/admin/postDefaultAdmin' ,adminController.postDefaultAdmin.bind(adminController));


/**
 * @swagger
 * /admin/adminLogin:
 *   post:
 *     summary: Login as an admin user
 *     description: Authenticate an admin user and receive a JWT token
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               adminEmail:
 *                 type: string
 *                 example: "nusarathaveliwala@gmail.com"
 *               password:
 *                 type: string
 *                 example: "Aa#123456789"
 *             required:
 *               - adminEmail
 *               - password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     admin:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: "678f2bb278d956668dd595f6"
 *                         password:
 *                           type: string
 *                           example: "$2a$10$DuNIFCN6cOCpqFxOi/eDs.h5j3pHQt5/vZIno8I0xNOzCWrP8ZPFK"
 *                         adminName:
 *                           type: string
 *                           example: "nusarat"
 *                         adminEmail:
 *                           type: string
 *                           example: "nusarathaveliwala@gmail.com"
 *                         role:
 *                           type: string
 *                           example: "SUPERADMIN"
 *                         __v:
 *                           type: number
 *                           example: 0
 *                     token:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                     isAuthenticated:
 *                       type: boolean
 *                       example: true
 *                 message:
 *                   type: string
 *                   example: "Login successful"
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 isOperationalError:
 *                   type: boolean
 *                   example: false
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorObj'
 *             example:
 *               message: "Invalid email or password"
 *               statusCode: 401
 *               success: false
 *               isOperationalError: true
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorObj'
 */
router.post("/admin/adminLogin", adminController.adminLogin.bind(adminController));

/**
 * @swagger
 * /admin/putAdmin/{adminId}:
 *   put:
 *     summary: Update an admin user
 *     description: Update an existing admin user's details
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: adminId
 *         required: true
 *         schema:
 *           type: string
 *           example: "679afe16dd26149ee6aec91d"
 *         description: ID of the admin to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               adminName:
 *                 type: string
 *                 example: "Nusarat"
 *               adminEmail:
 *                 type: string
 *                 example: "nusaratok@example.com"
 *               password:
 *                 type: string
 *                 example: "newSecurePassword123#"
 *               role:
 *                 type: string
 *                 enum: [ADMIN, SUPERADMIN]
 *                 example: "ADMIN"
 *             required:
 *               - adminName
 *               - adminEmail
 *               - password
 *               - role
 *     responses:
 *       200:
 *         description: Admin updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/AdminUpdated'
 *                 message:
 *                   type: string
 *                   example: "Admin updated successfully"
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 isOperationalError:
 *                   type: boolean
 *                   example: false
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorObj'
 *             example:
 *               message: "Unauthorized: Authentication failed"
 *               statusCode: 401
 *               success: false
 *               isOperationalError: true
 *       404:
 *         description: Admin not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorObj'
 *             example:
 *               message: "Admin not found with the provided ID"
 *               statusCode: 404
 *               success: false
 *               isOperationalError: true
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorObj'
 *             example:
 *               message: "Internal server error"
 *               statusCode: 500
 *               success: false
 *               isOperationalError: false
 */
router.put('/admin/putAdmin/:adminId',authMiddleware ,adminController.putAdmin.bind(adminController));


// /**
//  * @swagger
//  * /admin/getAdmin:
//  *   get:
//  *     summary: Get all admin users with pagination
//  *     description: Retrieve a paginated list of all admin users. Requires authentication.
//  *     tags: [Admin]
//  *     parameters:
//  *       - in: query
//  *         name: page
//  *         schema:
//  *           type: integer
//  *           default: 1
//  *         description: Page number for pagination
//  *       - in: query
//  *         name: limit
//  *         schema:
//  *           type: integer
//  *           default: 2
//  *         description: Number of items per page
//  *       - in: query
//  *         name: sortField
//  *         schema:
//  *           type: string
//  *           enum: [adminName, adminEmail, role]
//  *           default: adminEmail
//  *         description: Field to sort by
//  *       - in: query
//  *         name: sortOrder
//  *         schema:
//  *           type: string
//  *           enum: [asc, desc]
//  *           default: desc
//  *         description: Sort order (ascending or descending)
//  *     responses:
//  *       200:
//  *         description: Admins retrieved successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 data:
//  *                   type: object
//  *                   properties:
//  *                     admins:
//  *                       type: array
//  *                       items:
//  *                         type: object
//  *                         properties:
//  *                           _id:
//  *                             type: string
//  *                             example: "678f30030322e89e27cd325a"
//  *                           password:
//  *                             type: string
//  *                             example: "$2a$10$gLYIdLY97rncrg6NROmSjeOmZdl.CHXQLzinCNVVbl.E4zg/uEflW"
//  *                           adminName:
//  *                             type: string
//  *                             example: "wise-admin"
//  *                           adminEmail:
//  *                             type: string
//  *                             example: "wisedvadminpp@bozu.us"
//  *                           role:
//  *                             type: string
//  *                             example: "SUPERADMIN"
//  *                           __v:
//  *                             type: number
//  *                             example: 0
//  *                     paginationInfo:
//  *                       type: object
//  *                       properties:
//  *                         currentPage:
//  *                           type: number
//  *                           example: 1
//  *                         totalPages:
//  *                           type: number
//  *                           example: 6
//  *                         totalAdmins:
//  *                           type: number
//  *                           example: 11
//  *                         limit:
//  *                           type: number
//  *                           example: 2
//  *                         sortOrder:
//  *                           type: string
//  *                           example: "desc"
//  *                         validSortFields:
//  *                           type: array
//  *                           items:
//  *                             type: string
//  *                           example: ["adminName", "adminEmail", "role"]
//  *                         sortField:
//  *                           type: string
//  *                           example: "adminEmail"
//  *                 message:
//  *                   type: string
//  *                   example: "Admins fetched successfully"
//  *                 statusCode:
//  *                   type: number
//  *                   example: 200
//  *                 success:
//  *                   type: boolean
//  *                   example: true
//  *                 isOperationalError:
//  *                   type: boolean
//  *                   example: false
//  *       401:
//  *         description: Unauthorized
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/ErrorObj'
//  *       500:
//  *         description: Internal server error
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/ErrorObj'
//  */
/**
 * @swagger
 * /admin/getAdmin:
 *   post:
 *     summary: Get all admin users with pagination
 *     description: Retrieve a paginated list of all admin users. Requires authentication.
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               page:
 *                 type: integer
 *                 default: 1
 *                 description: Page number for pagination
 *               limit:
 *                 type: integer
 *                 default: 2
 *                 description: Number of items per page
 *               sortField:
 *                 type: string
 *                 enum: [adminName, adminEmail, role]
 *                 default: adminEmail
 *                 description: Field to sort by
 *               sortOrder:
 *                 type: string
 *                 enum: [asc, desc]
 *                 default: desc
 *                 description: Sort order (ascending or descending)
 *     responses:
 *       200:
 *         description: Admins retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     admins:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "678f30030322e89e27cd325a"
 *                           password:
 *                             type: string
 *                             example: "$2a$10$gLYIdLY97rncrg6NROmSjeOmZdl.CHXQLzinCNVVbl.E4zg/uEflW"
 *                           adminName:
 *                             type: string
 *                             example: "wise-admin"
 *                           adminEmail:
 *                             type: string
 *                             example: "wisedvadminpp@bozu.us"
 *                           role:
 *                             type: string
 *                             example: "SUPERADMIN"
 *                           __v:
 *                             type: number
 *                             example: 0
 *                     paginationInfo:
 *                       type: object
 *                       properties:
 *                         currentPage:
 *                           type: number
 *                           example: 1
 *                         totalPages:
 *                           type: number
 *                           example: 6
 *                         totalAdmins:
 *                           type: number
 *                           example: 11
 *                         limit:
 *                           type: number
 *                           example: 2
 *                         sortOrder:
 *                           type: string
 *                           example: "desc"
 *                         validSortFields:
 *                           type: array
 *                           items:
 *                             type: string
 *                           example: ["adminName", "adminEmail", "role"]
 *                         sortField:
 *                           type: string
 *                           example: "adminEmail"
 *                 message:
 *                   type: string
 *                   example: "Admins fetched successfully"
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 isOperationalError:
 *                   type: boolean
 *                   example: false
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorObj'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorObj'
 */
router.post('/admin/getAdmin', authMiddleware, adminController.getAdmins.bind(adminController))

/**
 * @swagger
 * /admin/getAdminById/{adminId}:
 *   get:
 *     summary: Get admin by ID
 *     description: Retrieve an admin user's details by their ID. Requires authentication.
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: adminId
 *         required: true
 *         schema:
 *           type: string
 *           example: "679afe16dd26149ee6aec91d"
 *         description: ID of the admin to retrieve
 *     responses:
 *       200:
 *         description: Admin details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     admin:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: "679afe16dd26149ee6aec91d"
 *                         password:
 *                           type: string
 *                           example: "$2a$10$.itj0Qh6ZmqEcksOZN2OpOtb5pnKATPzhwtFDSoTG9.SkyoVyV.Py"
 *                         adminName:
 *                           type: string
 *                           example: "Nusarat"
 *                         adminEmail:
 *                           type: string
 *                           example: "nusaratok@example.com"
 *                         role:
 *                           type: string
 *                           example: "ADMIN"
 *                         __v:
 *                           type: number
 *                           example: 0
 *                 message:
 *                   type: string
 *                   example: "Admin fetched successfully"
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 isOperationalError:
 *                   type: boolean
 *                   example: false
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorObj'
 *             example:
 *               message: "Unauthorized: Authentication failed"
 *               statusCode: 401
 *               success: false
 *               isOperationalError: true
 *       404:
 *         description: Admin not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorObj'
 *             example:
 *               message: "Admin not found with the provided ID"
 *               statusCode: 404
 *               success: false
 *               isOperationalError: true
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorObj'
 *             example:
 *               message: "Internal server error"
 *               statusCode: 500
 *               success: false
 *               isOperationalError: false
 */
router.get('/admin/getAdminById/:adminId',authMiddleware,adminController.getAdminById.bind(adminController))


/**
 * @swagger
 * /admin/searchAdmin:
 *   post:
 *     summary: Search for admin users by specific field
 *     description: Search for admin users based on a search text and specific field (adminName, adminEmail, or role)
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - searchText
 *               - searchField
 *             properties:
 *               searchText:
 *                 type: string
 *                 description: Text to search for
 *                 example: "wise"
 *               searchField:
 *                 type: string
 *                 description: Field to search in
 *                 enum: [adminName, adminEmail, role]
 *                 example: "adminName"
 *     responses:
 *       200:
 *         description: Admins fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     admins:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "678f29daca5ea53ee0dd8028"
 *                           password:
 *                             type: string
 *                             example: "$2a$10$Dvl9dBbyQ3CvXTzfr3700u4ktQkiiwKTKqNb2F5glDwk5cyiGV1bq"
 *                           adminName:
 *                             type: string
 *                             example: "wise-admin"
 *                           adminEmail:
 *                             type: string
 *                             example: "wisedvadmin@bozu.us"
 *                           role:
 *                             type: string
 *                             example: "SUPERADMIN"
 *                           __v:
 *                             type: number
 *                             example: 0
 *                     count:
 *                       type: integer
 *                       description: Number of admins found
 *                       example: 5
 *                 message:
 *                   type: string
 *                   example: "Admins fetched successfully"
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 isOperationalError:
 *                   type: boolean
 *                   example: false
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "searchText and searchField are required"
 *                 statusCode:
 *                   type: number
 *                   example: 400
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 isOperationalError:
 *                   type: boolean
 *                   example: true
 *       404:
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No admins found"
 *                 statusCode:
 *                   type: number
 *                   example: 404
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 isOperationalError:
 *                   type: boolean
 *                   example: true
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorObj'
 */
router.post('/admin/searchAdmin',authMiddleware,adminController.searchAdmin.bind(adminController))

// /**
//  * @swagger
//  * /admin/deleteAdminbyId/{adminId}:
//  *   delete:
//  *     summary: Delete an admin user by ID
//  *     description: Delete an existing admin user by their ID. Requires authentication.
//  *     tags: [Admin]
//  *     parameters:
//  *       - in: path
//  *         name: adminId
//  *         required: true
//  *         schema:
//  *           type: string
//  *           example: "679afe16dd26149ee6aec91d"
//  */
router.delete('/admin/deleteAdminbyId/:adminId',authMiddleware,adminController.deleteAdmin.bind(adminController))


export default router;