import express, { NextFunction, Request, Response } from 'express';

import { ApiResponse } from '../Helper/apiResponse';
import { validateAdmin, validateUserLoginLog } from '../Helper/validationMethods';
import { Admin, IAdmin, Role } from '../Model/AdminModel';
import AdminService from '../Services/AdminServices';
import getClientIp from '../Helper/getIp';
import dotenv from "dotenv";
import { count } from 'console';
import { ApiError } from '../Helper/errorResponse';
import config from '../Helper/config';
dotenv.config();




interface GetAdminQuery {
    page?: string;
    limit?: string;
    sortOrder?: 'asc' | 'desc';
    includeactualTime?: string;
    sortField?: string; 

}

interface SearchAdminBody {
    searchText: string;
    searchField: string;

}

interface IAdminLogin {
    adminEmail: string;
    password: string
}
export class AdminController {

    private adminServices: AdminService;


    constructor() {
        this.adminServices = new AdminService();
    }


    adminLogin = async (req: Request<{}, {}, IAdminLogin>, res: Response, next: NextFunction) => {
        try {

            const adminloginCredentials: IAdminLogin = req.body;

            validateAdmin(adminloginCredentials, false);

            const admin = await this.adminServices.getAdminByEmail(adminloginCredentials.adminEmail);

            if (!admin) {
                throw new ApiError("Invalid credentials");
            }

            const isAuthenticated = await admin.comparePassword(adminloginCredentials.password);

            if (!isAuthenticated) {
                throw new ApiError("Invalid credentials Fail");
            }

            const ip = getClientIp(req);
            const token = admin.createJWT(ip);

            if (!token) {
                throw new ApiError("token could not be created");
            }

            res.status(200).json(new ApiResponse(200, "Login successful", {
                admin,
                token,
                isAuthenticated
            }))

        } catch (error) {
            next(error)
        }
    }

    postAdmin = async (req: Request<{}, {}, IAdmin>, res: Response, next: NextFunction) => {
        try {
            const { id, _id } = req.body;

            if (id || _id) {
                throw new ApiError("id or _id can not be passed in request body");
            }

            const admin = (req as any).admin;

            if (!admin) {
                throw new ApiError("admin can not be authenticated");
            }

            if (admin.role !== Role.SUPERADMIN) {
                throw new ApiError("only superadmin can add another admin");
            }

            const adminToAdd: IAdmin = req.body;

            const adminAlredyExist = await this.adminServices.getAdminByEmail(adminToAdd.adminEmail);

            if (adminAlredyExist) {
                throw new ApiError("admin with provided email already exists");
            }

            const adminNameAlredyExist = await this.adminServices.getAdminByAdminName(adminToAdd.adminName);

            if (adminNameAlredyExist) {
                throw new ApiError("admin with provided name already exists");
            }

            validateAdmin(adminToAdd, true);

            const addedAdmin = await this.adminServices.createAdmin(adminToAdd);

            if (!addedAdmin) {
                throw new ApiError("admin could not be created");
            }

            res.status(201).json(new ApiResponse(201, "admin created successfully", {
                addedAdmin,
                loginLogid: addedAdmin.id
            }))

        } catch (error) {
            next(error)
        }
    }

    postDefaultAdmin = async (req: Request<{}, {}, {}>, res: Response, next: NextFunction) => {
        try {

            const defaultadmin = {
                adminEmail: process.env.ADMIN_EMAIL as string || config.admin.email,
                password: process.env.ADMIN_PASSWORD as string || config.admin.password,
                role: process.env.ADMIN_ROLE as Role || config.admin.role,
                adminName: process.env.ADMIN_NAME as string || config.admin.name
            }

            const adminAlredyExist = await this.adminServices.getAdminByEmail(defaultadmin.adminEmail);

            if (adminAlredyExist) {
                res.status(201).json(new ApiResponse(201, "default admin alredy exist with same email", {
                    adminAlredyExist,
                    loginLogid: adminAlredyExist.id
                }))
                return;
            }

            validateAdmin(defaultadmin, true);

            const addedAdmin = await this.adminServices.createAdmin(defaultadmin);

            if (!addedAdmin) {
                throw new ApiError("default admin could not be created");
            }

            res.status(201).json(new ApiResponse(201, "default admin created successfully", {
                addedAdmin,
                loginLogid: addedAdmin.id
            }))

        } catch (error) {
            next(error)
        }
    }

