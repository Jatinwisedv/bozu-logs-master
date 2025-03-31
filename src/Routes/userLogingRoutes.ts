import { Router } from 'express';
import { EvenController } from '../Controller/eventController';
import { UserLoginLogController } from '../Controller/userLoginLogController';
import authMiddleware from '../Middleware/authMiddleware';
const router = Router();

const userLoginLogController: UserLoginLogController = new UserLoginLogController();


/**
 * @openapi
 * /user/userLoging/postUserLoginLog:
 *   post:
 *     summary: Create a user login log entry
 *     description: Logs a user's login attempt with details such as device, IP address, and location.
 *     operationId: postUserLoginLog
 *     tags:
 *       - User Login Logs
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddUserLoginLog'
 *     responses:
 *       '201':
 *         description: Successfully created a user login log entry.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     addedUserLoginLog:
 *                       $ref: '#/components/schemas/UserLoginLog'
 *                     loginLogid:
 *                       type: string
 *                       example: "679a34b0a159f69e957b90e0"
 *                 message:
 *                   type: string
 *                   example: "user-login-log created successfully"
 *                 statusCode:
 *                   type: integer
 *                   example: 201
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 isOperationalError:
 *                   type: boolean
 *                   example: false
 *       '400':
 *         description: Validation error (e.g., id or _id present in request body).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorObj'
 *       '500':
 *         description: Internal server error while creating login log.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorObj'
 *
 */
router.post('/user/userLoging/postUserLoginLog', userLoginLogController.postUserLoginLog.bind(userLoginLogController));


/**
 * @openapi
 * /user/userLoging/postUserLoginLogWithIp:
 *   post:
 *     summary: Create a user login log with IP information
 *     description: Logs a user's login attempt, fetches additional IP-based location details, and stores the log.
 *     operationId: postUserLoginLogWithIpInfo
 *     tags:
 *       - User Login Logs
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - username
 *               - name
 *               - deviceSource
 *               - ipAddress
 *               - startTime
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 123
 *               username:
 *                 type: string
 *                 example: "nusarat_haveliwala"
 *               name:
 *                 type: string
 *                 example: "Nusarat Haveliwala"
 *               deviceSource:
 *                 type: string
 *                 example: "Web"
 *               ipAddress:
 *                 type: string
 *                 format: ipv4
 *                 example: "103.241.224.163"
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-01-29T14:01:20.705Z"
 *     responses:
 *       '201':
 *         description: Successfully created a user login log entry with IP-based location details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     addedUserLoginLog:
 *                       $ref: '#/components/schemas/UserLoginLog'
 *                     loginLogid:
 *                       type: string
 *                       example: "679a34b0a159f69e957b90e0"
 *                 message:
 *                   type: string
 *                   example: "user-login-log created successfully"
 *                 statusCode:
 *                   type: integer
 *                   example: 201
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 isOperationalError:
 *                   type: boolean
 *                   example: false
 *       '400':
 *         description: Validation error (e.g., missing required fields, invalid IP, etc.).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorObj'
 *       '500':
 *         description: Internal server error while creating login log.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorObj'
 *
 * components:
 *   schemas:
 *     UserLoginLog:
 *       type: object
 *       properties:
 *         userId:
 *           type: integer
 *           example: 123
 *         username:
 *           type: string
 *           example: "nusarat_haveliwala"
 *         name:
 *           type: string
 *           example: "Nusarat Haveliwala"
 *         deviceSource:
 *           type: string
 *           example: "Web"
 *         ipAddress:
 *           type: string
 *           example: "103.241.224.163"
 *         startTime:
 *           type: string
 *           format: date-time
 *           example: "2025-01-29T14:01:20.705Z"
 *         loginStatus:
 *           type: boolean
 *           example: true
 *         logoutStatus:
 *           type: boolean
 *           example: false
 *         endTime:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         city:
 *           type: string
 *           nullable: true
 *           example: "New York"
 *         state:
 *           type: string
 *           nullable: true
 *           example: "New York"
 *         country:
 *           type: string
 *           nullable: true
 *           example: "USA"
 *         latitude:
 *           type: number
 *           nullable: true
 *           example: 40.7128
 *         longitude:
 *           type: number
 *           nullable: true
 *           example: -74.0060
 *         postalCode:
 *           type: string
 *           nullable: true
 *           example: "10001"
 *         userAgent:
 *           type: string
 *           nullable: true
 *           example: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
 *         isp:
 *           type: string
 *           nullable: true
 *           example: "XYZ Telecom"
 *         _id:
 *           type: string
 *           example: "679a34b0a159f69e957b90e0"
 *         __v:
 *           type: integer
 *           example: 0
 */
