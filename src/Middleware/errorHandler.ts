import { ApiError } from "../Helper/errorResponse";
import { Request, Response, NextFunction } from 'express';
import { errorLogger } from '../Helper/wistonConfig';
import { ApiResponse } from "../Helper/apiResponse";
import config from "../Helper/config";
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  errorLogger.error(`Error: ${err.message} | Stack: ${err.stack}`);

  if (err instanceof ApiError) {
    res.status(err.statusCode).json(
      new ApiResponse(err.statusCode, err.message, {},err.isOperational)
    );
  } else {
    let status = 500;
    let message = 'Internal Server Error';

    if (err.name === 'ValidationError') {
      status = 400;
      message = err.message || 'Validation Error';
    } else if (err.name === 'MongoError') {
      status = 400;
      message = 'Database Error';
    } else if (err.name === 'CastError') {
      status = 400;
      message = 'Invalid Data Format';
    }

    res.status(status).json(new ApiResponse(
      status,
      message,
      {
        error: process.env.NODE_ENV || config.nodeEnv === 'production' ? undefined : err.message,
        errorObj: process.env.NODE_ENV || config.nodeEnv === 'production' ? undefined : err
      }
    ));
  }

}

export default errorHandler;








// import { Request, Response, NextFunction } from 'express';
// import { errorLogger } from '../Helper/wistonConfig';

// const errorHandler =  (err: any, req: Request, res: Response, next: NextFunction) => {
//   errorLogger.error(`Error: ${err.message} | Stack: ${err.stack}`);
//   console.error(err); 

  
//   let status = 500;
//   let message = 'Internal Server Error';

  
//   if (err.name === 'ValidationError') {
//     status = 400;
//     message = err.message || 'Validation Error';
//   } else if (err.name === 'MongoError') {
//     status = 400;
//     message = 'Database Error';
//   } else if (err.name === 'CastError') {
//     status = 400;
//     message = 'Invalid Data Format';
//   }

  
//   res.status(status).json({
//     status: 'error',
//     message: message,
//     error: process.env.NODE_ENV === 'production' ? undefined : err.message,
//     errorObj:process.env.NODE_ENV === 'production' ? undefined : err,
//   });
// }

// export default errorHandler;
