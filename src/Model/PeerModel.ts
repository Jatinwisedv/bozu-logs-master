import mongoose, { Document, Schema, model } from 'mongoose';

export interface IPeers extends Document {
    eventId: string;
    peerId: string;
    peerName: string;
    useId?: string;
    userEmail?: string;
    eventJoinDatetime: Date;
    eventLeftDatetime?: Date;
    eventType?: string;
    isHost?: boolean;
    ipAddress: string;
    userAgent?: string;
    city?: string;
    state?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
    postalCode?: string;
    isp?: string;
    hasCopiedInvationLink?: boolean;
    hasClickedBirdsEyeView?: boolean;
    hasClickedlMyGroupView?: boolean;
    hasClickedEchoDetection?: boolean;
    hasClickedWhiteBoard?: boolean;
    hasClickedAnnotationBoard?: boolean;
    hasCreatedPoll?: boolean;
    hasSwitchedOnMike?: boolean;
    hasSwitchedOnCamera?: boolean;
    hasSelectedVirtualBackground?: boolean;
    hasClikedOnlyGroupCanSeeVideo?: boolean;
    hasSwitchedOnScreenShare?: boolean;
    hasClikedOnlyGroupCanSeeScreenShare?: boolean;
    hasRaisedHand?: boolean;
    hasThumbsUp?: boolean;
    hasThumbsDown?: boolean;
    hasClaped?: boolean;
    hasSwitchedOnAnnouncement?: boolean;
    hasStartedCc?: boolean;
    hasRequestedTranscript?: boolean;
    hasRequestedSummary?: boolean;
    hasGeneratedActionItems?: boolean;
    hasStartedRecording?: boolean;
    hasSwitchedOnMuteAll?: boolean;
    hasSwitchedOnDisabledAllVideos?: boolean;
    hasSwitchedOnLobbyStatus?: boolean;
    hasSwitchedOnGroupStatus?: boolean;
    hasSwitchedOnGroupLockStatus?: boolean;
    hasSwitchedOnPrivateVideoShareStaus?: boolean;
    hasSwitchedOnPrivateScreenShareStatus?: boolean;
    hasGotMike?: boolean;
    isPresenter?: boolean;
    isTriviaHost?: boolean;
    isStagePeer?: boolean;
    isBanFromPublicChat?: boolean;
    isKickedout?: boolean;
    usedShowOnlyMyGroupVideo?: boolean;
    hasSwitchedListenAll?: boolean;
    hasSwithcedHostOnlyListen?: boolean;
    isMainHost?: boolean;
    hasExportedAttendanceList?: boolean;
    admitedPeers?: Array<{
        peerId: string;
        peerName: string;
        date: Date;
    }>;
    rejectedPeers?: Array<{
        peerId: string;
        peerName: string;
        date: Date;
    }>;
    kickedOut?: Array<{
        peerId: string;
        peerName: string;
        date: Date;
    }>;
    switchMadeHost?: Array<{
        peerId: string;
        peerName: string;
        date: Date;
        staus: boolean;
    }>;
    switchBanFromPublicChat?: Array<{
        peerId: string;
        peerName: string;
        date: Date;
        status: boolean;
    }>;
    inviteToGroup?: Array<{
        peerId: string;
        peerName: string;
        groupName: string;
        groupId: string;
        date: Date;
    }>;
    joinToGroup?: Array<{
        groupName: string;
        groupId: string;
        date: Date;
    }>;
    madeGroupAnonymous?: Array<{
        groupName: string;
        groupId: string;
        date: Date;
        status: boolean;
    }>;
    passedMike?: Array<{
        peerId: string;
        peerName: string;
        date: Date;
        status: boolean;
    }>;
    inviteOnstage?: Array<{
        peerId: string;
        peerName: string;
        date: Date;
        status: boolean;
    }>;
    createdGroups?: Array<{
        groupName: string;
        groupId: string;
        date: Date;
    }>;
    groupLocked?: Array<{
        groupName: string;
        groupId: string;
        date: Date;
        status: boolean;
    }>;
    groupChat?: Array<{
        groupName: string;
        groupId: string;
        date: Date;
        type: "text" | "gif" | "file" |"emoji"; 
        fileCount?:number
    }>;
    publicChat?: Array<{
        date: Date;
        type: "text" | "gif" | "file" |"emoji"; 
        fileCount?:number
    }>;
  
}