router.post('/user/userLoging/postUserLoginLogWithIp',authMiddleware,  userLoginLogController.postUserLoginLogWithIpInfo.bind(userLoginLogController));


/**
 * @openapi
 * /userLoging/putUserLoginLog/{userLoginLogId}:
 *   put:
 *     summary: Update a user login log entry
 *     description: Updates an existing user login log entry with the provided details.
 *     operationId: putUserLoginLog
 *     tags:
 *       - User Login Logs
 *     parameters:
 *       - name: userLoginLogId
 *         in: path
 *         required: true
 *         description: The ID of the user login log to update.
 *         schema:
 *           type: string
 *           example: "678e2e68e5f11bda9db87516"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - username
 *               - name
 *               - deviceSource
 *               - ipAddress
 *               - startTime
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 123
 *               username:
 *                 type: string
 *                 example: "nusarat_haveliwala put"
 *               name:
 *                 type: string
 *                 example: "Nusarat Haveliwalaput"
 *               deviceSource:
 *                 type: string
 *                 example: "Web"
 *               ipAddress:
 *                 type: string
 *                 format: ipv4
 *                 example: "192.168.1.1"
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-01-20T06:04:47.747Z"
 *               loginStatus:
 *                 type: boolean
 *                 example: true
 *               logoutStatus:
 *                 type: boolean
 *                 example: false
 *               endTime:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *                 example: "2056-09-24T11:25:40.000Z"
 *               city:
 *                 type: string
 *                 nullable: true
 *                 example: "Vadodara put"
 *               state:
 *                 type: string
 *                 nullable: true
 *                 example: "Gujrat put"
 *               country:
 *                 type: string
 *                 nullable: true
 *                 example: "India"
 *               latitude:
 *                 type: number
 *                 nullable: true
 *                 example: 4555
 *               longitude:
 *                 type: number
 *                 nullable: true
 *                 example: 6544
 *               postalCode:
 *                 type: string
 *                 nullable: true
 *                 example: "You put"
 *               userAgent:
 *                 type: string
 *                 nullable: true
 *                 example: "You put"
 *               isp:
 *                 type: string
 *                 nullable: true
 *                 example: "You put"
 *     responses:
 *       '200':
 *         description: Successfully updated the user login log entry.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     updatedUserLoginLog:
 *                       $ref: '#/components/schemas/UserLoginLog'
 *                 message:
 *                   type: string
 *                   example: "user login log updated successfully"
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 isOperationalError:
 *                   type: boolean
 *                   example: false
 *       '400':
 *         description: Validation error (e.g., missing required fields, invalid ID, etc.).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorObj'
 *       '404':
 *         description: User login log not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorObj'
 *       '500':
 *         description: Internal server error while updating the login log.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorObj'
 *
 * components:
 *   schemas:
 *     UserLoginLog:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "678e2e68e5f11bda9db87516"
 *         userId:
 *           type: integer
 *           example: 123
 *         username:
 *           type: string
 *           example: "nusarat_haveliwala put"
 *         name:
 *           type: string
 *           example: "Nusarat Haveliwalaput"
 *         deviceSource:
 *           type: string
 *           example: "Web"
 *         ipAddress:
 *           type: string
 *           example: "192.168.1.1"
 *         startTime:
 *           type: string
 *           format: date-time
 *           example: "2025-01-20T06:04:47.747Z"
 *         loginStatus:
 *           type: boolean
 *           example: true
 *         logoutStatus:
 *           type: boolean
 *           example: false
 *         endTime:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: "2056-09-24T11:25:40.000Z"
 *         city:
 *           type: string
 *           nullable: true
 *           example: "Vadodara put"
 *         state:
 *           type: string
 *           nullable: true
 *           example: "Gujrat put"
 *         country:
 *           type: string
 *           nullable: true
 *           example: "India"
 *         latitude:
 *           type: number
 *           nullable: true
 *           example: 4555
 *         longitude:
 *           type: number
 *           nullable: true
 *           example: 6544
 *         postalCode:
 *           type: string
 *           nullable: true
 *           example: "You put"
 *         userAgent:
 *           type: string
 *           nullable: true
 *           example: "You put"
 *         isp:
 *           type: string
 *           nullable: true
 *           example: "You put"
 *         __v:
 *           type: integer
 *           example: 0
 */
