import express, { NextFunction, Request, Response } from 'express';
import { Router } from 'express';
import authMiddleware from '../Middleware/authMiddleware';
import { ApiResponse } from '../Helper/apiResponse';
import path from 'path';
import * as fs from 'fs';
import { IEventLog } from '../Model/EventLogsModel';
import EventLogs from '../Model/EventLogsModel';
import { lookup } from 'dns/promises';
import { error } from 'console';
import { EventServices } from '../Services/EventServices';
import { add } from 'winston';
import { validateEventLog } from '../Helper/validationMethods';
import { IActualTime } from '../Model/ActualTimeModal';
import ActualTimeService from '../Services/ActualEventTimeService';
import PeerService from '../Services/PeerServices';
import { ApiError } from '../Helper/errorResponse';
import { PaginationInfo } from '../Helper/typesAndClasses';

interface GetEventQuery {
    page?: string;
    limit?: string;
    sortOrder?: 'asc' | 'desc';
    includeactualTime?: string;
    includePeer?:string
}
interface IEventActualEndTime {
    eventId?: number,
    actualTimeLogId?: string
}

interface GetEventBody {
    page?: number;
    limit?: number;
    sortOrder?: 'asc' | 'desc';
    includeactualTime?: boolean;
    includePeer?:boolean
}

interface SearchEventBody {
    searchText?: string;
    searchField?: string;
    includePeer?:boolean
    searchNumber?:number
}




export class EvenController {

    private eventServices: EventServices;
    private actualTimeServices: ActualTimeService;
    private peerService: PeerService;

    constructor() {
        this.eventServices = new EventServices();
        this.actualTimeServices = new ActualTimeService();
        this.peerService = new PeerService();
    }



    postEvent = async (req: Request<{}, {}, IEventLog>, res: Response, next: NextFunction) => {
        try {
            const { id, _id } = req.body;

            if (id || _id) {
                throw new ApiError("id or _id can not be passed in request body");
            }
            const eventLogToAdd: IEventLog = req.body;

            validateEventLog(eventLogToAdd, true);

            const eventLogExist = await this.eventServices.getEventLogByEvenetId(eventLogToAdd.eventId);

            if (eventLogExist) {
                throw new ApiError("event log with eventId already exist");
            }

            const addedEventLog = await this.eventServices.createEventLog(eventLogToAdd);

            res.status(201).json(new ApiResponse(201, "event log created successfully", {
                addedEventLog,
                eventLogId: addedEventLog._id,
                eventId: addedEventLog.eventId
            }))

        } catch (error) {
            next(error)
        }
    }

    putEventWithEventID = async (req: Request<{ eventId: string }, {}, IEventLog>, res: Response, next: NextFunction) => {

        try {
            const eventIdString = req.params.eventId || null;

            if (!eventIdString) {
                throw new ApiError("eventId is required and can not be blank");
            }

            const eventId = parseInt(eventIdString, 10);

            const eventLogToUpdate: Partial<IEventLog> = req.body;

            if (eventLogToUpdate.id || eventLogToUpdate._id) {
                throw new ApiError("id or _id can not be passed in request body");
            }

            validateEventLog(eventLogToUpdate, true);

            const isEventExist = await this.eventServices.getEventLogByEvenetId(eventId);

            if (!isEventExist) {
                throw new ApiError("event log does not exist");
            }

            if (isEventExist.eventId !== eventLogToUpdate.eventId) {
                throw new ApiError("eventId can not be updated");
            }

            const updatedEventLog = await this.eventServices.updateEventLogByEventId(eventId, eventLogToUpdate);
            res.status(200).json(new ApiResponse(200, "event log updated successfully", { updatedEventLog }))

        } catch (error) {
            next(error);
        }
    }

    patchEventWithEventID = async (req: Request<{ eventId: string }, {}, Partial<IEventLog>>, res: Response, next: NextFunction) => {
        try {

            const eventIdString = req.params.eventId || null;

            if (!eventIdString) {
                throw new ApiError("eventId is required and can not be blank");
            }

            const eventId = parseInt(eventIdString, 10);

            if (!eventId) {
                throw new ApiError("eventId is required and can not be blank");
            }

            const eventLogToUpdate: Partial<IEventLog> = req.body;

            if (eventLogToUpdate.id || eventLogToUpdate._id) {
                throw new ApiError("id or _id can not be passed in request body");
            }


            validateEventLog(eventLogToUpdate);

            const isEventExist = await this.eventServices.getEventLogByEvenetId(eventId);

            if (!isEventExist) {
                throw new ApiError("event log does not exist");
            }


            if (eventLogToUpdate.eventId && isEventExist.eventId !== eventLogToUpdate.eventId) {
                throw new ApiError("eventId can not be updated");
            }

            const updatedEventLog = await this.eventServices.updateEventLogByEventId(eventId, eventLogToUpdate);

            res.status(200).json(new ApiResponse(200, "event log updated successfully", { updatedEventLog }))

        } catch (error) {
            next(error);
        }
    }

