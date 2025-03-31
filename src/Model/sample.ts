// two models

//1. Event
//2. Event History Or (Any Name)

//1.Event
export interface IEventLog extends Document {

  eventId: number; // unique which is actually uniquely identify event in our main db
  eventName: string;
  eventNumber: string; // in gui it's name is eventId
  eventType: string; // watch party ,istant meeting any thing (type of data passed in frontend)
  eventDate: Date; //
  eventStartTime: Date;
  eventEndTime?: Date;
}


//2. Event history
interface IEventHistory {
    
    eventLogId?: Types.ObjectId; // ID of the event log
    actualStartTime: Date;
    actualEndTime?: Date;
    eventId: number;

    
    totalAttendees?: number;
    totalHost?: number;
    totalKickout?: number;

    //reactions
    totalRaisedHand?: number;
    //totalWaveHand?: number;
    totalThumbsup?: number;
    totalThumbsdown?: number;
    totalClaps?: number;
    
    
    totalEchoInstances?: number;
    totalRecordingClicks?: number;

    //cc items
    totalCCClicks?: number;
    totalTranscriptRequests?: number;
    totalSummaryRequests?: number;
    totalActionItemsGenerated?: number;

    //zoom in zoom out group view
    totalBirdsEyeViewClick?: number;
    totalMyGroupViewClicked?: number;

    // audio video controls
    totalScreenShares?: number;
    totalCameraTurnOn?: number;
    //totalCameraTurnOff?: number;
    totalMicTurnOn?: number;
    //totalMicTurnOff?: number;


    //group related
    totalGroupsCreated?: number;
    totalLocksGroup?: number;
    totalUnlocksGroup?: number;

    totalEventLinksCopied?: number;



    totalMuteAllClickedSwitched?:number;
    totalDisabledAllVideoSwitch?:number;
    totalDisabledAllScrennShareSwitch?:number;
    totalLobbyStatusSwitch?: number; 
    totalGroupAllowStatusSwitch?: number; 
    totalGrouplockStatusSwitch?: number; 
    totalPrivateVideoShareSwitch?: number;
    totalPrivateScreenShareSwitch?: number;

    totalWhiteBoardClicked?:number;
    totalAnnotationBoardClicked:?number
    
    // how many poll in one event
    totalPollCreated?:number
    totalAnnouncementModeClicked?:number;

}

// //clap
// //echo
// //cc
// //recording clicked -> trascript ,summry,actionitems
// //birds eye view
// //my group view
// //share screen
// //camera turn on
// //mike turn on - true - false
// //send ->public
// //send ->private
// //send ->group
// //send ->file
// //send ->gif
// //creategroup no
// //lock
// //unlock
// //copied even link




// message model
totalPublicMessages?: number;
totalPrivateMessages?: number;
totalGroupMessages?: number;

totalFilesShared?: number;
totalGifsShared?: number;


    //antoher noticed by me
    totalNotifications?:number;
    totalNotificationClicked:number;


totalAnnouncementModeSwitch?:number;


export interface IPeers extends Document {
    eventId?: string;
    
    //peer info
    peerId: string;
    peerName: string;

    //user info
    useId?: string;
    userEmail?: string;
    
    //even info
    eventJoinDatetime?: Date;
    eventLeftDatetime?: Date;
    eventType?: string;

    //peer roles
    isHost?: boolean;
    

    //ip / req header info
    ipAddress?: string;
    userAgent?: string;
    duration?: string;
    city?: string;
    state?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
    postalCode?: string;
    isp?: string;
    
    

    //link realated
    hasCopiedInvationLink?: boolean;

    // Zoom in/Zoom out group view
    hasClickedBirdsEyeView?: boolean;
    hasClickedlMyGroupView?: boolean;
   
    //audio imrovement
    hasClickedEchoDetection?: boolean;

    //board
    hasClickedWhiteBoard?: boolean;
    hasClickedAnnotationBoard?: boolean;