const PeersSchema = new Schema<IPeers>({
    eventId: {
        type: String,
        required: true,
    },
    peerId: {
        type: String,
        required: true,
    },
    peerName: {
        type: String,
        required: true,
        trim: true,
    },
    useId: {
        type: String,
        required: false,
        default: null,
    },
    userEmail: {
        type: String,
        required: false,
        default: null,
    },
    eventJoinDatetime: {
        type: Date,
        required: true,
    },
    eventLeftDatetime: {
        type: Date,
        required: false,
        default: null,
    },
    eventType: {
        type: String,
        required: false,
    },
    isHost: {
        type: Boolean,
        default: false,
    },
    ipAddress: {
        type: String,
        required: true,
    },
    userAgent: {
        type: String,
        required: false,
    },
    city: {
        type: String,
        required: false,
        default: null,
    },
    state: {
        type: String,
        required: false,
        default: null,
    },
    country: {
        type: String,
        required: false,
        default: null,
    },
    latitude: {
        type: Number,
        required: false,
        default: null,
    },
    longitude: {
        type: Number,
        required: false,
        default: null,
    },
    postalCode: {
        type: String,
        required: false,
        default: null,
    },
    isp: {
        type: String,
        required: false,
        default: null,
    },
    hasCopiedInvationLink: {
        type: Boolean,
        default: false,
    },
    hasClickedBirdsEyeView: {
        type: Boolean,
        default: false,
    },
    hasClickedlMyGroupView: {
        type: Boolean,
        default: false,
    },
    hasClickedEchoDetection: {
        type: Boolean,
        default: false,
    },
    hasClickedWhiteBoard: {
        type: Boolean,
        default: false,
    },
    hasClickedAnnotationBoard: {
        type: Boolean,
        default: false,
    },
    hasCreatedPoll: {
        type: Boolean,
        default: false,
    },
    hasSwitchedOnMike: {
        type: Boolean,
        default: false,
    },
    hasSwitchedOnCamera: {
        type: Boolean,
        default: false,
    },
    hasSelectedVirtualBackground: {
        type: Boolean,
        default: false,
    },
    hasClikedOnlyGroupCanSeeVideo: {
        type: Boolean,
        default: false,
    },
    hasSwitchedOnScreenShare: {
        type: Boolean,
        default: false,
    },
    hasClikedOnlyGroupCanSeeScreenShare: {
        type: Boolean,
        default: false,
    },
    hasRaisedHand: {
        type: Boolean,
        default: false,
    },
    hasThumbsUp: {
        type: Boolean,
        default: false,
    },
    hasThumbsDown: {
        type: Boolean,
        default: false,
    },
    hasClaped: {
        type: Boolean,
        default: false,
    },
    hasSwitchedOnAnnouncement: {
        type: Boolean,
        default: false,
    },
    hasStartedCc: {
        type: Boolean,
        default: false,
    },
    hasRequestedTranscript: {
        type: Boolean,
        default: false,
    },
    hasRequestedSummary: {
        type: Boolean,
        default: false,
    },
    hasGeneratedActionItems: {
        type: Boolean,
        default: false,
    },
    hasStartedRecording: {
        type: Boolean,
        default: false,
    },
    hasSwitchedOnMuteAll: {
        type: Boolean,
        default: false,
    },
    hasSwitchedOnDisabledAllVideos: {
        type: Boolean,
        default: false,
    },
    hasSwitchedOnLobbyStatus: {
        type: Boolean,
        default: false,
    },
    hasSwitchedOnGroupStatus: {
        type: Boolean,
        default: false,
    },
    hasSwitchedOnGroupLockStatus: {
        type: Boolean,
        default: false,
    },
    hasSwitchedOnPrivateVideoShareStaus: {
        type: Boolean,
        default: false,
    },
    hasSwitchedOnPrivateScreenShareStatus: {
        type: Boolean,
        default: false,
    },
    hasGotMike: {
        type: Boolean,
        default: false,
    },
    isPresenter: {
        type: Boolean,
        default: false,
    },
    isTriviaHost: {
        type: Boolean,
        default: false,
    },
    isStagePeer: {
        type: Boolean,
        default: false,
    },
    isBanFromPublicChat: {
        type: Boolean,
        default: false,
    },
    isKickedout: {
        type: Boolean,
        default: false,
    },
    usedShowOnlyMyGroupVideo: {
        type: Boolean,
        required: false,
    },
    hasSwitchedListenAll: {
        type: Boolean,
        default: false,
    },
    hasSwithcedHostOnlyListen: {
        type: Boolean,
        default: false,
    },
    isMainHost: {
        type: Boolean,
        default: false,
    },
    hasExportedAttendanceList: {
        type: Boolean,
        default: false,
    },
    admitedPeers: {
        type: [
            { 
                peerId: {
                    type: String,
                    required: true,
                },
                peerName: {
                    type: String,
                    required: true,
                },
                date: { 
                    type: Date, default: new Date()
                } 
            },
        ],
        default: [],
    },
    rejectedPeers: {
        type: [
            { 
                peerId: {
                    type: String,
                    required: true,
                },
                peerName: {
                    type: String,
                    required: true,
                },
                date: { 
                    type: Date, 
                    default: new Date() 
                } 
            },
        ],
        default: [],
    },
    kickedOut: {
        type: [
            { 
                peerId: {
                    type: String,
                    required: true,
                },
                peerName: {
                    type: String,
                    required: true,
                }, 
                date: { type: Date, default: new Date() } 
            },
        ],
        default: [],
    },
    switchMadeHost: {
        type: [
            { 
                peerId: {
                    type: String,
                    required: true,
                },
                peerName: {
                    type: String,
                    required: true,
                },
                date: { type: Date, default: new Date() }, 
                staus: Boolean 
            },
        ],
        default: [],
    },
    switchBanFromPublicChat: {
        type: [
            { 
                peerId: {
                    type: String,
                    required: true,
                },
                peerName: {
                    type: String,
                    required: true,
                },
                date: { type: Date, default: new Date() }, 
                status: Boolean 
            },
        ],
        default: [],
    },
    inviteToGroup: {
        type: [
            {
                peerId: {
                    type: String,
                    required: true,
                },
                peerName: {
                    type: String,
                    required: true,
                },
                groupName: {
                    type: String,
                    required: true,
                },
                groupId: String,
                date: { 
                    type: Date, 
                    default: new Date() 
                },
            },
        ],
        default: [],
    },
    joinToGroup: {
        type: [
            { 
                groupName: {
                    type: String,
                    required: true,
                }, 
                groupId: {
                    type: String,
                    required: true,
                },
                date: { 
                    type: Date, 
                    default: new Date() 
                } 
            },
        ],
        default: [],
    },
    madeGroupAnonymous: {
        type: [
            { 
                groupName: {
                    type: String,
                    required: true,
                }, 
                groupId: {
                    type: String,
                    required: true,
                },
                date: { type: Date, default: new Date() }, 
                status: Boolean 
            },
        ],
        default: [],
    },
    passedMike: {
        type: [
            { 
                peerId: {
                    type: String,
                    required: true,
                },
                peerName: {
                    type: String,
                    required: true,
                },
                date: { type: Date, default: new Date() }, 
                status: Boolean 
            },
        ],
        default: [],
    },
    inviteOnstage: {
        type: [
            { 
                peerId: {
                    type: String,
                    required: true,
                },
                peerName: {
                    type: String,
                    required: true,
                },
                date: { type: Date, default: new Date() }, 
                status: Boolean 
            },
        ],
        default: [],
    },
    createdGroups: {
        type: [
            { 
                groupName: {
                    type: String,
                    required: true,
                }, 
                groupId: {
                    type: String,
                    required: true,
                },
                date: { 
                    type: Date, 
                    default: new Date() 
                } 
            },
        ],
        default: [],
    },
    groupLocked: {
        type: [
            { 
                groupName: {
                    type: String,
                    required: true,
                }, 
                groupId: {
                    type: String,
                    required: true,
                },
                date: { 
                    type: Date, 
                    default: new Date() 
                },
                status: Boolean  
            },
        ],
        default: [],
    }, 
    groupChat: {
        type: [
            {
                groupName: {
                    type: String,
                    required: true,
                },
                groupId: {
                    type: String,
                    required: true,
                },
                date: {
                    type: Date,
                    default: Date.now,
                },
                type: {
                    type: String,
                    enum: ["text", "gif", "file", "emoji"],
                    required: true,
                },
                fileCount: {
                    type: Number,
                    required: false,
                },
            },
        ],
        default: [],
    },
    publicChat: {
        type: [
            {
                date: {
                    type: Date,
                    default: Date.now,
                },
                type: {
                    type: String,
                    enum: ["text", "gif", "file", "emoji"],
                    required: true,
                },
                fileCount: {
                    type: Number,
                    required: false,
                },
            },
        ],
        default: [],
    },
        
});


