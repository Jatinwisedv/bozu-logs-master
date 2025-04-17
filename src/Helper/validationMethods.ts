import  IEventLog  from "../Model/EventLogsModel";
import { IAdmin, Role } from '../Model/AdminModel';
import { EventServices } from "../Services/EventServices";
import { ApiError } from "./errorResponse";
export function validateEventLog(eventLogToAdd : any,checkRequired:boolean=false): void {


    if(checkRequired){

        
        if (!eventLogToAdd.eventId) {
            throw new ApiError("eventId is required and cannot be empty.");
        }
        

        if (!eventLogToAdd.eventName) {
            throw new ApiError("eventName is required and cannot be empty.");
        }

        if (!eventLogToAdd.eventNumber) {
            throw new ApiError("eventNumber is required and cannot be empty.");
        }

        if (!eventLogToAdd.eventDate) {
            throw new ApiError("eventDate is required and cannot be empty.");
        }

        if (!eventLogToAdd.eventStartTime) {
            throw new ApiError("eventStartTime is required and cannot be empty.");
        }
    }


    // Validate eventName length
    if (eventLogToAdd.eventName && eventLogToAdd.eventName.length > 200) {
        throw new ApiError("eventName cannot be more than 200 characters.");
    }

    // Validate eventNumber length
    if (eventLogToAdd.eventNumber && eventLogToAdd.eventNumber.length > 200) {
        throw new ApiError("eventNumber cannot be more than 200 characters.");
    }

    // Validate eventType length
    if (eventLogToAdd.eventType && eventLogToAdd.eventType.length > 200) {
        throw new ApiError("eventType cannot be more than 200 characters.");
    }

    // // Validate totalAttendees
    // if (eventLogToAdd.totalAttendees && eventLogToAdd.totalAttendees < 0) {
    //     throw new ApiError("totalAttendees cannot be less than 0.");
    // }

    // // Validate totalHost
    // if (eventLogToAdd.totalHost && eventLogToAdd.totalHost < 0) {
    //     throw new ApiError("totalHost cannot be less than 0.");
    // }

    // // Validate totalKickout
    // if (eventLogToAdd.totalKickout && eventLogToAdd.totalKickout < 0) {
    //     throw new ApiError("totalKickout cannot be less than 0.");
    // }

    // // Validate totalRaisedHand
    // if (eventLogToAdd.totalRaisedHand && eventLogToAdd.totalRaisedHand < 0) {
    //     throw new ApiError("totalRaisedHand cannot be less than 0.");
    // }

    // // Validate totalWaveHand
    // if (eventLogToAdd.totalWaveHand && eventLogToAdd.totalWaveHand < 0) {
    //     throw new ApiError("totalWaveHand cannot be less than 0.");
    // }

    // // Validate totalThumbsup
    // if (eventLogToAdd.totalThumbsup && eventLogToAdd.totalThumbsup < 0) {
    //     throw new ApiError("totalThumbsup cannot be less than 0.");
    // }

    // Validate eventEndTime
    if (eventLogToAdd.eventEndTime && eventLogToAdd.eventEndTime < eventLogToAdd.eventStartTime) {
        throw new ApiError("eventEndTime cannot be less than eventStartTime.");
    }
}


