import express, { NextFunction, Request, Response } from 'express';
import { Router } from 'express';
import authMiddleware from '../../Middleware/authMiddleware';
import { ApiResponse } from '../../Helper/apiResponse';
import path from 'path';
import * as fs from 'fs';
const router = Router();

// /**
//  * @openapi
//  * /deleteUserById/{id}:
//  *   get:
//  *     summary: delete user by id.
//  *     tags:
//  *       - Users
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: id of the user to be deleted.
//  *     responses:
//  *       200:
//  *         description: user is deleted successfully.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 error:
//  *                   type: boolean
//  *                 message:
//  *                   type: string
//  *                 deletedUser:
//  *                   $ref: '#/components/schemas/AddUserRequestBody'
//  *       401:
//  *         description: No user found with the given ID.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 error:
//  *                   type: boolean
//  *                 message:
//  *                   type: string
//  *       400:
//  *         description: Internal Server Error.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 error:
//  *                   type: boolean
//  *                 message:
//  *                   type: string
//  *                 errorobj:
//  *                   type: object
//  */
// router.get("/",(req: Request, res: Response)=>{
//     res.send("Home")
// })


// interface AddUserRequestBody {
//     name: string;
//     email: string;
//     dob: string;
//     isActive: boolean;
//   }
  

// /**
// * @openapi
// * /addUser:
// *   post:
// *     summary: Add a new user
// *     description: This endpoint allows the creation of a new user by providing the user's name, email, date of birth, and active status.
// *     tags:
// *       - Users
// *     requestBody:
// *       required: true
// *       content:
// *         application/json:
// *           schema:
// *             type: object
// *             properties:
// *               name:
// *                 type: string
// *                 example: Nusarat
// *               email:
// *                 type: string
// *                 example: nusarat@example.com
// *               dob:
// *                 type: string
// *                 format: date
// *                 example: '1990-01-01'
// *               isActive:
// *                 type: boolean
// *                 example: true
// *     responses:
// *       '200':
// *         description: Successfully added the user
// *         content:
// *           application/json:
// *             schema:
// *               type: object
// *               properties:
// *                 error:
// *                   type: boolean
// *                   example: false
// *                 message:
// *                   type: string
// *                   example: User Added
// *                 data:
// *                   type: object
// *                   properties:
// *                     _id:
// *                       type: string
// *                       example: '605c72ef1532073d30f4e5d7'
// *                     name:
// *                       type: string
// *                       example: nusarat 
// *                     email:
// *                       type: string
// *                       example: nusarat@example.com
// *                     dob:
// *                       type: string
// *                       format: date
// *                       example: '1990-01-01'
// *                     isActive:
// *                       type: boolean
// *                       example: true
// *       '400':
// *         description: Internal Server Error
// *         content:
// *           application/json:
// *             schema:
// *               type: object
// *               properties:
// *                 error:
// *                   type: boolean
// *                   example: true
// *                 message:
// *                   type: string
// *                   example: Internal Server Error
// *                 errorobj:
// *                   type: object
// *                   example: {}
// */
// router.post('/addUser', async (req: Request<{}, {}, AddUserRequestBody>, res: Response) => {
//     try {
//       const { name, email, dob, isActive } = req.body;
  
//       const tempUserObject = {
//         name,
//         email,
//         dob,
//         isActive,
//       };
  
      
      
  
//       res.status(200).json(new ApiResponse(200,"user added",null));
//     } catch (error) {
//       console.error(error);
//       res.status(400).json({ error: true, message: 'Internal Server Error', errorobj: error });
//     }
//   });






  
  



export default router;