    getEvent = async (req: Request<{}, {}, {}, GetEventQuery>, res: Response, next: NextFunction) => {
        try {

            const page = req.query.page ? parseInt(req.query.page) : 1;
            const limit = req.query.limit ? parseInt(req.query.limit) : 5;
            const startIndex = (page - 1) * limit;
            const sortOrder = req.query.sortOrder === 'desc' ? 'desc' : 'asc';
            const totalEvents = await this.eventServices.getTotalEvents();
            const includeactualTime = req.query.includeactualTime;

            console.log(includeactualTime, typeof includeactualTime);
            // if(limit > totalEvents){
            //     throw new ApiError(`Limit can not be greater than total events`);
            // }

            if (limit < 1) {
                throw new ApiError(`Limit can not be less than 1`);
            }

            if (page < 1) {
                throw new ApiError(`Page can not be less than 1`);
            }

            if (sortOrder !== 'asc' && sortOrder !== 'desc') {
                throw new ApiError(`Sort order can only be asc or desc`);
            }

            if (totalEvents < 1) {
                throw new ApiError(`No event logs found`);
            }

            const paginationInfo: PaginationInfo = {
                currentPage: page,
                totalPages: Math.ceil(totalEvents / limit),
                totalEvents: totalEvents,
                limit: limit,
                sortOrder: sortOrder
            }

            if (page > paginationInfo.totalPages) {
                throw new ApiError(`Page does not exist requested page (${page}) > total pages (${paginationInfo.totalPages})`);
            }

            if (includeactualTime && includeactualTime === "true") {
                const eventLogsWithActualTime = await this.eventServices.getPaginatedEventSortedLogsWithActualTime(startIndex, limit, sortOrder);
                res.status(201).json(new ApiResponse(200, "Event logs fetched successfully", { eventLogsWithActualTime, paginationInfo }));
                return
            }

            const eventLogs = await this.eventServices.getPaginatedEventSortedLogs(startIndex, limit, sortOrder);

            res.status(200).json(new ApiResponse(200, "Event logs fetched successfully", { eventLogs, paginationInfo }));
        } catch (error) {
            next(error);
        }
    };

    getEventV2 = async (req: Request<{}, {}, GetEventBody>, res: Response, next: NextFunction) => {
        try {
            const { page = 1, limit = 5, sortOrder = 'asc', includeactualTime } = req.body;
            const startIndex = (page - 1) * limit;
            const totalEvents = await this.eventServices.getTotalEvents();

            if (limit < 1) {
                throw new ApiError(`Limit cannot be less than 1`);
            }

            if (page < 1) {
                throw new ApiError(`Page cannot be less than 1`);
            }

            if (sortOrder !== 'asc' && sortOrder !== 'desc') {
                throw new ApiError(`Sort order can only be asc or desc`);
            }

            if (totalEvents < 1) {
                throw new ApiError(`No event logs found`);
            }

            const paginationInfo: PaginationInfo = {
                currentPage: page,
                totalPages: Math.ceil(totalEvents / limit),
                totalEvents: totalEvents,
                limit: limit,
                sortOrder: sortOrder
            };

            if (page > paginationInfo.totalPages) {
                throw new ApiError(`Page does not exist; requested page (${page}) > total pages (${paginationInfo.totalPages})`);
            }

            if (includeactualTime) {
                const eventLogsWithActualTime = await this.eventServices.getPaginatedEventSortedLogsWithActualTime(startIndex, limit, sortOrder);
                res.status(201).json(new ApiResponse(200, "Event logs fetched successfully", { eventLogsWithActualTime, paginationInfo }));
                return;
            }

            const eventLogs = await this.eventServices.getPaginatedEventSortedLogs(startIndex, limit, sortOrder);
            res.status(200).json(new ApiResponse(200, "Event logs fetched successfully", { eventLogs, paginationInfo }));
        } catch (error) {
            next(error);
        }
    };