PeersSchema.virtual('duration').get(function () {
    if (this.eventJoinDatetime && this.eventLeftDatetime) {
        const durationMs =
            new Date(this.eventLeftDatetime).getTime() - new Date(this.eventJoinDatetime).getTime();
        const minutes = Math.floor((durationMs / (1000 * 60)) % 60);
        const hours = Math.floor((durationMs / (1000 * 60 * 60)) % 24);
        return `${hours}h ${minutes}m`;
    }
    return null; // Return null if duration cannot be calculated
});

PeersSchema.set('toJSON', { virtuals: true });
PeersSchema.set('toObject', { virtuals: true });

const PeerLog = model<IPeers>('PeerLogs', PeersSchema);



export {PeerLog};




// export interface IPeers extends Document {
//     eventId?: string;
    
//     // Peer info
//     peerId: string;
//     peerName: string;

//     // User info
//     useId?: string;
//     userEmail?: string;
    
//     // Event info
//     eventJoinDatetime?: Date;
//     eventLeftDatetime?: Date;
//     eventType?: string;

//     // Peer roles
//     isHost?: boolean;

//     // IP / req header info
//     ipAddress?: string;
//     userAgent?: string;
//     duration?: string;
//     city?: string;
//     state?: string;
//     country?: string;
//     latitude?: number;
//     longitude?: number;
//     postalCode?: string;
//     isp?: string;

