import UserLoginLog , { IUserLoginLog } from '../Model/UserLoginLogModel';
import { Document } from 'mongoose';

class UserLoginLogService {

    async createLog(logData: Partial<IUserLoginLog>): Promise<IUserLoginLog> {
        const log = new UserLoginLog(logData);
        return await log.save();
    }


    async getLogById(id: string): Promise<IUserLoginLog | null> {
        return await UserLoginLog.findById(id).exec();
    }


    async getAllLogs(): Promise<IUserLoginLog[]> {
        return await UserLoginLog.find({}).exec();
    }

    
    async updateLog(id: string, updateData: Partial<IUserLoginLog>): Promise<IUserLoginLog | null> {
        return await UserLoginLog.findByIdAndUpdate(id, updateData, { new: true }).exec();
    }

    // Delete a log by ID
    async deleteLog(id: string): Promise<IUserLoginLog | null> {
        return await UserLoginLog.findByIdAndDelete(id).exec();
    }

    // Get paginated logs
    async getPaginatedLogs(startIndex: number, limit: number): Promise<IUserLoginLog[]> {
        return await UserLoginLog.find({})
            .skip(startIndex)
            .limit(limit)
            .exec();
    }

    // Get paginated and sorted logs
    async getPaginatedAndSortedLogs(
        startIndex: number,
        limit: number,
        sortField: keyof IUserLoginLog = 'startTime',
        sortOrder: 'asc' | 'desc' = 'asc'
    ): Promise<IUserLoginLog[]> {
        const sortDirection = sortOrder === 'asc' ? 1 : -1;
        return await UserLoginLog.find({})
            .sort({ [sortField]: sortDirection })
            .skip(startIndex)
            .limit(limit)
            .exec();
    }

    // Get logs filtered by login status
    async getLogsByLoginStatus(loginStatus: boolean): Promise<IUserLoginLog[]> {
        return await UserLoginLog.find({ loginStatus }).exec();
    }

    // Get logs filtered by username
    async getLogsByUsername(username: string): Promise<IUserLoginLog[]> {
        return await UserLoginLog.find({ username: new RegExp(username, 'i') }).exec();
    }


    // Get total number of EventLogs
    async getTotalUserLoginLogs(): Promise<number> {
        return await UserLoginLog.countDocuments().exec();
    }

    async searchUserLoginLog(searchText: string, searchField: string): Promise<IUserLoginLog[]> {
        return await UserLoginLog.find({ [searchField]: { $regex: searchText, $options: 'i' } }).lean().exec();
    }

    

}

export default UserLoginLogService;