router.put('/userLoging/putUserLoginLog/:userLoginLogId',authMiddleware,  userLoginLogController.putUserLoginLog.bind(userLoginLogController));

/**
 * @openapi
 * /user/userLoging/patchUserLoginLog/{userLoginLogId}:
 *   patch:
 *     summary: Partially update a user login log entry
 *     description: Updates specific fields of an existing user login log entry.
 *     operationId: patchUserLoginLog
 *     tags:
 *       - User Login Logs
 *     parameters:
 *       - name: userLoginLogId
 *         in: path
 *         required: true
 *         description: The ID of the user login log to update.
 *         schema:
 *           type: string
 *           example: "678de77f922687ad5a47b34e"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 123
 *               username:
 *                 type: string
 *                 example: "nusarat_haveliwala patch"
 *               name:
 *                 type: string
 *                 example: "Nusarat Haveliwala patch"
 *               deviceSource:
 *                 type: string
 *                 example: "Web"
 *               ipAddress:
 *                 type: string
 *                 format: ipv4
 *                 example: "192.168.1.1"
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-01-20T06:04:47.747Z"
 *               loginStatus:
 *                 type: boolean
 *                 example: true
 *               logoutStatus:
 *                 type: boolean
 *                 example: false
 *               endTime:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *                 example: "2056-09-24T11:25:40.000Z"
 *               city:
 *                 type: string
 *                 nullable: true
 *                 example: "Vadodara put patch"
 *               state:
 *                 type: string
 *                 nullable: true
 *                 example: "Gujrat put patch"
 *               country:
 *                 type: string
 *                 nullable: true
 *                 example: "India patch"
 *               latitude:
 *                 type: number
 *                 nullable: true
 *                 example: 4555
 *               longitude:
 *                 type: number
 *                 nullable: true
 *                 example: 6544
 *               postalCode:
 *                 type: string
 *                 nullable: true
 *                 example: "You patch"
 *               userAgent:
 *                 type: string
 *                 nullable: true
 *                 example: "You patch"
 *               isp:
 *                 type: string
 *                 nullable: true
 *                 example: "You put"
 *     responses:
 *       '200':
 *         description: Successfully updated the user login log entry.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     updatedUserLoginLog:
 *                       $ref: '#/components/schemas/UserLoginLog'
 *                 message:
 *                   type: string
 *                   example: "user login log updated successfully"
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 isOperationalError:
 *                   type: boolean
 *                   example: false
 *       '400':
 *         description: Validation error (e.g., missing required fields, invalid ID, etc.).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorObj'
 *       '404':
 *         description: User login log not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorObj'
 *       '500':
 *         description: Internal server error while updating the login log.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorObj'
 *
 * components:
 *   schemas:
 *     UserLoginLog:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "678de77f922687ad5a47b34e"
 *         userId:
 *           type: integer
 *           example: 123
 *         username:
 *           type: string
 *           example: "nusarat_haveliwala patch"
 *         name:
 *           type: string
 *           example: "Nusarat Haveliwala patch"
 *         deviceSource:
 *           type: string
 *           example: "Web"
 *         ipAddress:
 *           type: string
 *           example: "192.168.1.1"
 *         startTime:
 *           type: string
 *           format: date-time
 *           example: "2025-01-20T06:04:47.747Z"
 *         loginStatus:
 *           type: boolean
 *           example: true
 *         logoutStatus:
 *           type: boolean
 *           example: false
 *         endTime:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: "2056-09-24T11:25:40.000Z"
 *         city:
 *           type: string
 *           nullable: true
 *           example: "Vadodara put patch"
 *         state:
 *           type: string
 *           nullable: true
 *           example: "Gujrat put patch"
 *         country:
 *           type: string
 *           nullable: true
 *           example: "India patch"
 *         latitude:
 *           type: number
 *           nullable: true
 *           example: 4555
 *         longitude:
 *           type: number
 *           nullable: true
 *           example: 6544
 *         postalCode:
 *           type: string
 *           nullable: true
 *           example: "You patch"
 *         userAgent:
 *           type: string
 *           nullable: true
 *           example: "You patch"
 *         isp:
 *           type: string
 *           nullable: true
 *           example: "You put"
 *         __v:
 *           type: integer
 *           example: 0
 *     ErrorObj:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "An error occurred"
 *         statusCode:
 *           type: integer
 *           example: 400
 *         success:
 *           type: boolean
 *           example: false
 */