    getEventWithEventID = async (req: Request<{ eventId: string }, {}, {}>, res: Response, next: NextFunction) => {
        try {

            const eventIdString = req.params.eventId || null;

            if (!eventIdString) {
                throw new ApiError("eventId is required and can not be blank");
            }

            const eventId = parseInt(eventIdString, 10);

            if (!eventId) {
                throw new ApiError("eventId is required and can not be blank");
            }

            let eventInfo = await this.eventServices.getEventLogByEvenetId(eventId);

            if (!eventInfo) {
                throw new ApiError("event log does not exist");
            }

            const actualTime = await this.actualTimeServices.getAllEventActualTimebyEventId(eventId);

            // const eventMain = {
            //     actualTime,
            //     eventInfo
            // }
            const event = {
                ...eventInfo.toObject(),
                actualTime

            };

            res.status(200).json(new ApiResponse(200, "event log updated successfully", { event }))

        } catch (error) {
            next(error);
        }
    }

    postEventActualStartTime = async (req: Request<{ eventId: string }, {}, IActualTime>, res: Response, next: NextFunction) => {
        try {

            const eventIdString = req.params.eventId || null;

            if (!eventIdString) {
                throw new ApiError("eventId is required and can not be blank");
            }

            const eventId = parseInt(eventIdString, 10);

            if (!eventId) {
                throw new ApiError("eventId is required and can not be blank");
            }

            const event = await this.eventServices.getEventLogByEvenetId(eventId);

            if (!event) {
                throw new ApiError("event log with given event id does not exist");
            }

            const actualTime: IActualTime = req.body;

            if (!actualTime.actualStartTime) {
                throw new ApiError("actualStartTime is required and can not be blank");
            }

            actualTime.eventId = eventId;
            actualTime.eventLogId = event.id;

            const actualEventTimeLog = await this.actualTimeServices.createActualTime(actualTime);

            res.status(201).json(new ApiResponse(200, "event log updated successfully",
                {
                    event,
                    actualEventTimeLog,
                    id: actualEventTimeLog.id,
                    eventId: actualEventTimeLog.eventId
                }))
        } catch (error) {
            next(error);
        }
    }

    putEventActualEndTime = async (req: Request<{}, {}, { actualEndTime: Date }, IEventActualEndTime>, res: Response, next: NextFunction) => {
        try {

            const eventId = req.query.eventId || null;
            const actualTimeLogId = req.query.actualTimeLogId || null;
            const eventActualEndTime = req.body.actualEndTime || null;

            if (!eventActualEndTime) {
                throw new ApiError("EventActualEndTime is required and can not be blank");
            }

            if (!eventId && !actualTimeLogId) {
                throw new ApiError("eventId ot actualTimeLogId request parameter is required and can not be blank");
            }

            if (eventId) {

                const actualEndTime = await this.actualTimeServices.getAllEventActualTimebyEventId(eventId);

                //console.log(actualEndTime);
                if (!actualEndTime) {
                    throw new ApiError("actual endTimeEvent log with given event id does not exist");
                }

                const actualEventTimeLog = await this.actualTimeServices.updateAllEventEndTimeByEventId(eventId, eventActualEndTime);

                //console.log(actualEventTimeLog);

                res.status(201).json(new ApiResponse(200, "actual endTimeEvent updated successfully", {
                    actualEventTimeLog, actualEndTime
                }))

                res.status(200)
                return
            }

            if (actualTimeLogId) {

                const actualTime = await this.actualTimeServices.getActualTimeById(actualTimeLogId);

                if (!actualTime) {
                    throw new Error("no actual endTimeevent log with given event id does not exist");
                }

                const actualEventTimeLog = await this.actualTimeServices.updateActualTime(actualTimeLogId, { actualEndTime: eventActualEndTime });

                res.status(201).json(new ApiResponse(200, "event log updated successfully", actualEventTimeLog))

                return;
            }

        } catch (error) {
            next(error);
        }
    }

    deleteEvent = async (req: Request<{ eventId: number }, {}, {}>, res: Response, next: NextFunction) => {
        try {

            const eventId = req.params.eventId || null;

            if (!eventId) {
                throw new Error("eventId is required and can not be blank");
            }

            const isEventExist = await this.eventServices.getEventLogByEvenetId(eventId);

            if (!isEventExist) {
                throw new Error("event log with given event id does not exist");
            }

            const deletedEvent = await this.eventServices.deleteEventLog(eventId);

            if (!deletedEvent) {
                throw new Error("event log can not be deleted");
            }

            const deletedActualTime = await this.actualTimeServices.deleteAllEventActualTimeByEventId(eventId);

            res.status(200).json(new ApiResponse(200, "event log deleted successfully", { deletedEvent, deletedActualTime }))

        } catch (error) {
            next(error);
        }
    }

