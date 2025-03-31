import { Router } from 'express';
import { EvenController } from '../Controller/eventController';
import authMiddleware from '../Middleware/authMiddleware';
const router = Router();

let eventController: EvenController = new EvenController();


/**
 * @openapi
 * /user/event/postEvent:
 *   post:
 *     summary: Create a new event log
 *     tags:
 *       - Event
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddEvent'
 *     responses:
 *       201:
 *         description: Event log created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: event log created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     addedEventLog:
 *                       $ref: '#/components/schemas/EventLog'
 *                     eventLogId:
 *                       type: string
 *                       example: 60c72b2f9b7e4c5f8e4f6a2b
 *                     eventId:
 *                       type: number
 *                       example: 12345
 *       400:
 *         description: Bad request
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
router.post('/user/event/postEvent', authMiddleware, eventController.postEvent.bind(eventController));

/**
 * @openapi
 * /user/event/putEvent/{eventId}:
 *   put:
 *     summary: Update existing event log
 *     tags:
 *       - Event
 *     parameters:
 *       - in: path
 *         name: eventId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the event log to be updated
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddEvent'
 *     responses:
 *       200:
 *         description: Event log updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: event log updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     updatedEventLog:
 *                       $ref: '#/components/schemas/EventLog'
 *                     eventLogId:
 *                       type: string
 *                       example: 60c72b2f9b7e4c5f8e4f6a2b
 *                     eventId:
 *                       type: number
 *                       example: 12345
 *       400:
 *         description: Bad request
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
router.put('/user/event/putEvent/:eventId', authMiddleware, eventController.putEventWithEventID.bind(eventController));

/**
 * @openapi
 * /user/event/patchEvent/{eventId}:
 *   patch:
 *     summary: Partially update an existing event log
 *     tags:
 *       - Event
 *     parameters:
 *       - in: path
 *         name: eventId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the event log to be updated
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddEvent'
 *     responses:
 *       200:
 *         description: Event log updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: event log updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     updatedEventLog:
 *                       $ref: '#/components/schemas/EventLog'
 *                     eventLogId:
 *                       type: string
 *                       example: 60c72b2f9b7e4c5f8e4f6a2b
 *                     eventId:
 *                       type: number
 *                       example: 12345
 *       400:
 *         description: Bad request
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
router.patch('/user/event/patchEvent/:eventId',authMiddleware, eventController.patchEventWithEventID.bind(eventController));

/**
 * @openapi
 * /user/event/getEvent:
 *   get:
 *     summary: Retrieve a paginated list of event logs
 *     tags:
 *       - Event
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *         description: The number of items per page
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *         description: The order of sorting
 *       - in: query
 *         name: includeactualTime
 *         schema:
 *           type: boolean
 *         description: Flag to include actual time in the response
 *     responses:
 *       200:
 *         description: Event log with pagination without actual time
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EventLogsResponse'
 *       201:
 *         description: Event log with pagination and actual time
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EventLogsWithActualTimeAndPaginationInfo'
 *       400:
 *         description: Bad request
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
router.get('/user/event/getEvent',authMiddleware, eventController.getEvent.bind(eventController));

/**
 * @openapi
 * /user/event/getEventV2:
 *   post:
 *     summary: Retrieve a paginated list of event logs
 *     tags:
 *       - Event
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
 *                 description: The page number for pagination
 *               limit:
 *                 type: integer
 *                 default: 5
 *                 description: The number of items per page
 *               sortOrder:
 *                 type: string
 *                 enum: [asc, desc]
 *                 default: asc
 *                 description: The order of sorting
 *               includeactualTime:
 *                 type: boolean
 *                 description: Flag to include actual time in the response
 *     responses:
 *       200:
 *         description: Event log with pagination without actual time
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EventLogsResponse'
 *       201:
 *         description: Event log with pagination and actual time
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EventLogsWithActualTimeAndPaginationInfo'
 *       400:
 *         description: Bad request
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
router.post('/user/event/getEventV2', authMiddleware, eventController.getEventV2.bind(eventController));

/**
 * @openapi
 * /user/event/getEvent/{eventId}:
 *   get:
 *     summary: Retrieve event details by event ID
 *     description: Fetches event information along with its actual time details using the provided event ID.
 *     tags:
 *       - Event
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the event to retrieve.
 *     responses:
 *       200:
 *         description: Event details retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     event:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: "679882019a3aa2702e6d9387"
 *                         eventId:
 *                           type: integer
 *                           example: 253
 *                         eventName:
 *                           type: string
 *                           example: "Event Test With Peer"
 *                         eventNumber:
 *                           type: string
 *                           example: "Ok"
 *                         eventType:
 *                           type: string
 *                           example: "hgdfhgfh"
 *                         eventDate:
 *                           type: string
 *                           format: date-time
 *                           example: "2056-10-05T13:03:30.000Z"
 *                         eventStartTime:
 *                           type: string
 *                           format: date-time
 *                           example: "2056-10-05T13:03:30.000Z"
 *                         eventEndTime:
 *                           type: string
 *                           format: date-time
 *                           example: "2056-10-05T13:03:40.000Z"
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-01-28T07:06:41.125Z"
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-01-28T09:29:32.304Z"
 *                         __v:
 *                           type: integer
 *                           example: 0
 *                         actualTime:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               _id:
 *                                 type: string
 *                                 example: "6798a89d577f484d28a33f8c"
 *                               eventLogId:
 *                                 type: string
 *                                 example: "679882019a3aa2702e6d9387"
 *                               eventId:
 *                                 type: integer
 *                                 example: 253
 *                               actualStartTime:
 *                                 type: string
 *                                 format: date-time
 *                                 example: "2025-01-27T11:10:50.000Z"
 *                               actualEndTime:
 *                                 type: string
 *                                 format: date-time
 *                                 nullable: true
 *                                 example: null
 *                               createdAt:
 *                                 type: string
 *                                 format: date-time
 *                                 example: "2025-01-28T09:51:25.859Z"
 *                               updatedAt:
 *                                 type: string
 *                                 format: date-time
 *                                 example: "2025-01-28T09:51:25.859Z"
 *                               __v:
 *                                 type: integer
 *                                 example: 0
 *                 message:
 *                   type: string
 *                   example: "event log updated successfully"
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 isOperationalError:
 *                   type: boolean
 *                   example: false
 *       400:
 *         description: Bad request. Event ID is missing or invalid.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorObj'
 *       404:
 *         description: Event not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorObj'
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorObj'
 */
