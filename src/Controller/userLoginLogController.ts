import express, { NextFunction, Request, Response } from 'express';
import { Router } from 'express';
import authMiddleware from '../Middleware/authMiddleware';
import { ApiResponse } from '../Helper/apiResponse';
import path from 'path';
import * as fs from 'fs';
import { lookup } from 'dns/promises';
import { error } from 'console';
import { EventServices } from '../Services/EventServices';
import { add } from 'winston';
import { validateEventLog, validateUserLoginLog } from '../Helper/validationMethods';
import UserLoginLog from '../Model/UserLoginLogModel';
import { IUserLoginLog } from '../Model/UserLoginLogModel';
import UserLoginLogService from '../Services/UserLoginLogServices';
import getClientIp from '../Helper/getIp';
import { get } from 'http';
import getIPInfoForGivenIP from '../Helper/ipRequest';
import getUserAgent from '../Helper/getUserAgent';
import { ApiError } from '@google-cloud/storage';

interface GetLoginLogQuery {
    page?: string;
    limit?: string;
    sortOrder?: 'asc' | 'desc';
    includeactualTime?: string;
    sortField?:string
}

interface SearchUserLoginLogBody {
    searchText: string;
    searchField: string;
}
export class UserLoginLogController {

    private userLoginLogServices: UserLoginLogService;


    constructor() {
        this.userLoginLogServices = new UserLoginLogService();
    }


    postUserLoginLog = async (req: Request<{}, {}, IUserLoginLog>, res: Response, next: NextFunction) => {
        try {

            const { id, _id } = req.body;

            if (id || _id) {
                throw new ApiError("id or _id can not be passed in request body");
            }

            const userLoginLogToAdd: IUserLoginLog = req.body;

            validateUserLoginLog(userLoginLogToAdd, true);

            const addedUserLoginLog = await this.userLoginLogServices.createLog(userLoginLogToAdd);


            if(!addedUserLoginLog){
                throw new ApiError("user login log could not be created");
            }

            res.status(201).json(new ApiResponse(201, "user-login-log created successfully", {
                addedUserLoginLog,
                loginLogid: addedUserLoginLog.id
            }
            ))


        } catch (error) {
            next(error)
        }
    }

    putUserLoginLog = async (req: Request<{ userLoginLogId: string }, {}, IUserLoginLog>, res: Response, next: NextFunction) => {

        try {

            const id = req.params.userLoginLogId || null;

            if (!id) {
                throw new ApiError("userLoginLogId is required and can not be blank");
            }

            const userLoginLogToUpdate: Partial<IUserLoginLog> = req.body;

            if (userLoginLogToUpdate.id || userLoginLogToUpdate._id) {
                throw new ApiError("id or _id can not be passed in request body");
            }

            validateUserLoginLog(userLoginLogToUpdate, true);

            const isUserLoginLogExist = await this.userLoginLogServices.getLogById(id);

            if (!isUserLoginLogExist) {
                throw new ApiError("user login log does not exist");
            }


            const updatedUserLoginLog = await this.userLoginLogServices.updateLog(id, userLoginLogToUpdate);

            if(!updatedUserLoginLog){
                throw new ApiError("user login log could not be updated");
            }

            res.status(200).json(new ApiResponse(200, "user login log updated successfully", { updatedUserLoginLog }))

        } catch (error) {
            next(error);
        }
    }

    patchUserLoginLog = async (req: Request<{ userLoginLogId: string }, {}, Partial<IUserLoginLog>>, res: Response, next: NextFunction) => {

        try {

            const id = req.params.userLoginLogId || null;


            if (!id) {
                throw new ApiError("userLoginLogId is required and can not be blank");
            }

            const userLoginLogToUpdate: Partial<IUserLoginLog> = req.body;

            if (userLoginLogToUpdate.id || userLoginLogToUpdate._id) {
                throw new ApiError("id or _id can not be passed in request body");
            }

            validateUserLoginLog(userLoginLogToUpdate);

            const isUserLoginLogExist = await this.userLoginLogServices.getLogById(id);

            if (!isUserLoginLogExist) {
                throw new ApiError("user login log does not exist");
            }

            const updatedUserLoginLog = await this.userLoginLogServices.updateLog(id, userLoginLogToUpdate);

            if(!updatedUserLoginLog){
                throw new ApiError("user login log could not be updated");
            }

            res.status(200).json(new ApiResponse(200, "user login log updated successfully", { updatedUserLoginLog }))

        } catch (error) {
            next(error);
        }
    }