    getEventWithPeersV1 = async (req: Request<{}, {}, {}, GetEventQuery>, res: Response, next: NextFunction) => {
        try {
            const page = req.query.page ? parseInt(req.query.page) : 1;
            const limit = req.query.limit ? parseInt(req.query.limit) : 5;
            const startIndex = (page - 1) * limit;
            const sortOrder = req.query.sortOrder === 'desc' ? 'desc' : 'asc';
            const totalEvents = await this.eventServices.getTotalEvents();
            const includePeer = req.query.includePeer;
    
            if (limit < 1) {
                throw new ApiError(`Limit can not be less than 1`);
            }
    
            if (page < 1) {
                throw new ApiError(`Page can not be less than 1`);
            }
    
            if (sortOrder !== 'asc' && sortOrder !== 'desc') {
                throw new ApiError(`Sort order can only be asc or desc`);
            }
    
            if (totalEvents < 1) {
                throw new ApiError(`No event logs found`);
            }
    
            const paginationInfo:PaginationInfo = {
                currentPage: page,
                totalPages: Math.ceil(totalEvents / limit),
                totalEvents: totalEvents,
                limit: limit,
                sortOrder: sortOrder
            };
    
            if (page > paginationInfo.totalPages) {
                throw new ApiError(`Page does not exist requested page (${page}) > total pages (${paginationInfo.totalPages})`);
            }
    
            if (includePeer && includePeer === "true") {
                const eventLogsWithPeers = await this.eventServices.getPaginatedEventSortedLogsWithActualTimeAndPeers(startIndex, limit, sortOrder);
                res.status(200).json(new ApiResponse(200, "Event logs with peers fetched successfully", { eventLogsWithPeers, paginationInfo }));
                return;
            }
    
            const eventLogs = await this.eventServices.getPaginatedEventSortedLogs(startIndex, limit, sortOrder);
    
            res.status(200).json(new ApiResponse(200, "Event logs fetched successfully", { eventLogs, paginationInfo }));
        } catch (error) {
            next(error);
        }
    };
    
    getEventWithPeers = async (req: Request<{}, {}, GetEventBody>, res: Response, next: NextFunction) => {
        try {
            // Extract data from the request body
            const { page = 1, limit = 5, sortOrder = 'asc', includePeer = false } = req.body;
    
            const startIndex = (page - 1) * limit;
            const totalEvents = await this.eventServices.getTotalEvents();
    
            // Validation checks
            if (limit < 1) {
                throw new ApiError(`Limit cannot be less than 1`);
            }
    
            if (page < 1) {
                throw new ApiError(`Page cannot be less than 1`);
            }
    
            if (sortOrder !== 'asc' && sortOrder !== 'desc') {
                throw new ApiError(`Sort order can only be 'asc' or 'desc'`);
            }
    
            if (totalEvents < 1) {
                throw new ApiError(`No event logs found`);
            }
    
            const paginationInfo: PaginationInfo = {
                currentPage: page,
                totalPages: Math.ceil(totalEvents / limit),
                totalEvents: totalEvents,
                limit: limit,
                sortOrder: sortOrder,
            };
    
            if (page > paginationInfo.totalPages) {
                throw new ApiError(`Page does not exist. Requested page (${page}) > total pages (${paginationInfo.totalPages})`);
            }
    
            // Fetch event logs with or without peers based on the includePeer flag
            if (includePeer) {
                const eventLogsWithPeers = await this.eventServices.getPaginatedEventSortedLogsWithActualTimeAndPeers(startIndex, limit, sortOrder,true);
                res.status(200).json(new ApiResponse(200, "Event logs with peers fetched successfully", { eventLogsWithPeers, paginationInfo }));
                return;
            }
    
            const eventLogs = await this.eventServices.getPaginatedEventSortedLogsWithActualTimeAndPeers(startIndex, limit, sortOrder);
            res.status(201).json(new ApiResponse(200, "Event logs fetched successfully", { eventLogs, paginationInfo }));
        } catch (error) {
            next(error);
        }
    };

    searchEventWithPeers = async (req: Request<{}, {}, SearchEventBody>, res: Response, next: NextFunction) => {
        try {
            // Extract data from the request body
            const { searchField = '', searchText = '', includePeer = false } = req.body;
    
            // List of valid fields that can be searched on (adjust this based on your actual model)
            const validFields = ['eventName','eventId' ,'description', 'createdAt', 'location','id','_id']; // Add other valid fields here
    
            // Check if the searchField is valid
            if (!validFields.includes(searchField)) {
                throw new ApiError(`Invalid search field: '${searchField}'. Allowed fields are: ${validFields.join(', ')}`);
            }
    
            // Validation for searchText
            if (!searchText) {
                throw new ApiError('Search text cannot be empty');
            }
    
            // Fetch event logs with or without peers based on the includePeer flag
            if (includePeer) {
                const eventLogsWithPeers = await this.eventServices.searchEventLogsWithActualTimeAndPeers(searchField, searchText,true);
                
                if(eventLogsWithPeers.length<1){
                    throw new ApiError("can not foun event log with given search text")
                }

                res.status(200).json(new ApiResponse(200, "Event logs with peers fetched successfully", { eventLogsWithPeers,totalCount:eventLogsWithPeers.length }));
                return;
            }

            const eventLogs = await this.eventServices.searchEventLogsWithActualTimeAndPeers(searchField, searchText,false);
        
            if(eventLogs.length<1){
                throw new ApiError("can not foun event log with given search text")
            }
            
            res.status(201).json(new ApiResponse(200, "Event logs fetched successfully", { eventLogs,totalCount:eventLogs.length }));
        } catch (error) {
            next(error);
        }
    };

