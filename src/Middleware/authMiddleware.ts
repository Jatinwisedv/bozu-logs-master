import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import getClientIp from "../Helper/getIp";
import config from "../Helper/config";
interface JwtPayload {
  adminId: string;
  adminName: string;
  ipAddress: string
}

interface AuthenticatedRequest extends Request {
  //admin?: JwtPayload;
}

const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  
  console.log(req.url)
  if (req.url.startsWith("/admin")) {

    const authHeader = req.headers["authorization"];

    if (!authHeader) {
      throw new Error("Unauthorized: Missing authorization header for admin");
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      throw new Error("Unauthorized: Missing Admin token");
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET || config.jwt.secret) as JwtPayload;
    //req.admin = payload; 

    const clientip:string = getClientIp(req);
   
    console.log('clientip',clientip);
    console.log('payload',payload.ipAddress,!(clientip.localeCompare(payload.ipAddress)!==0));
    
    if((clientip.localeCompare(payload.ipAddress)!==0)){
      throw new Error("Unauthorized: Invalid IP Please login again");
    }

    (req as any).admin = payload;

    next();
  }

  if (req.url.startsWith("/user")) {

    // const authHeader = req.headers["authorization"];

    // if (!authHeader) {
    //   throw new Error("Unauthorized: Missing authorization header for admin");
    // }

    // const token = authHeader.split(" ")[1];
    // if (!token) {
    //   throw new Error("Unauthorized: Missing Admin token");
    // }

    // const payload = jwt.verify(token, process.env.JWT_SECRET || "") as JwtPayload;
    // //req.admin = payload; 

    // const clientip:string = getClientIp(req);
   
    // console.log('clientip',clientip);
    // console.log('payload',payload.ipAddress,!(clientip.localeCompare(payload.ipAddress)!==0));
    
    // if((clientip.localeCompare(payload.ipAddress)!==0)){
    //   throw new Error("Unauthorized: Invalid IP Please login again");
    // }

    // (req as any).admin = payload;
    next();
  }
};

export default authMiddleware;


// import { Request, Response, NextFunction } from "express";
// import jwt from "jsonwebtoken";
// import getClientIp from "../Helper/getIp";

// interface JwtPayload {
//   adminId: string;
//   adminName: string;
//   ipAddress: string
// }

// export interface AuthenticatedRequest extends Request {
//   admin?: JwtPayload; // Extending the request object for admin
// }

// const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  
//   console.log(req.url)
//   if (req.url.startsWith("/admin")) {

//     const authHeader = req.headers["authorization"];

//     if (!authHeader) {
//       throw new Error("Unauthorized: Missing authorization header for admin");
//     }

//     const token = authHeader.split(" ")[1];
//     if (!token) {
//       throw new Error("Unauthorized: Missing Admin token");
//     }

//     const payload = jwt.verify(token, process.env.JWT_SECRET || "") as JwtPayload;
//     //req.admin = payload; 

//     const clientip:string = getClientIp(req);
   
//     console.log('clientip',clientip);
//     console.log('payload',payload.ipAddress,!(clientip.localeCompare(payload.ipAddress)!==0));
    
//     if((clientip.localeCompare(payload.ipAddress)!==0)){
//       throw new Error("Unauthorized: Invalid IP Please login again");
//     }

//     (req as any).admin = payload;

//     next();
//   }

//   if (req.url.startsWith("/user")) {

//     // const authHeader = req.headers["authorization"];

//     // if (!authHeader) {
//     //   throw new Error("Unauthorized: Missing authorization header for admin");
//     // }

//     // const token = authHeader.split(" ")[1];
//     // if (!token) {
//     //   throw new Error("Unauthorized: Missing Admin token");
//     // }

//     // const payload = jwt.verify(token, process.env.JWT_SECRET || "") as JwtPayload;
//     // //req.admin = payload; 

//     // const clientip:string = getClientIp(req);
   
//     // console.log('clientip',clientip);
//     // console.log('payload',payload.ipAddress,!(clientip.localeCompare(payload.ipAddress)!==0));
    
//     // if((clientip.localeCompare(payload.ipAddress)!==0)){
//     //   throw new Error("Unauthorized: Invalid IP Please login again");
//     // }

//     // (req as any).admin = payload;
//     next();
//   }
// };

// export default authMiddleware;