router.get('/user/event/getEvent/:eventId', authMiddleware, eventController.getEventWithEventID.bind(eventController));

/**
 * @openapi
 * /user/event/postEventActualStartTime/{eventId}:
 *   post:
 *     summary: Add actual start time for an event
 *     description: Adds the actual start time for a specific event using the provided event ID and actual time data.
 *     tags:
 *       - Event
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the event to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               actualStartTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-01-27T11:10:50.000Z"
 *                 description: The actual start time of the event.
 *     responses:
 *       201:
 *         description: Actual start time added successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     event:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: "679882019a3aa2702e6d9387"
 *                         eventId:
 *                           type: integer
 *                           example: 253
 *                         eventName:
 *                           type: string
 *                           example: "Event Test With Peer"
 *                         eventNumber:
 *                           type: string
 *                           example: "Ok"
 *                         eventType:
 *                           type: string
 *                           example: "hgdfhgfh"
 *                         eventDate:
 *                           type: string
 *                           format: date-time
 *                           example: "2056-10-05T13:03:30.000Z"
 *                         eventStartTime:
 *                           type: string
 *                           format: date-time
 *                           example: "2056-10-05T13:03:30.000Z"
 *                         eventEndTime:
 *                           type: string
 *                           format: date-time
 *                           example: "2056-10-05T13:03:40.000Z"
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-01-28T07:06:41.125Z"
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-01-28T09:29:32.304Z"
 *                         __v:
 *                           type: integer
 *                           example: 0
 *                     actualEventTimeLog:
 *                       type: object
 *                       properties:
 *                         eventLogId:
 *                           type: string
 *                           example: "679882019a3aa2702e6d9387"
 *                         eventId:
 *                           type: integer
 *                           example: 253
 *                         actualStartTime:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-01-27T11:10:50.000Z"
 *                         actualEndTime:
 *                           type: string
 *                           format: date-time
 *                           nullable: true
 *                           example: null
 *                         _id:
 *                           type: string
 *                           example: "6798bc416b777ab0d0c62723"
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-01-28T11:15:13.632Z"
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-01-28T11:15:13.632Z"
 *                         __v:
 *                           type: integer
 *                           example: 0
 *                     id:
 *                       type: string
 *                       example: "6798bc416b777ab0d0c62723"
 *                     eventId:
 *                       type: integer
 *                       example: 253
 *                 message:
 *                   type: string
 *                   example: "event log updated successfully"
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 isOperationalError:
 *                   type: boolean
 *                   example: false
 *       400:
 *         description: Bad request. Event ID or actualStartTime is missing or invalid.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorObj'
 *       404:
 *         description: Event not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorObj'
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorObj'
 */
