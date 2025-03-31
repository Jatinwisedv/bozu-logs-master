export class ApiError extends Error {
    public statusCode: number;
    public isOperational: boolean;
    
  
    constructor(message: string, statusCode: number=400, isOperational = true) {
      super(message);
  
      // Set the prototype explicitly for proper inheritance in TypeScript
      Object.setPrototypeOf(this, new.target.prototype);
  
      this.statusCode = statusCode;
      this.isOperational = isOperational;
  
      Error.captureStackTrace(this);
    }
  }
  