//     // Link related
//     hasCopiedInvationLink?: boolean;

//     // Zoom in/Zoom out group view
//     hasClickedBirdsEyeView?: boolean;
//     hasClickedlMyGroupView?: boolean;

//     // Audio improvement
//     hasClickedEchoDetection?: boolean;

//     // Board
//     hasClickedWhiteBoard?: boolean;
//     hasClickedAnnotationBoard?: boolean;

//     // Polls and announcements
//     hasCreatedPoll?: boolean;

//     // Audio related
//     hasSwitchedOnMike?: boolean;

//     // Video related
//     hasSwitchedOnCamera?: boolean;
//     hasSelectedVirtualBackground?: boolean;
//     hasClikedOnlyGroupCanSeeVideo?: boolean;

//     // Screenshare related
//     hasSwitchedOnScreenShare?: boolean;
//     hasClikedOnlyGroupCanSeeScreenShare?: boolean;

//     // Peer reactions
//     hasRaisedHand?: boolean;
//     hasThumbsUp?: boolean;
//     hasThumbsDown?: boolean;
//     hasClaped?: boolean;

//     // Announcement related
//     hasSwitchedOnAnnouncement?: boolean;

//     // CC items
//     hasStartedCc?: boolean;
//     hasRequestedTranscript?: boolean;
//     hasRequestedSummary?: boolean;
//     hasGeneratedActionItems?: boolean;

//     // Recording
//     hasStartedRecording?: boolean;

