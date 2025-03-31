import { Router } from 'express';
import { PeerController } from '../Controller/peerController';
import authMiddleware from '../Middleware/authMiddleware';
const router = Router();

let peerController : PeerController = new PeerController();

// /**
//  * @openapi
//  * /user/peer/postPeer:
//  *   post:
//  *     summary: Create a new peer
//  *     description: Adds a new peer to the system with IP enrichment and validation.
//  *     operationId: postPeer
//  *     tags:
//  *       - Peers
//  *     requestBody:
//  *       description: Peer object that needs to be added.
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               eventId:
//  *                 type: integer
//  *                 description: The unique identifier for the event.
//  *               peerId:
//  *                 type: string
//  *                 description: The unique identifier for the peer.
//  *               ipAddress:
//  *                 type: string
//  *                 description: The IP address of the peer.
//  *               peerName:
//  *                 type: string
//  *                 description: The name of the peer.
//  *               eventJoinDatetime:
//  *                 type: date
//  *                 description: peer join date and time.
//  *             required:
//  *               - peerId
//  *               - ipAddress
//  *               - peerName
//  *               - eventId 
//  *               - eventJoinDatetime
//  *  
//  *     responses:
//  *       '201':
//  *         description: Peer created successfully.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 data:
//  *                   type: object
//  *                   properties:
//  *                     addedPeer:
//  *                       type: object
//  *                       description: The created peer object with details.
//  *                       $ref: '#/components/schemas/peerObject'
//  *                 message:
//  *                   type: string
//  *                   description: Success message indicating that the peer was created.
//  *                 statusCode:
//  *                   type: integer
//  *                   description: HTTP status code.
//  *                 success:
//  *                   type: boolean
//  *                   description: Indicates whether the request was successful.
//  *                 isOperationalError:
//  *                   type: boolean
//  *                   description: Indicates if the error was operational.
//  *       400:
//  *         description: Bad request
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
 * @openapi
 * /user/peer/postPeer:
 *   post:
 *     summary: Create a new peer
 *     description: Adds a new peer to the system with IP enrichment and validation.
 *     operationId: postPeer
 *     tags:
 *       - Peers
 *     requestBody:
 *       description: Peer object that needs to be added.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               eventId:
 *                 type: integer
 *                 description: The unique identifier for the event.
 *                 example: 12345
 *               peerId:
 *                 type: string
 *                 description: The unique identifier for the peer.
 *                 example: "peer123"
 *               ipAddress:
 *                 type: string
 *                 description: The IP address of the peer.
 *                 example: "192.168.1.1"
 *               peerName:
 *                 type: string
 *                 description: The name of the peer.
 *                 example: "Test Peer"
 *               eventJoinDatetime:
 *                 type: string
 *                 format: date
 *                 description: Peer join date and time.
 *                 example: "2025-01-29"
 *             required:
 *               - peerId
 *               - ipAddress
 *               - peerName
 *               - eventId 
 *               - eventJoinDatetime
 *  
 *     responses:
 *       '201':
 *         description: Peer created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     addedPeer:
 *                       type: object
 *                       description: The created peer object with details.
 *                       $ref: '#/components/schemas/peerObject'
 *                     peerLogId:
 *                       type: string
 *                       description: The unique log ID for the peer.
 *                       example: "6799e5a753f36923a685eec9"
 *                 message:
 *                   type: string
 *                   description: Success message indicating that the peer was created.
 *                   example: "Peer created successfully"
 *                 statusCode:
 *                   type: integer
 *                   description: HTTP status code.
 *                   example: 201
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the request was successful.
 *                   example: true
 *                 isOperationalError:
 *                   type: boolean
 *                   description: Indicates if the error was operational.
 *                   example: false
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
router.post('/user/peer/postPeer',authMiddleware,peerController.postPeer.bind(peerController));