router.post('/user/event/postEventActualStartTime/:eventId', authMiddleware, eventController.postEventActualStartTime.bind(eventController));


/**
 * @openapi
 * /user/event/putEventActualEndTime:
 *   put:
 *     summary: Update the actual end time for an event
 *     description: Updates the actual end time for an event using either the event ID or the actual time log ID. Returns different responses based on whether `eventId` or `actualTimeLogId` is provided.
 *     tags:
 *       - Event
 *     parameters:
 *       - in: query
 *         name: eventId
 *         schema:
 *           type: string
 *         description: The ID of the event to update. Either `eventId` or `actualTimeLogId` is required.
 *       - in: query
 *         name: actualTimeLogId
 *         schema:
 *           type: string
 *         description: The ID of the actual time log to update. Either `eventId` or `actualTimeLogId` is required.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               actualEndTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-01-27T11:10:50.000Z"
 *                 description: The actual end time of the event.
 *     responses:
 *       201:
 *         description: Actual end time updated successfully. Returns different responses based on the query parameter used.
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         actualEventTimeLog:
 *                           type: integer
 *                           example: 0
 *                         actualEndTime:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               _id:
 *                                 type: string
 *                                 example: "67977e5d19131b4ad9c0694c"
 *                               eventLogId:
 *                                 type: string
 *                                 example: "67977e5219131b4ad9c06949"
 *                               eventId:
 *                                 type: integer
 *                                 example: 112
 *                               actualStartTime:
 *                                 type: string
 *                                 format: date-time
 *                                 example: "2025-01-27T11:10:50.000Z"
 *                               actualEndTime:
 *                                 type: string
 *                                 format: date-time
 *                                 example: "2025-01-27T11:50:50.000Z"
 *                               createdAt:
 *                                 type: string
 *                                 format: date-time
 *                                 example: "2025-01-27T12:38:53.093Z"
 *                               updatedAt:
 *                                 type: string
 *                                 format: date-time
 *                                 example: "2025-01-27T12:39:15.503Z"
 *                               __v:
 *                                 type: integer
 *                                 example: 0
 *                     message:
 *                       type: string
 *                       example: "actual endTimeevent log updated successfully"
 *                     statusCode:
 *                       type: integer
 *                       example: 200
 *                     success:
 *                       type: boolean
 *                       example: true
 *                     isOperationalError:
 *                       type: boolean
 *                       example: false
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: "679751f02e731c4bdd7165cb"
 *                         eventLogId:
 *                           type: string
 *                           example: "679751da2e731c4bdd7165c8"
 *                         eventId:
 *                           type: integer
 *                           example: 11
 *                         actualStartTime:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-01-27T11:10:50.000Z"
 *                         actualEndTime:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-01-27T11:50:50.000Z"
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-01-27T09:29:20.072Z"
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-01-28T11:36:10.577Z"
 *                         __v:
 *                           type: integer
 *                           example: 0
 *                     message:
 *                       type: string
 *                       example: "event log updated successfully"
 *                     statusCode:
 *                       type: integer
 *                       example: 200
 *                     success:
 *                       type: boolean
 *                       example: true
 *                     isOperationalError:
 *                       type: boolean
 *                       example: false
 *       400:
 *         description: Bad request. Either `eventId` or `actualTimeLogId` is required, or `actualEndTime` is missing.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorObj'
 *       404:
 *         description: Event or actual time log not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorObj'
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorObj'
 */
