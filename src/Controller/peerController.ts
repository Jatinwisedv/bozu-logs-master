import express, { NextFunction, Request, Response } from 'express';
import { ApiResponse } from '../Helper/apiResponse';
import { updatePeer, validatePeer } from '../Helper/validationMethods';
import { IPeers } from '../Model/PeerModel';
import PeerService from '../Services/PeerServices';
import getUserAgent from '../Helper/getUserAgent';
import getIPInfoForGivenIP from '../Helper/ipRequest';
import { ApiError } from '@google-cloud/storage';
import { EventServices } from '../Services/EventServices';

interface GetPeerQuery {
    page?: string;
    limit?: string;
    sortOrder?: 'asc' | 'desc';
    sortField?: string;
}

interface updatePeerQuery {
    peerLogId?: string;
    peerId?: string;
}


interface SearchPeerBody {
    searchText?: string;
    searchField?: string;
    searchNumber?: number
}

interface IUpdateAllPeerLeftDate{
    eventId:number,
    eventLeftDatetime:Date
}

export class PeerController {
    private peerServices: PeerService;
    private eventServices :EventServices

    constructor() {
        this.peerServices = new PeerService();
        this.eventServices= new EventServices();
    }

    postPeer = async (req: Request<{}, {}, IPeers>, res: Response, next: NextFunction) => {
        try {
            const peerToAdd: IPeers = req.body;

            const userAgent = getUserAgent(req);

            if (userAgent) {
                peerToAdd.userAgent = userAgent;
            }

            validatePeer(peerToAdd, true);

            const event = await this.eventServices.getEventLogByEvenetId(parseInt(peerToAdd.eventId))

            if(!event){
                throw new ApiError("Event with provided id can not be found");
            }

            const peerIdExists = await this.peerServices.getPeerByPeerId(peerToAdd.peerId);

            if (peerIdExists) {
                throw new ApiError("Peer with provided peerId already exists");
            }

            const data = await getIPInfoForGivenIP(peerToAdd.ipAddress);

            if (!data) {
                throw new ApiError("can not be fetch data from ipinfo.io");
            }

            if (data.country) {
                peerToAdd.country = data?.country;
            }

            if (data.city) {
                peerToAdd.city = data?.city;
            }

            if (data.region) {
                peerToAdd.state = data?.region;
            }

            if (data.postal) {
                peerToAdd.postalCode = data?.postal;
            }

            if (data.org) {
                peerToAdd.isp = data?.org;
            }

            if (data.loc) {
                const loc = data?.loc?.split(",");
                if (loc) {
                    peerToAdd.latitude = parseFloat(loc[0]);
                    peerToAdd.longitude = parseFloat(loc[1]);
                }
            }

            const addedPeer = await this.peerServices.createPeer(peerToAdd);

            if (!addedPeer) {
                throw new ApiError("Peer could not be created");
            }

            res.status(201).json(new ApiResponse(201, "Peer created successfully", { addedPeer, peerLogId: addedPeer.id }));
        } catch (error) {
            next(error);
        }
    };