/**
 * @openapi
 * /user/peer/putPeer:
 *   put:
 *     summary: Update an existing peer
 *     description: Updates an existing peer in the system with new information.
 *     operationId: putPeer
 *     tags:
 *       - Peers
 *     parameters:
 *       - name: peerLogId
 *         in: query
 *         required: false
 *         description: The unique log ID of the peer to update.
 *         schema:
 *           type: string
 *           example: "6799e5a753f36923a685eec9"
 *       - name: peerId
 *         in: query
 *         required: false
 *         description: The unique peer ID of the peer to update.
 *         schema:
 *           type: string
 *           example: "peer123"
 *     requestBody:
 *       description: Peer object that needs to be updated.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/addPeerObject'
 *  
 *     responses:
 *       '200':
 *         description: Peer updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     updatedPeer:
 *                       type: object
 *                       description: The updated peer object with details.
 *                       $ref: '#/components/schemas/peerObject'
 *                 message:
 *                   type: string
 *                   description: Success message indicating that the peer was updated.
 *                   example: "Peer updated successfully"
 *                 statusCode:
 *                   type: integer
 *                   description: HTTP status code.
 *                   example: 200
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the request was successful.
 *                   example: true
 *                 isOperationalError:
 *                   type: boolean
 *                   description: Indicates if the error was operational.
 *                   example: false
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
router.put('/user/peer/putPeer',authMiddleware,peerController.putPeer.bind(peerController));

/**
 * @openapi
 * /user/peer/getPeer:
 *   get:
 *     summary: Get a paginated list of peers
 *     description: Retrieves a list of peers with pagination, sorting, and filtering.
 *     operationId: getPeers
 *     tags:
 *       - Peers
 *     parameters:
 *       - name: page
 *         in: query
 *         required: false
 *         description: Page number for pagination (default is 1).
 *         schema:
 *           type: integer
 *           example: 1
 *       - name: limit
 *         in: query
 *         required: false
 *         description: Number of peers per page (default is 5).
 *         schema:
 *           type: integer
 *           example: 5
 *       - name: sortOrder
 *         in: query
 *         required: false
 *         description: Sorting order (`asc` or `desc`, default is `asc`).
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           example: asc
 *       - name: sortField
 *         in: query
 *         required: false
 *         description: Field to sort by (default is `eventJoinDatetime`).
 *         schema:
 *           type: string
 *           enum: [eventJoinDatetime, eventLeftDatetime, peerName]
 *           example: eventJoinDatetime
 *     responses:
 *       '200':
 *         description: Successfully fetched paginated peers.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     peers:
 *                       type: array
 *                       description: List of peers.
 *                       items:
 *                         $ref: '#/components/schemas/peerObject'
 *                     paginationInfo:
 *                       type: object
 *                       properties:
 *                         currentPage:
 *                           type: integer
 *                           example: 1
 *                         totalPages:
 *                           type: integer
 *                           example: 5
 *                         totalPeers:
 *                           type: integer
 *                           example: 23
 *                         limit:
 *                           type: integer
 *                           example: 5
 *                         sortOrder:
 *                           type: string
 *                           enum: [asc, desc]
 *                           example: asc
 *                         sortField:
 *                           type: string
 *                           example: eventJoinDatetime
 *                         validSortFields:
 *                           type: array
 *                           items:
 *                             type: string
 *                           example: ["eventJoinDatetime", "eventLeftDatetime", "peerName"]
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                   example: "Peers fetched successfully"
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
 *         description: Invalid sorting field or pagination error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorObj'
 *       '404':
 *         description: No peers found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorObj'
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorObj'
 */
router.get('/user/peer/getPeer',authMiddleware,peerController.getPeers.bind(peerController));

