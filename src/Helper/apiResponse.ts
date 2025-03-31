class ApiResponse {

    statusCode: number;
    message: string;
    data: any;
    success: boolean;
    isOperationalError: boolean;

    constructor(statusCode: number, message: string, data: any,isOperationalError: boolean=false) {
        this.data = data;
        this.message = message;
        this.statusCode = statusCode;
        this.success = statusCode < 400;
        this.isOperationalError=isOperationalError;
    }
}

export {ApiResponse}