    getEventWithEventIDWithPeers = async (req: Request<{}, {}, {eventId:number,includePeer: boolean }>, res: Response, next: NextFunction) => {
        try {
            // Extract data from the request body
            const { eventId, includePeer = false } = req.body;
    
    
            // Fetch event logs with or without peers based on the includePeer flag
            if (includePeer) {
                const eventLogsWithPeers = await this.eventServices.getEventByIdPeerEventInfo(eventId,true);
                
                if(eventLogsWithPeers.length<1){
                    throw new ApiError("can not foun event log with given event id")
                }
                res.status(200).json(new ApiResponse(200, "Event logs with peer fetched successfully", { eventLogsWithPeers }));
                return;
            }
    
            const eventLogs = await this.eventServices.getEventByIdPeerEventInfo(eventId,false);
            
            if(eventLogs.length<1){
                throw new ApiError("can not foun event log with given event id")
            }
            res.status(200).json(new ApiResponse(200, "Event logs fetched successfully", { eventLogs }));
        } catch (error) {
            next(error);
        }
    };

    



    




    



    // postEvent = async (req: Request<{}, {}, IEventLog>, res: Response, next: NextFunction) => {
    //     try {


    //         const eventLogToAdd: IEventLog = req.body;

    //         if (!eventLogToAdd.eventId || !eventLogToAdd.eventName || !eventLogToAdd.eventCreatedDate || !eventLogToAdd.eventStartTime) {
    //             throw new Error("eventId, eventName, eventDate and eventCreatedDate are required and can not be empty");
    //         }

    //         if(eventLogToAdd.eventName.length > 200){
    //             throw new Error("eventName can not be more than 200 characters");
    //         }

    //         if(eventLogToAdd.totalAttendees && eventLogToAdd.totalAttendees < 0){
    //             throw new Error("totalAttendees can not be less than 0");
    //         }

    //         if(eventLogToAdd.totalHost && eventLogToAdd.totalHost < 0){
    //             throw new Error("totalHost can not be less than 0");
    //         }

    //         if(eventLogToAdd.totalKickout && eventLogToAdd.totalKickout < 0){
    //             throw new Error("totalKickout can not be less than 0");
    //         }

    //         if(eventLogToAdd.totalRaisedHand && eventLogToAdd.totalRaisedHand < 0){
    //             throw new Error("totalRaisedHand can not be less than 0");
    //         }

    //         if(eventLogToAdd.totalWaveHand && eventLogToAdd.totalWaveHand < 0){
    //             throw new Error("totalWaveHand can not be less than 0");
    //         }

    //         if(eventLogToAdd.totalThumbsup && eventLogToAdd.totalThumbsup < 0){
    //             throw new Error("totalThumbsup can not be less than 0");
    //         }

    //         if(eventLogToAdd.eventEndTime && eventLogToAdd.eventEndTime < eventLogToAdd.eventStartTime){
    //             throw new Error("eventEndTime can not be less than eventStartTime");
    //         }

    //         const eventLogExist = await this.eventServices.getEventLogByEvenetId(eventLogToAdd.eventId);

    //         if(eventLogExist){
    //             throw new Error("event with eventId already exist");
    //         }

    //         //eventLogToAdd._id ="custom_id_123";
    //         const addedEventLog = await this.eventServices.createEventLog(eventLogToAdd);

    //         res.status(201).json(new ApiResponse(201,"event log created successfully",{addedEventLog,eventLogId:addedEventLog.id}))


    //     } catch (error) {
    //         next(error)
    //     }
    // }

    // putEvent = async (req: Request<{id:string}, {}, IEventLog>, res: Response, next: NextFunction) => {
    //     try {

    //         const id = req.params.id || null ;

    //         if(!id){
    //             throw new Error("id is required and can not be blank");
    //         }

    //         const isEventExist = await this.eventServices.getEventLogById(id);

    //         if(!isEventExist){
    //             throw new Error("event log does not exist");
    //         }