/**
 * @openapi
 * /user/peer/getPeerById:
 *   get:
 *     summary: Get peer details by ID
 *     description: Fetches details of a peer using either `peerLogId` or `peerId`.
 *     operationId: getPeerById
 *     tags:
 *       - Peers
 *     parameters:
 *       - name: peerLogId
 *         in: query
 *         required: false
 *         description: The unique log ID of the peer.
 *         schema:
 *           type: string
 *           example: "6799e5a753f36923a685eec9"
 *       - name: peerId
 *         in: query
 *         required: false
 *         description: The unique peer ID of the peer.
 *         schema:
 *           type: string
 *           example: "peer123"
 *     responses:
 *       '200':
 *         description: Peer details fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     peer:
 *                       type: object
 *                       description: The fetched peer object.
 *                       $ref: '#/components/schemas/peerObject'
 *                 message:
 *                   type: string
 *                   description: Success message indicating that the peer was retrieved.
 *                   example: "Peer fetched successfully"
 *                 statusCode:
 *                   type: integer
 *                   description: HTTP status code.
 *                   example: 200
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the request was successful.
 *                   example: true
 *                 isOperationalError:
 *                   type: boolean
 *                   description: Indicates if the error was operational.
 *                   example: false
 *       '400':
 *         description: Bad request, peerId or peerLogId required.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorObj'
 *       '404':
 *         description: Peer not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorObj'
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorObj'
 */
router.get('/user/peer/getPeerById',authMiddleware,peerController.getPeerById.bind(peerController));

/**
 * @openapi
 * /user/peer/searchEventWithPeers:
 *   post:
 *     summary: Search event logs with peers
 *     description: Searches for peer logs based on the specified field and search text.
 *     operationId: searchEventWithPeers
 *     tags:
 *       - Peers
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               searchField:
 *                 type: string
 *                 description: The field to search in.
 *                 enum: [peerName, useId, userEmail, eventJoinDatetime, eventLeftDatetime]
 *                 example: peerName
 *               searchText:
 *                 type: string
 *                 description: The text to search for.
 *                 example: "Nusarat"
 *     responses:
 *       '200':
 *         description: Successfully fetched peer logs.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     peerLogs:
 *                       type: array
 *                       description: List of peer logs matching the search criteria.
 *                       items:
 *                         $ref: '#/components/schemas/peerObject'
 *                     totalCount:
 *                       type: integer
 *                       description: Total count of matching peer logs.
 *                       example: 3
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                   example: "Event logs fetched successfully"
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
 *         description: Invalid search field or empty search text.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorObj'
 *       '404':
 *         description: No peer logs found with the given search text.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorObj'
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorObj'
 */
router.post('/user/peer/searchEventWithPeers',authMiddleware,peerController.searchEventWithPeers.bind(peerController))


/**
 * @openapi
 * /user/peer/updateAllPeerLeftDate:
 *   post:
 *     summary: Update all peer left dates for an event
 *     description: Updates the 'eventLeftDatetime' for all peers associated with the given event ID.
 *     operationId: updateAllPeerLeftDate
 *     tags:
 *       - Peers
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               eventId:
 *                 type: integer
 *                 description: The ID of the event for which all peer left dates need to be updated.
 *                 example: 257
 *               eventLeftDatetime:
 *                 type: string
 *                 format: date-time
 *                 description: The new left datetime to update for all peers in the event.
 *                 example: "2025-01-31T15:30:00Z"
 *     responses:
 *       '200':
 *         description: Successfully updated all peer left dates.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     peersupdated:
 *                       type: integer
 *                       description: The number of peers whose 'eventLeftDatetime' was updated.
 *                       example: 5
 *                     totalCount:
 *                       type: integer
 *                       description: Total number of peers updated.
 *                       example: 5
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                   example: "Event logs fetched successfully"
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
 *         description: Missing or invalid event ID or event left datetime.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorObj'
 *       '404':
 *         description: Event with the provided ID cannot be found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorObj'
 *       '500':
 *         description: Internal server error while updating peers.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorObj'
 */
router.post('/user/peer/updateAllPeerLeftDate',authMiddleware,peerController.updateAllPeerLeftDate.bind(peerController))

router.delete('/peer/deletePeerById',peerController.deletePeer.bind(peerController));

export default router