export function validateUserLoginLog(userLoginLog: any, checkRequired: boolean = false): void {
    //console.log(userLoginLog)
    const allowedDeviceSources = [
        'Web',
        'IOS',
        'Android',
        'Window_PCApp',
        'Mac_PCApp',
        'Linux_PCApp',
    ];

    if (checkRequired) {
        if (!userLoginLog.userId) {
            throw new ApiError("userId is required and cannot be empty.");
        }
        if (!userLoginLog.username) {
            throw new ApiError("username is required and cannot be empty.");
        }
        if (!userLoginLog.loginTime) {
            //throw new ApiError("loginTime is required and cannot be empty.");
            userLoginLog.loginTime = new Date().toISOString();
            
        }
        if(!userLoginLog.deviceSource){
            throw new ApiError("deviceSource is required and cannot be empty.");
        }

        if(!userLoginLog.ipAddress){
            throw new ApiError("ipAddress is required and cannot be empty.");
        }
    }

    
    // Validate username length
    if (userLoginLog.username && userLoginLog.username?.length > 100) {
        throw new ApiError("username cannot be more than 100 characters.");
    }

    // Validate ipAddress length
    if (userLoginLog.ipAddress && userLoginLog.ipAddress?.length > 100) {
        throw new ApiError("ipAddress cannot be more than 100 characters.");
    }

   
    // Validate loginStatus
    if (typeof userLoginLog.loginStatus !== 'undefined' && typeof userLoginLog.loginStatus !== 'boolean') {
        throw new ApiError("loginStatus must be a boolean value.");
    }

    // Validate logoutTime
    if (userLoginLog.logoutTime && userLoginLog.logoutTime < userLoginLog.loginTime) {
        throw new ApiError("logoutTime cannot be less than loginTime.");
    }

    if (userLoginLog.postalCode &&
        (userLoginLog.postalCode?.length > 11 || userLoginLog.postalCode?.length < 3)
    ) {
        throw new ApiError("Postal code must be between 3 and 11 characters");
    }
      
    if(userLoginLog.isp && userLoginLog.isp?.length > 500){
        throw new ApiError("isp cannot be more than 500 characters.");
    }

    if(userLoginLog.deviceSource &&allowedDeviceSources.indexOf(userLoginLog.deviceSource) === -1){
        throw new ApiError("deviceSource must be one of the following: Web, IOS, Android, Window_PCApp, Mac_PCApp, Linux_PCApp");
    }
}

export function validateAdmin(admin: any, checkRequired: boolean = false): void {
    const allowedRoles = [Role.ADMIN, Role.SUPERADMIN];

    if (checkRequired) {
        if (!admin.adminName) {
            throw new ApiError("adminName is required and cannot be empty.");
        }
        if (!admin.adminEmail) {
            throw new ApiError("adminEmail is required and cannot be empty.");
        }
        if (!admin.password) {
            throw new ApiError("password is required and cannot be empty.");
        }
        if (!admin.role) {
            throw new ApiError("role is required and cannot be empty.");
        }
    }

    // Validate adminName length
    if (admin.adminName && admin.adminName?.length > 50) {
        throw new ApiError("adminName cannot be more than 50 characters.");
    }

    // Validate adminEmail format
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,64}$/;
    if (admin.adminEmail && !emailRegex.test(admin.adminEmail)) {
        throw new ApiError("adminEmail must be a valid email address.");
    }

    // Validate password complexity
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (admin.password && !passwordRegex.test(admin.password)) {
        throw new ApiError("password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character.");
    }

    // Validate role
    if (admin.role && !allowedRoles.includes(admin.role)) {
        throw new ApiError("role must be one of the following: ADMIN, SUPERADMIN.");
    }
}