//     // Host related
//     hasSwitchedOnMuteAll?: boolean;
//     hasSwitchedOnDisabledAllVideos?: boolean;
//     hasSwitchedOnLobbyStatus?: boolean;
//     hasSwitchedOnGroupStatus?: boolean;
//     hasSwitchedOnGroupLockStatus?: boolean;
//     hasSwitchedOnPrivateVideoShareStaus?: boolean;
//     hasSwitchedOnPrivateScreenShareStatus?: boolean;


//     // Host related info
//     hasGotMike?: boolean;

//     // Meet roles
//     isPresenter?: boolean;
//     isTriviaHost?: boolean;
//     isStagePeer?: boolean;
//     isBanFromPublicChat?: boolean;
//     isKickedout?: boolean;

    
//     //settings
//     usdShowOnlyMyGroupVideo:boolean;


    
// }

// // Define the Mongoose schema
// const PeersSchema: Schema = new Schema(
//     {
//         eventId: { type: String, trim: true },
//         peerId: { type: String, required: true, trim: true },
//         peerName: { type: String, required: true, trim: true },
//         useId: { type: String, trim: true },
//         userEmail: { type: String, trim: true, match: [/.+@.+\..+/, 'Invalid email format'] },
//         eventJoinDatetime: { type: Date },
//         eventLeftDatetime: { type: Date },
//         eventType: { type: String, trim: true },
//         isHost: { type: Boolean, default: true },
//         ipAddress: { type: String, trim: true },
//         userAgent: { type: String, trim: true },
//         duration: { type: String, trim: true },
//         city: { type: String, trim: true },
//         state: { type: String, trim: true },
//         country: { type: String, trim: true },
//         latitude: { type: Number, min: [-90, 'Invalid latitude'], max: [90, 'Invalid latitude'] },
//         longitude: { type: Number, min: [-180, 'Invalid longitude'], max: [180, 'Invalid longitude'] },
//         postalCode: { type: String, trim: true },
//         isp: { type: String, trim: true },
//         hasCopiedInvationLink: { type: Boolean, default: true },
//         hasClickedBirdsEyeView: { type: Boolean, default: true },
//         hasClickedlMyGroupView: { type: Boolean, default: true },
//         hasClickedEchoDetection: { type: Boolean, default: true },
//         hasClickedWhiteBoard: { type: Boolean, default: true },
//         hasClickedAnnotationBoard: { type: Boolean, default: true },
//         hasCreatedPoll: { type: Boolean, default: true },
//         hasSwitchedOnMike: { type: Boolean, default: true },
//         hasSwitchedOnCamera: { type: Boolean, default: true },
//         hasSelectedVirtualBackground: { type: Boolean, default: true },
//         hasClikedOnlyGroupCanSeeVideo: { type: Boolean, default: true },
//         hasSwitchedOnScreenShare: { type: Boolean, default: true },
//         hasClikedOnlyGroupCanSeeScreenShare: { type: Boolean, default: true },
//         hasRaisedHand: { type: Boolean, default: true },
//         hasThumbsUp: { type: Boolean, default: true },
//         hasThumbsDown: { type: Boolean, default: true },
//         hasClaped: { type: Boolean, default: true },
//         hasSwitchedOnAnnouncement: { type: Boolean, default: true },
//         hasStartedCc: { type: Boolean, default: true },
//         hasRequestedTranscript: { type: Boolean, default: true },
//         hasRequestedSummary: { type: Boolean, default: true },
//         hasGeneratedActionItems: { type: Boolean, default: true },
//         hasStartedRecording: { type: Boolean, default: true },
//         hasSwitchedOnMuteAll: { type: Boolean, default: true },
//         hasSwitchedOnDisabledAllVideos: { type: Boolean, default: true },
//         hasSwitchedOnLobbyStatus: { type: Boolean, default: true },
//         hasSwitchedOnGroupStatus: { type: Boolean, default: true },
//         hasSwitchedOnGroupLockStatus: { type: Boolean, default: true },
//         hasSwitchedOnPrivateVideoShareStaus: { type: Boolean, default: true },
//         hasSwitchedOnPrivateScreenShareStatus: { type: Boolean, default: true },
//         hasGotMike: { type: Boolean, default: true },
//         isPresenter: { type: Boolean, default: true },
//         isTriviaHost: { type: Boolean, default: true },
//         isStagePeer: { type: Boolean, default: true },
//         isBanFromPublicChat: { type: Boolean, default: true },
//         isKickedout: { type: Boolean, default: true },
//     },
//     { timestamps: true } 
// );