    getUserLoginLog = async (req: Request<{}, {}, {}, GetLoginLogQuery>, res: Response, next: NextFunction) => {
        try {

            const page = req.query.page ? parseInt(req.query.page) : 1;
            const limit = req.query.limit ? parseInt(req.query.limit) : 5;
            const startIndex = (page - 1) * limit;
            const sortOrder = req.query.sortOrder === 'desc' ? 'desc' : 'asc';
            const totalLoginLogs = await this.userLoginLogServices.getTotalUserLoginLogs();


            if (limit < 1) {
                throw new ApiError(`Limit can not be less than 1`);
            }

            if (page < 1) {
                throw new ApiError(`Page can not be less than 1`);
            }

            if (sortOrder !== 'asc' && sortOrder !== 'desc') {
                throw new ApiError(`Sort order can only be asc or desc`);
            }

            if (totalLoginLogs < 1) {
                throw new ApiError(`No event logs found`);
            }


            const paginationInfo = {
                currentPage: page,
                totaPages: Math.ceil(totalLoginLogs / limit),
                totalEvents: totalLoginLogs,
                limit: limit,
                sortOrder: sortOrder
            }

            if (page > paginationInfo.totaPages) {
                throw new ApiError(`Page does not exist requested page (${page}) > total pages (${paginationInfo.totaPages})`);
            }

            const loginLogs = await this.userLoginLogServices.getPaginatedAndSortedLogs(startIndex, limit, 'startTime', sortOrder);

            res.status(200).json(new ApiResponse(200, "User Login logs fetched successfully", { loginLogs, paginationInfo }));


        } catch (error) {
            next(error);
        }
    };

    getUserLoginLogDynamicSortV1 = async (req: Request<{}, {}, {}, GetLoginLogQuery>, res: Response, next: NextFunction) => {
        try {
            const page = req.query.page ? parseInt(req.query.page) : 1;
            const limit = req.query.limit ? parseInt(req.query.limit) : 5;
            const startIndex = (page - 1) * limit;
            const sortOrder = req.query.sortOrder === 'desc' ? 'desc' : 'asc';
            
            const validSortFields: Array<keyof IUserLoginLog> = ['startTime', 'endTime', 'userId', 'username', 'deviceSource'];
            const sortField = req.query.sortField && validSortFields.includes(req.query.sortField as keyof IUserLoginLog)
                ? req.query.sortField as keyof IUserLoginLog
                : 'startTime';

            if(req.query.sortField && !(validSortFields.includes(req.query.sortField as keyof IUserLoginLog))){
                throw new ApiError(`sortField can only be from ${validSortFields} `)
            }
       
            
            const totalLoginLogs = await this.userLoginLogServices.getTotalUserLoginLogs();
    
            if (limit < 1) {
                throw new ApiError(`Limit cannot be less than 1`);
            }
    
            if (page < 1) {
                throw new ApiError(`Page cannot be less than 1`);
            }
    
            if (sortOrder !== 'asc' && sortOrder !== 'desc') {
                throw new ApiError(`Sort order can only be 'asc' or 'desc'`);
            }
    
            if (totalLoginLogs < 1) {
                throw new ApiError(`No event logs found`);
            }
    
            const paginationInfo = {
                currentPage: page,
                totalPages: Math.ceil(totalLoginLogs / limit),
                totalEvents: totalLoginLogs,
                limit: limit,
                sortOrder: sortOrder,
                sortField,
                validSortFields
            };
    
            if (page > paginationInfo.totalPages) {
                throw new ApiError(`Page does not exist: requested page (${page}) > total pages (${paginationInfo.totalPages})`);
            }
    
            const loginLogs = await this.userLoginLogServices.getPaginatedAndSortedLogs(
                startIndex, limit, sortField, sortOrder
            );
    
            res.status(200).json(new ApiResponse(200, "User Login logs fetched successfully", { loginLogs, paginationInfo }));
        } catch (error) {
            next(error);
        }
    };

