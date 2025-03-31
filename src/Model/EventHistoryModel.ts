totalAttendees?: number;
totalHost?: number;
totalKickout?: number;
totalRaisedHand?: number;
totalWaveHand?: number;
totalThumbsup?: number;
totalThumbsdown?: number;
totalClaps?: number;

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