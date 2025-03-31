import { Request } from 'express';



export default function getUserAgent(req: Request): string | null {
    // Check if the User-Agent is in the request headers
    const userAgent = req.headers['user-agent'] || req.headers['x-forwarded-user-agent'];
    return userAgent ? userAgent as string : null;
}