    getUserLoginLogDynamicSort = async (req: Request<{}, {}, GetLoginLogQuery>, res: Response, next: NextFunction) => {
        try {
            // Extract parameters from the body, ensuring they are numbers
            const { page = 1, limit = 5, sortOrder = 'asc'} = req.body;
            const sortField =  req.body.sortField  ? req.body.sortField as keyof IUserLoginLog : 'startTime' as keyof IUserLoginLog 

            // Ensure page and limit are numbers
            const parsedPage = Number(page);
            const parsedLimit = Number(limit);
            
            const startIndex = (parsedPage - 1) * parsedLimit;
    
            // Validating sort field and sort order
            const validSortFields: Array<keyof IUserLoginLog> = ['startTime', 'endTime', 'userId', 'username', 'deviceSource'];
            if (sortField && !validSortFields.includes(sortField as keyof IUserLoginLog)) {
                throw new ApiError(`sortField can only be from ${validSortFields}`);
            }
    
            if (sortOrder !== 'asc' && sortOrder !== 'desc') {
                throw new ApiError(`Sort order can only be 'asc' or 'desc'`);
            }
            
            const totalLoginLogs = await this.userLoginLogServices.getTotalUserLoginLogs();
            
            // Validation checks
            if (parsedLimit < 1) {
                throw new ApiError(`Limit cannot be less than 1`);
            }
    
            if (parsedPage < 1) {
                throw new ApiError(`Page cannot be less than 1`);
            }
    
            if (totalLoginLogs < 1) {
                throw new ApiError(`No event logs found`);
            }
    
            const paginationInfo = {
                currentPage: parsedPage,
                totalPages: Math.ceil(totalLoginLogs / parsedLimit),
                totalEvents: totalLoginLogs,
                limit: parsedLimit,
                sortOrder: sortOrder,
                sortField,
                validSortFields
            };
    
            if (parsedPage > paginationInfo.totalPages) {
                throw new ApiError(`Page does not exist: requested page (${parsedPage}) > total pages (${paginationInfo.totalPages})`);
            }
    
            const loginLogs = await this.userLoginLogServices.getPaginatedAndSortedLogs(
                startIndex, parsedLimit, sortField, sortOrder
            );
    
            res.status(200).json(new ApiResponse(200, "User Login logs fetched successfully", { loginLogs, paginationInfo }));
        } catch (error) {
            next(error);
        }
    };
    
    getUserLoginLogById = async (req: Request<{ userLoginLogId: string }, {}, {}>, res: Response, next: NextFunction) => {

        try {

            const id = req.params.userLoginLogId || null;

            if (!id) {
                throw new ApiError("userLoginLogId is required and can not be blank");
            }

            const isUserLoginLogExist = await this.userLoginLogServices.getLogById(id);

            if (!isUserLoginLogExist) {
                throw new ApiError("user login log does not exist with provided id");
            }

            res.status(200).json(new ApiResponse(200, "user login log fetched successfully", { userLoginLog: isUserLoginLogExist }))

        } catch (error) {
            next(error);
        }
    }

    deleteUserLoginLog = async (req: Request<{ userLoginLogId: string }, {}, {}>, res: Response, next: NextFunction) => {
        try {

            const id = req.params.userLoginLogId || null;

            if (!id) {
                throw new ApiError("userLoginLogId is required and can not be blank");
            }

            const isUserLoginLogExist = await this.userLoginLogServices.getLogById(id);

            if (!isUserLoginLogExist) {
                throw new ApiError("user login log does not exist with provided id");
            }


            const deletedUserLoginLog = await this.userLoginLogServices.deleteLog(id);

            if (!deletedUserLoginLog) {
                throw new ApiError("user login log can not be deleted");
            }

            res.status(200).json(new ApiResponse(200, "user login log deleted successfully", { deletedUserLoginLog }))

        } catch (error) {
            next(error);
        }
    }