    putAdmin = async (req: Request<{ adminId: string }, {}, IAdmin>, res: Response, next: NextFunction) => {

        try {

            const id = req.params.adminId || null;

            if (!id) {
                throw new ApiError("adminId is required and can not be blank");
            }

            const admin = (req as any).admin;

            if (!admin) {
                throw new ApiError("admin can not be authenticated");
            }

            if (admin.role !== Role.SUPERADMIN) {
                throw new ApiError("only superadmin can add another admin");
            }

            const adminToUpdate: IAdmin = req.body;

            if (adminToUpdate.id || adminToUpdate._id) {
                throw new ApiError("id or _id can not be passed in request body");
            }

            validateAdmin(adminToUpdate, true);

            const isAdminExist = await this.adminServices.getAdminById(id);

            if (!isAdminExist) {
                throw new ApiError("admin does not exist");
            }

            const adminNameAlredyExist = await this.adminServices.getAdminByAdminName(adminToUpdate.adminName);

            if (adminNameAlredyExist?.id !== isAdminExist.id) {
                throw new ApiError("admin with provided name already exists");
            }

            const updatedAdmin = await this.adminServices.updateAdmin(id, adminToUpdate);

            if (!updatedAdmin) {
                throw new ApiError("admin could not be updated");
            }

            res.status(200).json(new ApiResponse(200, "user login logadmin updated successfully", { updatedAdmin }))

        } catch (error) {
            next(error);
        }
    }

    getAdminsV1 = async (req: Request<{}, {}, {}, GetAdminQuery>, res: Response, next: NextFunction) => {
        try {
            const page = req.query.page ? parseInt(req.query.page) : 1;
            const limit = req.query.limit ? parseInt(req.query.limit) : 5;
            const sortOrder = req.query.sortOrder === "desc" ? "desc" : "asc";
    
            const validSortFields: Array<keyof IAdmin> = [ "adminName", "adminEmail", "role"];
            const sortField = validSortFields.includes(req.query.sortField as keyof IAdmin)
                ? (req.query.sortField as keyof IAdmin)
                : "adminName";
    
            if(req.query.sortField && !(validSortFields.includes(req.query.sortField as keyof IAdmin))){
                throw new ApiError(`sortField can only be from ${validSortFields} `)
            }

            if (limit < 1) {
                throw new ApiError(`Limit cannot be less than 1`);
            }
    
            if (page < 1) {
                throw new ApiError(`Page cannot be less than 1`);
            }
    
            const totalAdmins = await this.adminServices.getTotalAdmins();
            if (totalAdmins < 1) {
                throw new ApiError(`No admins found`);
            }
    
            const paginationInfo = {
                currentPage: page,
                totalPages: Math.ceil(totalAdmins / limit),
                totalAdmins: totalAdmins,
                limit: limit,
                sortOrder: sortOrder,
                validSortFields,
                sortField
            };
    
            if (page > paginationInfo.totalPages) {
                throw new ApiError(`Page does not exist: requested page (${page}) > total pages (${paginationInfo.totalPages})`);
            }
    
            const startIndex = (page - 1) * limit;
            const admins = await this.adminServices.getPaginatedAndSortedAdmins(startIndex, limit, sortField, sortOrder);
    
            res.status(200).json(new ApiResponse(200, "Admins fetched successfully", { admins, paginationInfo }));
        } catch (error) {
            next(error);
        }
    };

    getAdmins = async (req: Request<{}, {}, GetAdminQuery>, res: Response, next: NextFunction) => {
        try {
            const { page = 1, limit = 5, sortOrder = "asc", sortField = "adminName" } = req.body;
    
            const parsedPage = parseInt(page.toString());
            const parsedLimit = parseInt(limit.toString());
            const parsedSortOrder = sortOrder === "desc" ? "desc" : "asc";
    
            const validSortFields: Array<keyof IAdmin> = ["adminName", "adminEmail", "role"];
            const finalSortField = validSortFields.includes(sortField as keyof IAdmin) 
                ? (sortField as keyof IAdmin) 
                : "adminName";
    
            if (!validSortFields.includes(finalSortField)) {
                throw new ApiError(`sortField can only be one of ${validSortFields.join(", ")}`);
            }
    
            if (parsedLimit < 1) {
                throw new ApiError(`Limit cannot be less than 1`);
            }
    
            if (parsedPage < 1) {
                throw new ApiError(`Page cannot be less than 1`);
            }
    
            const totalAdmins = await this.adminServices.getTotalAdmins();
            if (totalAdmins < 1) {
                throw new ApiError(`No admins found`);
            }
    
            const paginationInfo = {
                currentPage: parsedPage,
                totalPages: Math.ceil(totalAdmins / parsedLimit),
                totalAdmins,
                limit: parsedLimit,
                sortOrder: parsedSortOrder,
                validSortFields,
                sortField: finalSortField
            };
    
            if (parsedPage > paginationInfo.totalPages) {
                throw new ApiError(`Page does not exist: requested page (${parsedPage}) > total pages (${paginationInfo.totalPages})`);
            }
    
            const startIndex = (parsedPage - 1) * parsedLimit;
            const admins = await this.adminServices.getPaginatedAndSortedAdmins(startIndex, parsedLimit, finalSortField, parsedSortOrder);
    
            res.status(200).json(new ApiResponse(200, "Admins fetched successfully", { admins, paginationInfo }));
        } catch (error) {
            next(error);
        }
    };
    