// const Peers = mongoose.model<IPeers>('Peers', PeersSchema);
// export default Peers;




// hasSwitchedListenAll?: boolean;
// hasSwithcedHostOnlyListen?: boolean;    






// export interface IPeers extends Document {
//     eventId?: string;
    
//     //peer info
//     peerId: string;
//     peerName: string;

//     //user info
//     useId?: string;
//     userEmail?: string;
    
//     //even info
//     eventJoinDatetime?: Date;
//     eventLeftDatetime?: Date;
//     eventType?: string;

//     //peer roles
//     isHost?: boolean;
    

//     //ip / req header info
//     ipAddress?: string;
//     userAgent?: string;
//     duration?: string;
//     city?: string;
//     state?: string;
//     country?: string;
//     latitude?: number;
//     longitude?: number;
//     postalCode?: string;
//     isp?: string;
    
    

//     //link realated
//     hasCopiedInvationLink?: boolean;

//     // Zoom in/Zoom out group view
//     hasClickedBirdsEyeView?: boolean;
//     hasClickedlMyGroupView?: boolean;
   
//     //audio imrovement
//     hasClickedEchoDetection?: boolean;

//     //board
//     hasClickedWhiteBoard?: boolean;
//     hasClickedAnnotationBoard?: boolean;

//     // Polls and announcements
// //    hasClickedPoll:boolean;
//     hasCreatedPoll:boolean;
    

//     //audio realted
//     hasSwitchedOnMike?: boolean;

//     //video realted
//     hasSwitchedOnCamera?: boolean;
//     hasSelectedVirtualBackground?: boolean;
//     hasClikedOnlyGroupCanSeeVideo?: boolean;

//     //screeshare realted
//     hasSwitchedOnScreenShare?: boolean;
//     hasClikedOnlyGroupCanSeeScreenShare?: boolean;
 

//     //peer reactions
//     hasRaisedHand?: boolean;  
//     hasThumbsUp?: boolean;     
//     hasThumbsDown?: boolean;  
//     hasClaped?: boolean;   
    

//     // annoucement realted
//     hasSwitchedOnAnnouncement?: boolean;
    
//     //cc items
//     hasStartedCc?: boolean;
//     hasRequestedTranscript?: boolean;
//     hasRequestedSummary?: boolean;
//     hasGeneratedActionItems?: boolean;

//     //recording
//     hasStartedRecording?: boolean;
    
    

//     //host realted
//     hasSwitchedOnMuteAll?: boolean;
//     hasSwitchedOnDisabledAllVideos?: boolean;
//     hasSwitchedOnAnnouncement?: boolean;
//     hasSwitchedOnLobbyStatus?:boolean;
//     hasSwitchedOnGroupStatus?:boolean;
//     hasSwitchedOnGroupLockStatus?:boolean;
//     hasSwitchedOnPrivateVideoShareStaus?:boolean;
//     hasSwitchedOnPrivateScreenShareStatus:boolean;

   
//     // host realated info
//     hasGotMike?: boolean;


//     //meet role
//     isPresenter?: boolean;
//     isTriviaHost?: boolean;
//     isStagePeer?: boolean;
//     isBanFromPublicChat?: boolean;
//     isKickedout?: boolean;

// }



//     //boolean
// //recording clicks
// //cc cliks
// //camera cliks
// //screen present cliks
// //passMike


// //totalTranscriptRequests;
// //totalSummaryRequests?:;
// //totalActionItemsGenerated?:;

// //
// //isPresenter -> webinar
// //isTrivia -> trivia
// //isStagePeer->confernce
// //isBanFromPublicChat



// const Host = {
//     peerId: String,
//     userId: String,
//     isMainHost:boolean,
//     isHost: boolean,

//     kikedOut:[
//         {peerId.
//         date:

//         }
//     ],
//     madeHost: [
//         {
//             peerId: String,
//         }
//     ]

// }