    putLogoutTime = async (req: Request<{ userLoginLogId: string }, {}, {}>, res: Response, next: NextFunction) => {
        try {

            const logOutTime = Date.now();
            console.log(logOutTime);
            const logOutDate = new Date(logOutTime);

 
            const id = req.params.userLoginLogId || null;   

            if (!id) {
                throw new ApiError("userLoginLogId is required and can not be blank");
            }

            const isUserLoginLogExist = await this.userLoginLogServices.getLogById(id);

            if (!isUserLoginLogExist) {
                throw new ApiError("user login log does not exist with provided id");
            }


            const updatedUserLoginLog = await this.userLoginLogServices.updateLog(id, { endTime: logOutDate });

            if (!updatedUserLoginLog) {
                throw new ApiError("user login log can not be updated");
            }

            
            res.status(200).json(new ApiResponse(200, "user login log updated successfully", { updatedUserLoginLog }))

        } catch (error) {
            next(error);
        }
    }

    postUserLoginLogWithIpInfo = async (req: Request<{}, {}, IUserLoginLog>, res: Response, next: NextFunction) => {
        try {

            const { id, _id } = req.body;

            if (id || _id) {
                throw new ApiError("id or _id can not be passed in request body");
            }

            const userLoginLogToAdd: IUserLoginLog = req.body;

            validateUserLoginLog(userLoginLogToAdd, true);

            if (!userLoginLogToAdd.ipAddress) {
                throw new ApiError("Ip can not be empty");
            }

            const userAgent = getUserAgent(req);

            if (userAgent) {
                userLoginLogToAdd.userAgent = userAgent;
            }

            const data = await getIPInfoForGivenIP(userLoginLogToAdd.ipAddress);

            if (!data) {
                throw new ApiError("can not be fetch data from ipinfo.io");
            }

            if (data.country) {
                userLoginLogToAdd.country = data?.country;
            }

            if (data.city) {
                userLoginLogToAdd.city = data?.city;
            }

            if (data.region) {
                userLoginLogToAdd.state = data?.region;
            }

            if (data.postal) {
                userLoginLogToAdd.postalCode = data?.postal;
            }

            if (data.org) {
                userLoginLogToAdd.isp = data?.org;
            }

            if (data.loc) {
                const loc = data?.loc?.split(",");
                if (loc) {
                    userLoginLogToAdd.latitude = parseFloat(loc[0]);
                    userLoginLogToAdd.longitude = parseFloat(loc[1]);
                }
            }

            const addedUserLoginLog = await this.userLoginLogServices.createLog(userLoginLogToAdd);

            if(!addedUserLoginLog) {
                throw new ApiError("user login log can not be created");
            }

            res.status(201).json(new ApiResponse(201, "user-login-log created successfully", {
                addedUserLoginLog,
                loginLogid: addedUserLoginLog.id,
                //data
            }
            ))

        } catch (error) {
            next(error)
        }
    }

    searchUserLoginLog = async (req: Request<{}, {}, SearchUserLoginLogBody>, res: Response, next: NextFunction) => {
        try {
            
            const { searchText, searchField } = req.body;

            if(!searchText || !searchField){
                throw new ApiError("searchText and searchField are required");
            }

            const validSearchFields: Array<keyof IUserLoginLog> = ['username', 'ipAddress', 'deviceSource', 'country', 'city', 'state', 'postalCode', 'isp', 'latitude', 'longitude'];
            if (!validSearchFields.includes(searchField as keyof IUserLoginLog)) {
                throw new ApiError(`searchField can only be from ${validSearchFields}`);
            }

            const userLoginLogs = await this.userLoginLogServices.searchUserLoginLog(searchText, searchField);

            if(!userLoginLogs){
                throw new ApiError("user login log does not exist with provided username");
            }

            res.status(200).json(new ApiResponse(200, "user login log fetched successfully", { userLoginLogs,totalCount:userLoginLogs.length }));
    
        } catch (error) {
            next(error)
        }
    }

}