router.patch('/user/userLoging/patchUserLoginLog/:userLoginLogId',authMiddleware,  userLoginLogController.patchUserLoginLog.bind(userLoginLogController));

/**
 * @openapi
 * /user/userLoging/getUserLoginLogById/{userLoginLogId}:
 *   get:
 *     summary: Get a specific user login log entry by ID
 *     description: Retrieves the details of a user login log based on the provided user login log ID.
 *     operationId: getUserLoginLogById
 *     tags:
 *       - User Login Logs
 *     parameters:
 *       - name: userLoginLogId
 *         in: path
 *         required: true
 *         description: The ID of the user login log to fetch.
 *         schema:
 *           type: string
 *           example: "678de77f922687ad5a47b34e"
 *     responses:
 *       '200':
 *         description: Successfully retrieved the user login log entry.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     userLoginLog:
 *                       $ref: '#/components/schemas/UserLoginLog'
 *                 message:
 *                   type: string
 *                   example: "User login log fetched successfully"
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 isOperationalError:
 *                   type: boolean
 *                   example: false
 *       '400':
 *         description: Validation error (e.g., missing required fields, invalid ID, etc.).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorObj'
 *       '404':
 *         description: User login log not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorObj'
 *       '500':
 *         description: Internal server error while fetching the user login log.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorObj'
 *
 * components:
 *   schemas:
 *     UserLoginLog:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "678e2e68e5f11bda9db87516"
 *         userId:
 *           type: integer
 *           example: 123
 *         username:
 *           type: string
 *           example: "nusarat_haveliwala put"
 *         name:
 *           type: string
 *           example: "Nusarat Haveliwalaput"
 *         deviceSource:
 *           type: string
 *           example: "Web"
 *         ipAddress:
 *           type: string
 *           example: "192.168.1.1"
 *         startTime:
 *           type: string
 *           format: date-time
 *           example: "2025-01-20T06:04:47.747Z"
 *         loginStatus:
 *           type: boolean
 *           example: true
 *         logoutStatus:
 *           type: boolean
 *           example: false
 *         endTime:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: "2056-09-24T11:25:40.000Z"
 *         city:
 *           type: string
 *           nullable: true
 *           example: "Vadodara put"
 *         state:
 *           type: string
 *           nullable: true
 *           example: "Gujrat put"
 *         country:
 *           type: string
 *           nullable: true
 *           example: "India"
 *         latitude:
 *           type: number
 *           nullable: true
 *           example: 4555
 *         longitude:
 *           type: number
 *           nullable: true
 *           example: 6544
 *         postalCode:
 *           type: string
 *           nullable: true
 *           example: "You put"
 *         userAgent:
 *           type: string
 *           nullable: true
 *           example: "You put"
 *         isp:
 *           type: string
 *           nullable: true
 *           example: "You put"
 *         __v:
 *           type: integer
 *           example: 0
 */