export function validatePeer(peerToAdd: any, checkRequired: boolean = false): void {
    if (checkRequired) {

        if(!peerToAdd.eventId){
            throw new ApiError("eventId is required and cannot be empty.");
        }

        if (!peerToAdd.peerId) {
            throw new ApiError("peerId is required and cannot be empty.");
        }

        if (!peerToAdd.peerName) {
            throw new ApiError("peerName is required and cannot be empty.");
        }

        if (!peerToAdd.ipAddress) {
            throw new ApiError("ipAddress is required and cannot be empty.");
        }

        // if (!peerToAdd.userAgent) {
        //     throw new ApiError("userAgent is required and cannot be empty.");
        // }
    }

    if(peerToAdd.eventId){
        const event = new EventServices().getEventLogByEvenetId(peerToAdd.eventId);

        if(!event){
            throw new ApiError("Event not found! Provided Event Id Is Invalid");
        }
    }
    
    if(peerToAdd.id || peerToAdd._id){
        throw new ApiError("request body can not contain id or _id");
    }

    // Validate peerName length
    if (peerToAdd.peerName && peerToAdd.peerName?.length > 200) {
        throw new ApiError("peerName cannot be more than 200 characters.");
    }

    // // Validate duration
    // if (peerToAdd.duration && !/^\d{2}:\d{2}:\d{2}$/.test(peerToAdd.duration)) {
    //     throw new ApiError("duration must be in the format HH:MM:SS.");
    // }

    // Validate latitude
    if (peerToAdd.latitude && (peerToAdd.latitude < -90 || peerToAdd.latitude > 90)) {
        throw new ApiError("latitude must be between -90 and 90.");
    }

    // Validate longitude
    if (peerToAdd.longitude && (peerToAdd.longitude < -180 || peerToAdd.longitude > 180)) {
        throw new ApiError("longitude must be between -180 and 180.");
    }

    // Validate postalCode length
    if (peerToAdd.postalCode && peerToAdd.postalCode.length > 20) {
        throw new ApiError("postalCode cannot be more than 20 characters.");
    }

    // Validate boolean fields
    const booleanFields = [
        "hasCopiedInvationLink",
        "hasClickedBirdsEyeView",
        "hasClickedlMyGroupView",
        "hasClickedEchoDetection",
        "hasClickedWhiteBoard",
        "hasClickedAnnotationBoard",
        "hasCreatedPoll",
        "hasSwitchedOnMike",
        "hasSwitchedOnCamera",
        "hasSelectedVirtualBackground",
        "hasClikedOnlyGroupCanSeeVideo",
        "hasSwitchedOnScreenShare",
        "hasClikedOnlyGroupCanSeeScreenShare",
        "hasRaisedHand",
        "hasThumbsUp",
        "hasThumbsDown",
        "hasClaped",
        "hasSwitchedOnAnnouncement",
        "hasStartedCc",
        "hasRequestedTranscript",
        "hasRequestedSummary",
        "hasGeneratedActionItems",
        "hasStartedRecording",
        "hasSwitchedOnMuteAll",
        "hasSwitchedOnDisabledAllVideos",
        "hasSwitchedOnLobbyStatus",
        "hasSwitchedOnGroupStatus",
        "hasSwitchedOnGroupLockStatus",
        "hasSwitchedOnPrivateVideoShareStatus",
        "hasSwitchedOnPrivateScreenShareStatus",
        "hasGotMike",
        "isPresenter",
        "isTriviaHost",
        "isStagePeer",
        "isBanFromPublicChat",
        "isKickedout",
        "usedShowOnlyMyGroupVideo",
        "hasSwitchedListenAll",
        "hasSwithcedHostOnlyListen",
        "isMainHost",
        "hasExportedAttendanceList",
    ];

    booleanFields.forEach((field) => {
        if (peerToAdd[field] !== undefined && typeof peerToAdd[field] !== "boolean") {
            throw new ApiError(`${field} must be a boolean.`);
        }
    });

    // Validate array fields
    const arrayFields = [
        "admitedPeers",
        "rejectedPeers",
        "kickedOut",
        "switchMadeHost",
        "switchBanFromPublicChat",
        "inviteToGroup",
        "joinToGroup",
        "madeGroupAnonymous",
        "passedMike",
        "inviteOnstage",
    ];

    arrayFields.forEach((field) => {
        if (peerToAdd[field] && !Array.isArray(peerToAdd[field])) {
            throw new ApiError(`${field} must be an array.`);
        }
    });
}