    putPeer = async (req: Request<{}, {}, Partial<IPeers>, updatePeerQuery>, res: Response, next: NextFunction) => {
        try {
            const peerLogId = req.query.peerLogId || "";
            const peerId = req.query.peerId || "";

            if (!peerId && !peerLogId) {
                throw new Error("peerId or peerLogId is required be blank for updation");
            }

            const peerToUpdate: Partial<IPeers> = req.body;

            validatePeer(peerToUpdate);

            if (peerToUpdate.peerId) {
                throw new ApiError("request body can not contain peerId");
            }

            let peer;

            if (peerLogId) {
                peer = await this.peerServices.getPeerById(peerLogId);
            } else {
                peer = await this.peerServices.getPeerByPeerId(peerId);
            }

            if (!peer) {
                throw new ApiError("Peer does not exist");
            }

            if(peerToUpdate.eventId){
                throw new Error('Event Id Can not Be Updated')
            }
            
            
            if (peerToUpdate.eventLeftDatetime && peer.eventJoinDatetime) {
                const eventJoinDate = new Date(peer.eventJoinDatetime);
                const eventLeftDate = new Date(peerToUpdate.eventLeftDatetime);

                //console.log(eventJoinDate,eventLeftDate,eventJoinDate > eventLeftDate)

                if (eventJoinDate > eventLeftDate) {
                    throw new ApiError("eventLeftDatetime cannot be less than eventJoinDatetime");
                }
            } else {
                throw new ApiError("Invalid dates provided");
            }

            if (peerToUpdate.admitedPeers) {
                peer.admitedPeers = peer.admitedPeers || [];
                peer.admitedPeers.push(...peerToUpdate.admitedPeers);
            }

            if (peerToUpdate.rejectedPeers) {
                peer.rejectedPeers = peer.rejectedPeers || [];
                peer.rejectedPeers.push(...peerToUpdate.rejectedPeers);
            }

            if (peerToUpdate.kickedOut) {
                peer.kickedOut = peer.kickedOut || [];
                peer.kickedOut.push(...peerToUpdate.kickedOut);
            }

            if (peerToUpdate.switchMadeHost) {
                peer.switchMadeHost = peer.switchMadeHost || [];
                peer.switchMadeHost.push(...peerToUpdate.switchMadeHost);
            }

            if (peerToUpdate.switchBanFromPublicChat) {
                peer.switchBanFromPublicChat = peer.switchBanFromPublicChat || [];
                peer.switchBanFromPublicChat.push(...peerToUpdate.switchBanFromPublicChat);
            }

            if (peerToUpdate.inviteToGroup) {
                peer.inviteToGroup = peer.inviteToGroup || [];
                peer.inviteToGroup.push(...peerToUpdate.inviteToGroup);
            }

            if (peerToUpdate.joinToGroup) {
                peer.joinToGroup = peer.joinToGroup || [];
                peer.joinToGroup.push(...peerToUpdate.joinToGroup);
            }

            if (peerToUpdate.madeGroupAnonymous) {
                peer.madeGroupAnonymous = peer.madeGroupAnonymous || [];
                peer.madeGroupAnonymous.push(...peerToUpdate.madeGroupAnonymous);
            }

            if (peerToUpdate.passedMike) {
                peer.passedMike = peer.passedMike || [];
                peer.passedMike.push(...peerToUpdate.passedMike);
            }

            if (peerToUpdate.inviteOnstage) {
                peer.inviteOnstage = peer.inviteOnstage || [];
                peer.inviteOnstage.push(...peerToUpdate.inviteOnstage);
            }

            if (peerToUpdate.createdGroups) {
                peer.createdGroups = peer.createdGroups || [];
                peer.createdGroups.push(...peerToUpdate.createdGroups);
            }

            if (peerToUpdate.groupLocked) {
                peer.groupLocked = peer.groupLocked || [];
                peer.groupLocked.push(...peerToUpdate.groupLocked);
            }

            if (peerToUpdate.groupChat) {
                peerToUpdate.groupChat = peerToUpdate.groupChat || [];
                peer.groupChat = peer.groupChat || [];
                peer.groupChat.push(...peerToUpdate.groupChat);
            }

            if (peerToUpdate.publicChat) {
                peerToUpdate.publicChat = peerToUpdate.publicChat || [];
                peer.publicChat = peer.publicChat || [];
                peer.publicChat.push(...peerToUpdate.publicChat);
            }

            updatePeer(peer, peerToUpdate);


            const updatedPeer = await this.peerServices.updatePeer(peer.id, peer);

            if (!updatedPeer) {
                throw new ApiError("Peer could not be updated");
            }

            // Respond with the updated peer data
            res.status(200).json(new ApiResponse(200, "Peer updated successfully", { updatedPeer }));
        } catch (error) {
            next(error);
        }
    };

    getPeers_v1 = async (req: Request<{}, {}, {}, GetPeerQuery>, res: Response, next: NextFunction) => {
        try {
            const page = req.query.page ? parseInt(req.query.page) : 1;
            const limit = req.query.limit ? parseInt(req.query.limit) : 5;
            const sortOrder = req.query.sortOrder === 'desc' ? 'desc' : 'asc';
            const validSortFields: Array<keyof IPeers> = ['eventJoinDatetime', 'eventLeftDatetime', 'peerName'];

            let sortField = req.query.sortField

            if (sortField && !validSortFields.includes(sortField as keyof IPeers)) {
                throw new ApiError("Invalid sort field");
            }

            sortField = sortField ? sortField as keyof IPeers : 'eventJoinDatetime' as keyof IPeers;

            const totalPeers = await this.peerServices.getTotalPeers();

            if (totalPeers < 1) {
                throw new ApiError("No peers found");
            }

            const paginationInfo = {
                currentPage: page,
                totalPages: Math.ceil(totalPeers / limit),
                totalPeers,
                limit,
                sortOrder,
                sortField,
                validSortFields
            };

            if (page > paginationInfo.totalPages) {
                throw new ApiError(`Page does not exist: requested page (${page}) > total pages (${paginationInfo.totalPages})`);
            }

            const peers = await this.peerServices.getPaginatedAndSortedPeers(
                (page - 1) * limit, limit, sortField as keyof IPeers, sortOrder
            );

            res.status(200).json(new ApiResponse(200, "Peers fetched successfully", { peers, paginationInfo }));
        } catch (error) {
            next(error);
        }
    };