router.get('/user/userLoging/getUserLoginLogById/:userLoginLogId',authMiddleware,  userLoginLogController.getUserLoginLogById.bind(userLoginLogController));

/**
 * @openapi
 * /user/userLoging/putUserLogoutTime/{userLoginLogId}:
 *   patch:
 *     summary: Update the logout time of a user login log entry
 *     description: Updates the `endTime` of a user login log entry to the current time when the user logs out.
 *     operationId: putLogoutTime
 *     tags:
 *       - User Login Logs
 *     parameters:
 *       - name: userLoginLogId
 *         in: path
 *         required: true
 *         description: The ID of the user login log to update.
 *         schema:
 *           type: string
 *           example: "678e27aaefcd5ec62e8a3374"
 *     responses:
 *       '200':
 *         description: Successfully updated the user login log entry with the logout time.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     updatedUserLoginLog:
 *                       $ref: '#/components/schemas/UserLoginLog'
 *                 message:
 *                   type: string
 *                   example: "user login log updated successfully"
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 isOperationalError:
 *                   type: boolean
 *                   example: false
 *       '400':
 *         description: Validation error (e.g., missing required fields, invalid ID, etc.).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorObj'
 *       '404':
 *         description: User login log not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorObj'
 *       '500':
 *         description: Internal server error while updating the login log.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorObj'
 *
 * components:
 *   schemas:
 *     UserLoginLog:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "678e27aaefcd5ec62e8a3374"
 *         userId:
 *           type: integer
 *           example: 123
 *         username:
 *           type: string
 *           example: "nusarat_haveliwala"
 *         name:
 *           type: string
 *           example: "Nusarat Haveliwala"
 *         deviceSource:
 *           type: string
 *           example: "Web"
 *         ipAddress:
 *           type: string
 *           example: "192.168.1.1"
 *         startTime:
 *           type: string
 *           format: date-time
 *           example: "2025-01-20T10:38:34.696Z"
 *         loginStatus:
 *           type: boolean
 *           example: true
 *         logoutStatus:
 *           type: boolean
 *           example: false
 *         endTime:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: "2025-01-29T14:50:10.388Z"
 *         city:
 *           type: string
 *           nullable: true
 *           example: null
 *         state:
 *           type: string
 *           nullable: true
 *           example: null
 *         country:
 *           type: string
 *           nullable: true
 *           example: null
 *         latitude:
 *           type: number
 *           nullable: true
 *           example: null
 *         longitude:
 *           type: number
 *           nullable: true
 *           example: null
 *         postalCode:
 *           type: string
 *           nullable: true
 *           example: null
 *         userAgent:
 *           type: string
 *           nullable: true
 *           example: null
 *         isp:
 *           type: string
 *           nullable: true
 *           example: null
 *         __v:
 *           type: integer
 *           example: 0
 */
router.patch('/user/userLoging/putUserLogoutTime/:userLoginLogId',authMiddleware,  userLoginLogController.putLogoutTime.bind(userLoginLogController));