export function updatePeer(peer: any, peerToUpdate: any): void {
    if (peerToUpdate.eventId !== undefined) peer.eventId = peerToUpdate.eventId;
    if (peerToUpdate.peerId !== undefined) peer.peerId = peerToUpdate.peerId;
    if (peerToUpdate.peerName !== undefined) peer.peerName = peerToUpdate.peerName;
    if (peerToUpdate.useId !== undefined) peer.useId = peerToUpdate.useId;
    if (peerToUpdate.userEmail !== undefined) peer.userEmail = peerToUpdate.userEmail;
    if (peerToUpdate.eventJoinDatetime !== undefined) peer.eventJoinDatetime = peerToUpdate.eventJoinDatetime;
    if (peerToUpdate.eventLeftDatetime !== undefined) peer.eventLeftDatetime = peerToUpdate.eventLeftDatetime;
    if (peerToUpdate.eventType !== undefined) peer.eventType = peerToUpdate.eventType;
    if (peerToUpdate.isHost !== undefined) peer.isHost = peerToUpdate.isHost;
    if (peerToUpdate.ipAddress !== undefined) peer.ipAddress = peerToUpdate.ipAddress;
    if (peerToUpdate.userAgent !== undefined) peer.userAgent = peerToUpdate.userAgent;
    if (peerToUpdate.city !== undefined) peer.city = peerToUpdate.city;
    if (peerToUpdate.state !== undefined) peer.state = peerToUpdate.state;
    if (peerToUpdate.country !== undefined) peer.country = peerToUpdate.country;
    if (peerToUpdate.latitude !== undefined) peer.latitude = peerToUpdate.latitude;
    if (peerToUpdate.longitude !== undefined) peer.longitude = peerToUpdate.longitude;
    if (peerToUpdate.postalCode !== undefined) peer.postalCode = peerToUpdate.postalCode;
    if (peerToUpdate.isp !== undefined) peer.isp = peerToUpdate.isp;
    
    // Boolean Flags
    ["hasCopiedInvationLink", "hasClickedBirdsEyeView", "hasClickedlMyGroupView", "hasClickedEchoDetection", "hasClickedWhiteBoard", "hasClickedAnnotationBoard", "hasCreatedPoll", "hasSwitchedOnMike", "hasSwitchedOnCamera", "hasSelectedVirtualBackground", "hasClikedOnlyGroupCanSeeVideo", "hasSwitchedOnScreenShare", "hasClikedOnlyGroupCanSeeScreenShare", "hasRaisedHand", "hasThumbsUp", "hasThumbsDown", "hasClaped", "hasSwitchedOnAnnouncement", "hasStartedCc", "hasRequestedTranscript", "hasRequestedSummary", "hasGeneratedActionItems", "hasStartedRecording", "hasSwitchedOnMuteAll", "hasSwitchedOnDisabledAllVideos", "hasSwitchedOnLobbyStatus", "hasSwitchedOnGroupStatus", "hasSwitchedOnGroupLockStatus", "hasSwitchedOnPrivateVideoShareStatus", "hasSwitchedOnPrivateScreenShareStatus", "hasGotMike", "isPresenter", "isTriviaHost", "isStagePeer", "isBanFromPublicChat", "isKickedout", "usedShowOnlyMyGroupVideo", "hasSwitchedListenAll", "hasSwithcedHostOnlyListen", "isMainHost", "hasExportedAttendanceList"].forEach(flag => {
        if (peerToUpdate[flag] !== undefined) peer[flag] = peerToUpdate[flag];
    });


}



// if(eventLogToAdd.eventName && eventLogToAdd.eventName.length > 200){
//     throw new Error("eventName can not be more than 200 characters");
// }

// if(eventLogToAdd.eventNumber.length > 200){
//     throw new Error("eventNumber can not be more than 200 characters");
// }

// if(eventLogToAdd.eventType.length > 200){
//     throw new Error("eventType can not be more than 200 characters");
// }

// if(eventLogToAdd.totalAttendees && eventLogToAdd.totalAttendees < 0){
//     throw new Error("totalAttendees can not be less than 0");
// }

// if(eventLogToAdd.totalHost && eventLogToAdd.totalHost < 0){
//     throw new Error("totalHost can not be less than 0");
// }

// if(eventLogToAdd.totalKickout && eventLogToAdd.totalKickout < 0){
//     throw new Error("totalKickout can not be less than 0");
// }

// if(eventLogToAdd.totalRaisedHand && eventLogToAdd.totalRaisedHand < 0){
//     throw new Error("totalRaisedHand can not be less than 0");
// }

// if(eventLogToAdd.totalWaveHand && eventLogToAdd.totalWaveHand < 0){
//     throw new Error("totalWaveHand can not be less than 0");
// }

// if(eventLogToAdd.totalThumbsup && eventLogToAdd.totalThumbsup < 0){
//     throw new Error("totalThumbsup can not be less than 0");
// }

// if(eventLogToAdd.eventEndTime && eventLogToAdd.eventEndTime < eventLogToAdd.eventStartTime){
//     throw new Error("eventEndTime can not be less than eventStartTime");
// }