    // Polls and announcements
    hasClickedPoll:boolean;
    hasCreatedPoll:boolean;
    

    //audio realted
    hasClickedMike?: boolean;
    hasClickdMikeOptions?: boolean;
    hasClickedAudioVideoSettings?: boolean;

    //video realted
    hasClickedCamera?: boolean;
    hasClikedCameraOptions?: boolean;
    hasSelectedVirtualBackground?: boolean;
    hasClikedOnlyGroupCanSeeVideo?: boolean;

    //screeshare realted
    hasClickedScreenShare?: boolean;
    hasClikedOnlyGroupCanSeeScreenShare?: boolean;
    hasClikedScreenShareOptions?: boolean;
    hasClickedKaraokeSettings?: boolean;


    //peer reactions
    hasRaisedHand?: boolean;  
    hasThumbsUp?: boolean;     
    hasThumbsDown?: boolean;  
    hasClaped?: boolean;   
    
    //message realted optinal
    // hasClickedMessage?: boolean;
    // hasClikedPublicChat?: boolean;
    // hasClikedPrivateChat?: boolean;


    // annoucement realted
    hasClikedAnnouncement?: boolean;
    
    //cc items
    hasClickedCc?: boolean;
    hasRequestedTranscript?: boolean;
    hasRequestedSummary?: boolean;
    hasGeneratedActionItems?: boolean;

    //recording
    hasClickedRecording?: boolean;
    
    
    
    // Group related
    hasClikedCreateGroup?: boolean;
    hasClikedJoinGroup?: boolean;

    //host realted
    hasClickedMuteAllSwitch?: boolean;
    hasClikedDisabledAllVideosSwitch?: boolean;
    hasClickedAnnouncementSwitch?: boolean;
    haslClikedLobbyStatusSwitch?:boolean;
    hasClickedGroupStatusSwitch?:boolean;
    hasClickedGroupLockStatusSwitch?:boolean;
    hasClickedPrivateVideoShareStausSwitch?:boolean;
    hasClikedPrivateScreenShareStatusSwitch:boolean;

   
    // host realated info
    hasPassedMike?: boolean;
    hasKickedOut?: boolean;

    //meet role
    isPresenter?: boolean;
    isTriviaHost?: boolean;
    isStagePeer?: boolean;
    isBanFromPublicChat?: boolean;
    recordingClick: boolean;
    isKickedout?: boolean;

}


const Host = {
    peerId: String,
    userId: String,
    isMainHost:boolean,
    isHost: boolean,

    kikedOut:[
        {peerId.
        date:

        }
    ],
    madeHost: [
        {
            peerId: String,
        }
    ]

}

export interface IPeers2 extends Document {
  
  isMainHost: boolean;
  
  isHost: boolean;

  hasExportedAttendanceList: boolean;

  admitedPeers: Array<{
    peerId: string;
    peerName: string;
    date: Date;
  }>;

  rejectedPeers: Array<{
    peerId: string;
    peerName: string;
    date: Date;
  }>;

  kickedOut: Array<{
    peerId: string;
    peerName: string;
    date: Date;
  }>;
  
  switchMadeHost: Array<{
    peerId: string;
    peerName: string;
    date: Date;
    staus: boolean;
  }>;

  switchBanFromPublicChat: Array<{
    peerId: string;
    peerName: string;
    date: Date;
    status: boolean;
  }>;

  inviteToGroup: Array<{
    peerId: string;
    peerName: string;
    groupName: string;
    groupId:string;
    date: Date;
  }>;

  joinToGroup: Array<{
    groupName: string;
    groupId:string;
    date: Date;
  }>;

  madeGroupAnonymous:Array<{
    groupName: string;
    groupId:string;
    date: Date;
    status: boolean;
  }>

  passedMike: Array<{
    peerId: string;
    peerName: string;
    date: Date;
    status: boolean;
  }>;

  inviteOnstage:Array<{
    peerId: string;
    peerName: string;
    date: Date;
    status: boolean;
  }>;

  





  



  

  


}