    //         const eventLogToUpdate: IEventLog = req.body;

    //         // if(!eventLogToUpdate.eventId || !eventLogToUpdate.eventName || !eventLogToUpdate.eventCreatedDate || !eventLogToUpdate.eventStartTime || !eventLogToUpdate.eventEndTime || !eventLogToUpdate.totalAttendees || !eventLogToUpdate.totalHost || !eventLogToUpdate.totalKickout || !eventLogToUpdate.totalRaisedHand || !eventLogToUpdate.totalWaveHand || !eventLogToUpdate.totalThumbsup || !eventLogToUpdate.totalThumbsdown){    
    //         //     throw new Error("eventId, eventName, eventDate, eventStartTime, eventEndTime, totalAttendees, totalHost, totalKickout, totalRaisedHand, totalWaveHand, totalThumbsup, totalThumbsdown are required and can not be empty");
    //         // }

    //         if(eventLogToUpdate.eventName && eventLogToUpdate.eventName.length > 200){
    //             throw new Error("eventName can not be more than 200 characters");
    //         }

    //         if(eventLogToUpdate.totalAttendees && eventLogToUpdate.totalAttendees < 0){
    //             throw new Error("totalAttendees can not be less than 0");
    //         }

    //         if(eventLogToUpdate.totalHost && eventLogToUpdate.totalHost < 0){
    //             throw new Error("totalHost can not be less than 0");
    //         }

    //         if(eventLogToUpdate.totalKickout && eventLogToUpdate.totalKickout < 0){
    //             throw new Error("totalKickout can not be less than 0");
    //         }

    //         if(eventLogToUpdate.totalRaisedHand && eventLogToUpdate.totalRaisedHand < 0){
    //             throw new Error("totalRaisedHand can not be less than 0");
    //         }

    //         if(eventLogToUpdate.totalWaveHand && eventLogToUpdate.totalWaveHand < 0){
    //             throw new Error("totalWaveHand can not be less than 0");
    //         }   

    //         if(eventLogToUpdate.totalThumbsup && eventLogToUpdate.totalThumbsup < 0){
    //             throw new Error("totalThumbsup can not be less than 0");
    //         }

    //         if(eventLogToUpdate.eventEndTime && eventLogToUpdate.eventEndTime < eventLogToUpdate.eventStartTime){
    //             throw new Error("eventEndTime can not be less than eventStartTime");
    //         }

    //         if(eventLogToUpdate.eventId && eventLogToUpdate.eventId !== isEventExist.eventId){
    //             throw new Error("eventId can not be updated");
    //         }

    //         const updatedEventLog = await this.eventServices.updateEventLogById(id,eventLogToUpdate);

    //         res.status(200).json(new ApiResponse(200,"event log updated successfully",{updatedEventLog}))


    //     }catch(error){
    //         next(error);   
    //     }
    // }

    // patchEvent = async (req: Request<{id:string}, {}, IEventLog>, res: Response, next: NextFunction) => {
    //     try {

    //         const id = req.params.id || null ;


    //         if(!id){
    //             throw new Error("eventId is required and can not be blank");
    //         }

    //         const isEventExist = await this.eventServices.getEventLogById(id);

    //         if(!isEventExist){
    //             throw new Error("event log does not exist");
    //         }

    //         const eventLogToUpdate: IEventLog = req.body;

    //         // if(!eventLogToUpdate.eventId || !eventLogToUpdate.eventName || !eventLogToUpdate.eventCreatedDate || !eventLogToUpdate.eventStartTime ){    
    //         //     throw new Error("eventId, eventName, eventDate, eventStartTime and eventEndTime are required and can not be empty");
    //         // }

    //         if(eventLogToUpdate.eventName && eventLogToUpdate.eventName.length > 200){
    //             throw new Error("eventName can not be more than 200 characters");
    //         }

    //         if(eventLogToUpdate.totalAttendees && eventLogToUpdate.totalAttendees < 0){
    //             throw new Error("totalAttendees can not be less than 0");
    //         }

    //         if(eventLogToUpdate.totalHost && eventLogToUpdate.totalHost < 0){
    //             throw new Error("totalHost can not be less than 0");
    //         }

    //         if(eventLogToUpdate.totalKickout && eventLogToUpdate.totalKickout < 0){
    //             throw new Error("totalKickout can not be less than 0");
    //         }

    //         if(eventLogToUpdate.totalRaisedHand && eventLogToUpdate.totalRaisedHand < 0){
    //             throw new Error("totalRaisedHand can not be less than 0");
    //         }

    //         if(eventLogToUpdate.totalWaveHand && eventLogToUpdate.totalWaveHand < 0){
    //             throw new Error("totalWaveHand can not be less than 0");
    //         }   