    getPeers = async (req: Request<{}, {}, GetPeerQuery>, res: Response, next: NextFunction) => {
        try {
            const { page = 1, limit = 5, sortOrder = 'asc', sortField } = req.body;
            const parsedPage = parseInt(page as unknown as string);
            const parsedLimit = parseInt(limit as unknown as string);
            const order = sortOrder === 'desc' ? 'desc' : 'asc';

            const validSortFields: Array<keyof IPeers> = ['eventJoinDatetime', 'eventLeftDatetime', 'peerName'];
            let field = sortField as keyof IPeers;

            if (field && !validSortFields.includes(field)) {
                throw new ApiError("Invalid sort field");
            }

            field = field ? field : 'eventJoinDatetime';

            const totalPeers = await this.peerServices.getTotalPeers();

            if (totalPeers < 1) {
                throw new ApiError("No peers found");
            }

            const paginationInfo = {
                currentPage: parsedPage,
                totalPages: Math.ceil(totalPeers / parsedLimit),
                totalPeers,
                limit: parsedLimit,
                sortOrder: order,
                sortField: field,
                validSortFields
            };

            if (parsedPage > paginationInfo.totalPages) {
                throw new ApiError(`Page does not exist: requested page (${parsedPage}) > total pages (${paginationInfo.totalPages})`);
            }

            const peers = await this.peerServices.getPaginatedAndSortedPeers(
                (parsedPage - 1) * parsedLimit, parsedLimit, field, order
            );

            res.status(200).json(new ApiResponse(200, "Peers fetched successfully", { peers, paginationInfo }));
        } catch (error) {
            next(error);
        }
    };

    getPeerById = async (req: Request<{}, {}, {}, updatePeerQuery>, res: Response, next: NextFunction) => {
        try {

            const peerLogId = req.query.peerLogId || "";
            const peerId = req.query.peerId || "";

            if (!peerId && !peerLogId) {
                throw new Error("peerId or peerLogId is required be blank for updation");
            }

            var peer;

            if (peerLogId) {
                peer = await this.peerServices.getPeerById(peerLogId);
            } else {
                peer = await this.peerServices.getPeerByPeerId(peerId);
            }

            if (!peer) {
                throw new Error("Peer does not exist");
            }

            res.status(200).json(new ApiResponse(200, "Peer fetched successfully", { peer }));

        } catch (error) {
            next(error);
        }
    };

    searchEventWithPeers = async (req: Request<{}, {}, SearchPeerBody>, res: Response, next: NextFunction) => {
        try {
            // Extract data from the request body
            const { searchField = '', searchText = '' } = req.body;

            
            const validFields = [
                'peerName', 'useId', 'userEmail', 'eventJoinDatetime', 'eventLeftDatetime'
            ];
            

            if (!validFields.includes(searchField)) {
                throw new ApiError(`Invalid search field: '${searchField}'. Allowed fields are: ${validFields.join(', ')}`);
            }

            if (!searchText) {
                throw new ApiError('Search text cannot be empty');
            }

            const peerLogs = await this.peerServices.searchPeerLogs(searchField, searchText);

            if (peerLogs.length < 1) {
                throw new ApiError("can not foun peer log with given search text")
            }

            res.status(200).json(new ApiResponse(200, "peers logs fetched successfully", { peerLogs, totalCount: peerLogs.length }));
        } catch (error) {
            next(error);
        }
    };

    updateAllPeerLeftDate = async (req: Request<{}, {}, IUpdateAllPeerLeftDate>, res: Response, next: NextFunction) => {
        try {
            
            const updateAllPeerLeftDate:IUpdateAllPeerLeftDate = req.body;

            if(!updateAllPeerLeftDate.eventId){
                throw new ApiError("event id is required")
            }

            if(!updateAllPeerLeftDate.eventLeftDatetime){
                throw new ApiError("eventLeftDatetime is required")
            }

            const event = await this.eventServices.getEventLogByEvenetId(updateAllPeerLeftDate.eventId)

            if(!event){
                throw new ApiError("Event with provided id can not be found");
            }

            const peersupdated = await this.peerServices.updatePeersLeftDatetime(updateAllPeerLeftDate.eventId,updateAllPeerLeftDate.eventLeftDatetime);

            if(!peersupdated){
                throw Error("Unable To Update All Peers")
            }

            res.status(200).json(new ApiResponse(200, "Event logs fetched successfully", { peersupdated, totalCount: peersupdated }));
        } catch (error) {
            next(error);
        }
    };


    deletePeer = async (req: Request<{}, {}, {}, updatePeerQuery>, res: Response, next: NextFunction) => {
        try {

            const peerLogId = req.query.peerLogId || "";
            const peerId = req.query.peerId || "";

            if (!peerId && !peerLogId) {
                throw new Error("peerId or peerLogId is required be blank for updation");
            }

            var peer;

            if (peerLogId) {
                peer = await this.peerServices.getPeerById(peerLogId);
            } else {
                peer = await this.peerServices.getPeerByPeerId(peerId);
            }

            if (!peer) {
                throw new Error("Peer does not exist");
            }

            const deletedPeer = await this.peerServices.deletePeer(peer.id);

            if (!deletedPeer) {
                throw new Error("Peer could not be deleted");
            }

            res.status(200).json(new ApiResponse(200, "Peer deleted successfully", { deletedPeer }));
        } catch (error) {
            next(error);
        }
    };



}