    // getAdmins = async (req: Request<{}, {}, {}, GetAdminQuery>, res: Response, next: NextFunction) => {
    //     try {
    //         const page = req.query.page ? parseInt(req.query.page) : 1;
    //         const limit = req.query.limit ? parseInt(req.query.limit) : 5;
    //         const startIndex = (page - 1) * limit;
    //         const sortOrder = req.query.sortOrder === "desc" ? "desc" : "asc";
    //         const totalAdmins = await this.adminServices.getTotalAdmins();

    //         if (limit < 1) {
    //             throw new Error(`Limit cannot be less than 1`);
    //         }

    //         if (page < 1) {
    //             throw new Error(`Page cannot be less than 1`);
    //         }

    //         if (sortOrder !== "asc" && sortOrder !== "desc") {
    //             throw new Error(`Sort order can only be 'asc' or 'desc'`);
    //         }

    //         if (totalAdmins < 1) {
    //             throw new Error(`No admins found`);
    //         }

    //         const paginationInfo = {
    //             currentPage: page,
    //             totalPages: Math.ceil(totalAdmins / limit),
    //             totalAdmins: totalAdmins,
    //             limit: limit,
    //             sortOrder: sortOrder,
    //         };

    //         if (page > paginationInfo.totalPages) {
    //             throw new Error(`Page does not exist: requested page (${page}) > total pages (${paginationInfo.totalPages})`);
    //         }

    //         const admins = await this.adminServices.getPaginatedAndSortedAdmins(startIndex, limit, "adminName", sortOrder);

    //         res.status(200).json(new ApiResponse(200, "Admins fetched successfully", { admins, paginationInfo }));
    //     } catch (error) {
    //         next(error);
    //     }
    // };


    getAdminById = async (req: Request<{ adminId: string }, {}, {}>, res: Response, next: NextFunction) => {
        try {
            const id = req.params.adminId || null;

            if (!id) {
                throw new ApiError("Admin ID is required and cannot be blank");
            }

            const isAdminExist = await this.adminServices.getAdminById(id);

            if (!isAdminExist) {
                throw new ApiError("Admin does not exist with the provided ID");
            }

            res.status(200).json(new ApiResponse(200, "Admin fetched successfully", { admin: isAdminExist }));
        } catch (error) {
            next(error);
        }
    };

    deleteAdmin = async (req: Request<{ adminId: string }, {}, {}>, res: Response, next: NextFunction) => {
        try {
            const id = req.params.adminId || null;

            if (!id) {
                throw new ApiError("Admin ID is required and cannot be blank");
            }

            const isAdminExist = await this.adminServices.getAdminById(id);

            if (!isAdminExist) {
                throw new ApiError("Admin does not exist with the provided ID");
            }

            const deletedAdmin = await this.adminServices.deleteAdmin(id);

            if (!deletedAdmin) {
                throw new ApiError("Admin could not be deleted");
            }

            res.status(200).json(new ApiResponse(200, "Admin deleted successfully", { deletedAdmin }));
        } catch (error) {
            next(error);
        }
    };

    searchAdmin = async (req: Request<{}, {}, SearchAdminBody>, res: Response, next: NextFunction) => {
        try {

            const {searchText,searchField} = req.body;

            if(!searchText || !searchField){    
                throw new ApiError("searchText and searchField are required");
            }

            const validSearchFields: Array<keyof IAdmin> = ["adminName", "adminEmail", "role"];
            if (!validSearchFields.includes(searchField as keyof IAdmin)) {
                throw new ApiError(`searchField can only be one of ${validSearchFields.join(", ")}`);
            }

            const admins = await this.adminServices.searchAdmin(searchText,searchField);

            if(!admins){
                throw new ApiError("No admins found");
            }

            res.status(200).json(new ApiResponse(200, "Admins fetched successfully", { admins,count:admins.length }));
        } catch (error) {
            next(error);
        }
    };
}