    //         if(eventLogToUpdate.totalThumbsup && eventLogToUpdate.totalThumbsup < 0){
    //             throw new Error("totalThumbsup can not be less than 0");
    //         }

    //         if(eventLogToUpdate.eventEndTime && eventLogToUpdate.eventEndTime < eventLogToUpdate.eventStartTime){
    //             throw new Error("eventEndTime can not be less than eventStartTime");
    //         }


    //         if(eventLogToUpdate.eventId && eventLogToUpdate.eventId !== isEventExist.eventId){
    //             throw new Error("eventId can not be updated");
    //         }

    //         const updatedEventLog = await this.eventServices.updateEventLogById(id,eventLogToUpdate);


    //         res.status(200).json(new ApiResponse(200,"event log updated successfully",{updatedEventLog}))

    //     }catch(error){
    //         next(error);   
    //     }
    // }

    // patchEventEventID = async (req: Request<{eventId:number}, {}, IEventLog>, res: Response, next: NextFunction) => {
    //     try {

    //         const eventId = req.params.eventId || null ;


    //         if(!eventId){
    //             throw new Error("eventId is required and can not be blank");
    //         }

    //         const isEventExist = await this.eventServices.getEventLogByEvenetId(eventId);

    //         if(!isEventExist){
    //             throw new Error("event log does not exist");
    //         }

    //         const eventLogToUpdate: IEventLog = req.body;

    //         if(!eventLogToUpdate.eventId || !eventLogToUpdate.eventName || !eventLogToUpdate.eventCreatedDate || !eventLogToUpdate.eventStartTime ){    
    //             throw new Error("eventId, eventName, eventDate, eventStartTime and eventEndTime are required and can not be empty");
    //         }

    //         if(eventLogToUpdate.eventName && eventLogToUpdate.eventName.length > 200){
    //             throw new Error("eventName can not be more than 200 characters");
    //         }

    //         if(eventLogToUpdate.totalAttendees && eventLogToUpdate.totalAttendees < 0){
    //             throw new Error("totalAttendees can not be less than 0");
    //         }

    //         if(eventLogToUpdate.totalHost && eventLogToUpdate.totalHost < 0){
    //             throw new Error("totalHost can not be less than 0");
    //         }

    //         if(eventLogToUpdate.totalKickout && eventLogToUpdate.totalKickout < 0){
    //             throw new Error("totalKickout can not be less than 0");
    //         }

    //         if(eventLogToUpdate.totalRaisedHand && eventLogToUpdate.totalRaisedHand < 0){
    //             throw new Error("totalRaisedHand can not be less than 0");
    //         }

    //         if(eventLogToUpdate.totalWaveHand && eventLogToUpdate.totalWaveHand < 0){
    //             throw new Error("totalWaveHand can not be less than 0");
    //         }   

    //         if(eventLogToUpdate.totalThumbsup && eventLogToUpdate.totalThumbsup < 0){
    //             throw new Error("totalThumbsup can not be less than 0");
    //         }

    //         if(eventLogToUpdate.eventEndTime && eventLogToUpdate.eventEndTime < eventLogToUpdate.eventStartTime){
    //             throw new Error("eventEndTime can not be less than eventStartTime");
    //         }

    //         const updatedEventLog = await this.eventServices.updateEventLogByEventId(eventId,eventLogToUpdate);

    //         res.status(200).json(new ApiResponse(200,"event log updated successfully",{updatedEventLog}))

    //     }catch(error){
    //         next(error);   
    //     }
    // }

    // putEvent = async (req: Request<{_id:string}, {}, IEventLog>, res: Response, next: NextFunction) => {
    //     try {

    //         const _id = req.params._id || null ;

    //         if(!_id){
    //             throw new Error("id is required and can not be blank");
    //         }

    //         const isEventExist = await this.eventServices.getEventLogById(_id);

    //         if(!isEventExist){
    //             throw new Error("event log does not exist");
    //         }

    //         const eventLogToUpdate: IEventLog = req.body;

    //         if(!eventLogToUpdate.eventId || !eventLogToUpdate.eventName || !eventLogToUpdate.eventCreatedDate || !eventLogToUpdate.eventStartTime || !eventLogToUpdate.eventEndTime || !eventLogToUpdate._id){    
    //             throw new Error("eventId, eventName, eventDate, eventStartTime, eventEndTime and _id are required and can not be empty");
    //         }

    //         if(eventLogToUpdate.eventName && eventLogToUpdate.eventName.length > 200){
    //             throw new Error("eventName can not be more than 200 characters");
    //         }