/**
 * @swagger
 * /user/userLoging/getUserLoginLog/v2:
 *   get:
 *     summary: Fetch paginated and sorted user login logs
 *     description: Fetches user login logs with pagination, sorting, and filtering.
 *     tags:
 *       - User Login Logs 
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number to retrieve.
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 5
 *         description: The number of logs per page.
 *       - in: query
 *         name: sortOrder
 *         required: false
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *         description: Sort order of the logs (ascending or descending).
 *       - in: query
 *         name: sortField
 *         required: false
 *         schema:
 *           type: string
 *           enum: [startTime, endTime, userId, username, deviceSource]
 *           default: startTime
 *         description: The field to sort by.
 *     responses:
 *       200:
 *         description: A paginated list of user login logs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     loginLogs:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             description: The unique identifier for the login log.
 *                           userId:
 *                             type: integer
 *                             description: The ID of the user who logged in.
 *                           username:
 *                             type: string
 *                             description: The username of the logged-in user.
 *                           name:
 *                             type: string
 *                             description: The name of the user.
 *                           deviceSource:
 *                             type: string
 *                             description: The device the user logged in from.
 *                           ipAddress:
 *                             type: string
 *                             description: The IP address of the user.
 *                           loginStatus:
 *                             type: boolean
 *                             description: The status of the login (true for success, false for failure).
 *                           logoutStatus:
 *                             type: boolean
 *                             description: The status of the logout (true for logged out, false for still logged in).
 *                           startTime:
 *                             type: string
 *                             format: date-time
 *                             description: The time when the user logged in.
 *                           endTime:
 *                             type: string
 *                             format: date-time
 *                             description: The time when the user logged out (if applicable).
 *                           city:
 *                             type: string
 *                             description: The city from which the user logged in.
 *                           state:
 *                             type: string
 *                             description: The state from which the user logged in.
 *                           country:
 *                             type: string
 *                             description: The country from which the user logged in.
 *                 paginationInfo:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                       description: The current page number.
 *                     totalPages:
 *                       type: integer
 *                       description: The total number of pages available.
 *                     totalEvents:
 *                       type: integer
 *                       description: The total number of login logs.
 *                     limit:
 *                       type: integer
 *                       description: The limit (number of logs per page).
 *                     sortOrder:
 *                       type: string
 *                       description: The sort order (asc/desc).
 *                     sortField:
 *                       type: string
 *                       description: The field used for sorting.
 *                     validSortFields:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: The valid fields available for sorting.
 *       '400':
 *         description: Validation error (e.g., missing required fields, invalid ID, etc.).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorObj'
 *       '404':
 *         description: User login log not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorObj'
 *       '500':
 *         description: Internal server error while updating the login log.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorObj'
 */
router.get('/user/userLoging/getUserLoginLog/v2',authMiddleware, userLoginLogController.getUserLoginLogDynamicSort.bind(userLoginLogController));

/**
 * @openapi
 * /user/userLoging/searchUserLoginLog:
 *   post:
 *     summary: Search user login logs by specific field
 *     description: Search for user login logs based on a search text and field
 *     operationId: searchUserLoginLog
 *     tags:
 *       - User Login Logs
 *     security:
 *       - bearerAuth: []
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
 *                 example: "nusarat"
 *               searchField:
 *                 type: string
 *                 enum: ['username', 'ipAddress', 'deviceSource', 'country', 'city', 'state', 'postalCode', 'isp', 'latitude', 'longitude']
 *                 example: "username"
 *     responses:
 *       '200':
 *         description: Successfully retrieved matching login logs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "user login log fetched successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     userLoginLogs:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/UserLoginLog'
 *                     totalCount:
 *                       type: integer
 *                       description: Total number of logs found
 *                       example: 5
 *       '400':
 *         description: Bad Request - Missing required fields or invalid search field
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorObj'
 *       '404':
 *         description: No logs found matching the search criteria
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorObj'
 */
router.post('/user/userLoging/searchUserLoginLog', authMiddleware, userLoginLogController.searchUserLoginLog.bind(userLoginLogController));

router.delete('/userLoging/deleteUserLoginLogById/:userLoginLogId',userLoginLogController.deleteUserLoginLog.bind(userLoginLogController));


router.get('/userLoging/getUserLoginLog/',authMiddleware, userLoginLogController.getUserLoginLog.bind(userLoginLogController));




export default router;