router.put('/user/event/putEventActualEndTime', authMiddleware, eventController.putEventActualEndTime.bind(eventController));

/**
 * @openapi
 * /user/event/getEventWithPeers:
 *   post:
 *     summary: Retrieve event logs with optional peer details
 *     description: Fetch paginated event logs with sorting options. Optionally includes peer details.
 *     tags:
 *       - Event
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
 *                 default: 5
 *                 description: Number of records per page
 *               sortOrder:
 *                 type: string
 *                 enum: [asc, desc]
 *                 default: asc
 *                 description: Sorting order (ascending or descending)
 *               includePeer:
 *                 type: boolean
 *                 default: false
 *                 description: Whether to include peer details
 *     responses:
 *       200:
 *         description: Successful response with event logs and peers (all)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EventLogsWithPeersResponse'
 *       201:
 *         description: Successful response with event logs and  event instances with actual time
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EventLogsWithEventInstanceResponse'
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorObj'
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorObj'
 */
router.post('/user/event/getEventWithPeers/', eventController.getEventWithPeers.bind(eventController))

/**
 * @openapi
 * /user/event/search:
 *   post:
 *     summary: Search event logs with optional peer information.
 *     description: Searches for event logs based on a specified field and text. Optionally includes peer information in the response.
 *     tags:
 *       - Event 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               searchField:
 *                 type: string
 *                 default: ""
 *                 enum: [eventName, description, createdAt, location]
 *               searchText:
 *                 type: string
 *                 default: ""
 *               includePeer:
 *                 type: boolean
 *                 default: false
 *             required:
 *               - searchField
 *               - searchText
 *     responses:
 *       200:
 *         description: Successful response with searched event logs and  peers
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EventLogsSearchWithPeersResponse'
 *       201:
 *         description: Successful response with searched event logs event instances with actual time
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EventLogsWithEventInstanceSearchResponse'
 *       '400':
 *         description: Bad request. Invalid search field or empty search text.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: "Invalid search field: 'invalidField'. Allowed fields are: eventName, description, createdAt, location"
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: "An unexpected error occurred."
 */
router.post('/user/event/search',authMiddleware, eventController.searchEventWithPeers.bind(eventController));


/**
 * @openapi
 * /user/event/getEventWithAllInfoByEventId:
 *   post:
 *     summary: Get event logs by event ID with optional peer information
 *     description: Fetches event logs based on the provided event ID. If includePeer flag is set to true, the response will include peer information associated with the event.
 *     tags:
 *       - Event
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               eventId:
 *                 type: integer
 *                 description: The unique identifier of the event to retrieve
 *                 example: 123
 *               includePeer:
 *                 type: boolean
 *                 description: Whether to include peer information in the response
 *                 default: false
 *                 example: true
 *             required:
 *               - eventId
 *     responses:
 *       200:
 *         description: Event logs retrieved successfully with peer information
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EventLogsWithPeersResponse'
 *       201:
 *         description: Event logs retrieved successfully with actual time information
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EventLogsWithEventInstanceResponse'
 *       400:
 *         description: Bad request - Invalid input parameters
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
router.post('/user/event/getEventWithAllInfoByEventId', authMiddleware, eventController.getEventWithEventIDWithPeers.bind(eventController));

router.delete('/user/event/deleteEvent/:eventId', eventController.deleteEvent.bind(eventController));



//router.post('event/postEventActualStartTime/:eventId',eventController.postActualEventStartTime.bind(eventController));   
//router.patch('/event/patchEvent/:eventId',eventController.patchEvent.bind(eventController));

export default router;