    //         if(eventLogToUpdate.totalAttendees && eventLogToUpdate.totalAttendees < 0){
    //             throw new Error("totalAttendees can not be less than 0");
    //         }

    //         if(eventLogToUpdate.totalHost && eventLogToUpdate.totalHost < 0){
    //             throw new Error("totalHost can not be less than 0");
    //         }

    //         if(eventLogToUpdate.totalKickout && eventLogToUpdate.totalKickout < 0){
    //             throw new Error("totalKickout can not be less than 0");
    //         }

    //         if(eventLogToUpdate.totalRaisedHand && eventLogToUpdate.totalRaisedHand < 0){
    //             throw new Error("totalRaisedHand can not be less than 0");
    //         }

    //         if(eventLogToUpdate.totalWaveHand && eventLogToUpdate.totalWaveHand < 0){
    //             throw new Error("totalWaveHand can not be less than 0");
    //         }   

    //         if(eventLogToUpdate.totalThumbsup && eventLogToUpdate.totalThumbsup < 0){
    //             throw new Error("totalThumbsup can not be less than 0");
    //         }

    //         if(eventLogToUpdate.eventEndTime && eventLogToUpdate.eventStartTime && eventLogToUpdate.eventEndTime < eventLogToUpdate.eventStartTime){
    //             throw new Error("eventEndTime can not be less than eventStartTime");
    //         }

    //         if(eventLogToUpdate.eventId && eventLogToUpdate.eventId !== isEventExist.eventId){
    //             throw new Error("eventId can not be updated");
    //         }

    //         if(eventLogToUpdate._id && eventLogToUpdate._id !== isEventExist._id){
    //             throw new Error("_id can not be updated");
    //         }

    //         const updatedEventLog = await this.eventServices.updateEventLogById(_id,eventLogToUpdate);

    //         res.status(200).json(new ApiResponse(200,"event log updated successfully",{updatedEventLog}))


    //     }catch(error){
    //         next(error);   
    //     }
    // }

    // patchEvent = async (req: Request<{_id:string}, {}, IEventLog>, res: Response, next: NextFunction) => {
    //     try {

    //         const _id = req.params._id || '';


    //         if(!_id){
    //             throw new Error("_id is required and can not be blank");
    //         }

    //         const isEventExist = await this.eventServices.getEventLogById(_id);

    //         if(!isEventExist){
    //             throw new Error("event log does not exist");
    //         }

    //         const eventLogToUpdate: IEventLog = req.body;


    //         if(eventLogToUpdate.eventName && eventLogToUpdate.eventName.length > 200){
    //             throw new Error("eventName can not be more than 200 characters");
    //         }

    //         if(eventLogToUpdate.totalAttendees && eventLogToUpdate.totalAttendees < 0){
    //             throw new Error("totalAttendees can not be less than 0");
    //         }

    //         if(eventLogToUpdate.totalHost && eventLogToUpdate.totalHost < 0){
    //             throw new Error("totalHost can not be less than 0");
    //         }

    //         if(eventLogToUpdate.totalKickout && eventLogToUpdate.totalKickout < 0){
    //             throw new Error("totalKickout can not be less than 0");
    //         }

    //         if(eventLogToUpdate.totalRaisedHand && eventLogToUpdate.totalRaisedHand < 0){
    //             throw new Error("totalRaisedHand can not be less than 0");
    //         }

    //         if(eventLogToUpdate.totalWaveHand && eventLogToUpdate.totalWaveHand < 0){
    //             throw new Error("totalWaveHand can not be less than 0");
    //         }   

    //         if(eventLogToUpdate.totalThumbsup && eventLogToUpdate.totalThumbsup < 0){
    //             throw new Error("totalThumbsup can not be less than 0");
    //         }

    //         if(eventLogToUpdate.eventEndTime && eventLogToUpdate.eventStartTime && eventLogToUpdate.eventEndTime < eventLogToUpdate.eventStartTime){
    //             throw new Error("eventEndTime can not be less than eventStartTime");
    //         }

    //         if(eventLogToUpdate.eventId && eventLogToUpdate.eventId !== isEventExist.eventId){
    //             throw new Error("eventId can not be updated");
    //         }

    //         if(eventLogToUpdate._id && eventLogToUpdate._id !== isEventExist._id){
    //             throw new Error("_id can not be updated");
    //         }

    //         const updatedEventLog = await this.eventServices.updateEventLogById(_id,eventLogToUpdate);


    //         res.status(200).json(new ApiResponse(200,"event log updated successfully",{updatedEventLog}))

    //     }catch(error){
    //         next(error);   
    //     }
    // }



    //winston




    //put


    //get with limit and page


    //get with id


    //patch
}






