import { IPeers } from "../Model/PeerModel";
interface EventInstanceInfo {
    totalAttendance: number;
    totalHost: number;
    totalKickout: number;
    totalRaisedHand: number;
    totalThumbsup: number;
    totalThumbsdown: number;
    totalClaps: number;
    totalEchoInstances: number;
    totalRecordingClicks: number;
    totalCCClicks: number;
    totalTranscriptRequests: number;
    totalSummaryRequests: number;
    totalActionItemsGenerated: number;
    totalBirdsEyeViewClick: number;
    totalMyGroupViewClicked: number;
    totalScreenShares: number;
    totalCameraTurnOn: number;
    totalMicTurnOn: number;
    totalGroupsCreated: number;
    totalLocksGroup: number;
    totalUnlocksGroup: number;
    totalEventLinksCopied: number;
    totalMuteAllClickedSwitched: number;
    totalDisabledAllVideoSwitch: number;
    totalDisabledAllScrennShareSwitch: number;
    totalLobbyStatusSwitch: number;
    totalGroupAllowStatusSwitch: number;
    totalGrouplockStatusSwitch: number;
    totalPrivateVideoShareSwitch: number;
    totalPrivateScreenShareSwitch: number;
    totalWhiteBoardClicked: number;
    totalAnnotationBoardClicked: number;
    totalPollCreated: number;
    totalAnnouncementModeClicked: number;
}



const calculateEventInstanceInfo = (peers: IPeers[]): EventInstanceInfo => {
    const eventInstanceInfo: EventInstanceInfo = {
        totalAttendance: peers.length,
        totalHost: 0,
        totalKickout: 0,
        totalRaisedHand: 0,
        totalThumbsup: 0,
        totalThumbsdown: 0,
        totalClaps: 0,
        totalEchoInstances: 0,
        totalRecordingClicks: 0,
        totalCCClicks: 0,
        totalTranscriptRequests: 0,
        totalSummaryRequests: 0,
        totalActionItemsGenerated: 0,
        totalBirdsEyeViewClick: 0,
        totalMyGroupViewClicked: 0,
        totalScreenShares: 0,
        totalCameraTurnOn: 0,
        totalMicTurnOn: 0,
        totalGroupsCreated: 0,
        totalLocksGroup: 0,
        totalUnlocksGroup: 0,
        totalEventLinksCopied: 0,
        totalMuteAllClickedSwitched: 0,
        totalDisabledAllVideoSwitch: 0,
        totalDisabledAllScrennShareSwitch: 0,
        totalLobbyStatusSwitch: 0,
        totalGroupAllowStatusSwitch: 0,
        totalGrouplockStatusSwitch: 0,
        totalPrivateVideoShareSwitch: 0,
        totalPrivateScreenShareSwitch: 0,
        totalWhiteBoardClicked: 0,
        totalAnnotationBoardClicked: 0,
        totalPollCreated: 0,
        totalAnnouncementModeClicked: 0
    };

    peers.forEach((peer) => {
        if (peer.isHost) eventInstanceInfo.totalHost++;
        if (peer.isKickedout) eventInstanceInfo.totalKickout++;
        if (peer.hasRaisedHand) eventInstanceInfo.totalRaisedHand++;
        if (peer.hasThumbsUp) eventInstanceInfo.totalThumbsup++;
        if (peer.hasThumbsDown) eventInstanceInfo.totalThumbsdown++;
        if (peer.hasClaped) eventInstanceInfo.totalClaps++;
        if (peer.hasClickedEchoDetection) eventInstanceInfo.totalEchoInstances++;
        if (peer.hasStartedRecording) eventInstanceInfo.totalRecordingClicks++;
        if (peer.hasStartedCc) eventInstanceInfo.totalCCClicks++;
        if (peer.hasRequestedTranscript) eventInstanceInfo.totalTranscriptRequests++;
        if (peer.hasRequestedSummary) eventInstanceInfo.totalSummaryRequests++;
        if (peer.hasGeneratedActionItems) eventInstanceInfo.totalActionItemsGenerated++;
        if (peer.hasClickedBirdsEyeView) eventInstanceInfo.totalBirdsEyeViewClick++;
        if (peer.hasClickedlMyGroupView) eventInstanceInfo.totalMyGroupViewClicked++;
        if (peer.hasSwitchedOnScreenShare) eventInstanceInfo.totalScreenShares++;
        if (peer.hasSwitchedOnCamera) eventInstanceInfo.totalCameraTurnOn++;
        if (peer.hasSwitchedOnMike) eventInstanceInfo.totalMicTurnOn++;
        if (peer.createdGroups?.length) eventInstanceInfo.totalGroupsCreated += peer.createdGroups.length;
        if (peer.groupLocked?.length) eventInstanceInfo.totalLocksGroup += peer.groupLocked.filter(group => group.status).length;
        if (peer.hasCopiedInvationLink) eventInstanceInfo.totalEventLinksCopied++;
        if (peer.hasSwitchedOnMuteAll) eventInstanceInfo.totalMuteAllClickedSwitched++;
        if (peer.hasSwitchedOnDisabledAllVideos) eventInstanceInfo.totalDisabledAllVideoSwitch++;
        if (peer.hasSwitchedOnLobbyStatus) eventInstanceInfo.totalLobbyStatusSwitch++;
        if (peer.hasSwitchedOnGroupStatus) eventInstanceInfo.totalGroupAllowStatusSwitch++;
        if (peer.hasSwitchedOnGroupLockStatus) eventInstanceInfo.totalGrouplockStatusSwitch++;
        if (peer.hasSwitchedOnPrivateVideoShareStaus) eventInstanceInfo.totalPrivateVideoShareSwitch++;
        if (peer.hasSwitchedOnPrivateScreenShareStatus) eventInstanceInfo.totalPrivateScreenShareSwitch++;
        if (peer.hasClickedWhiteBoard) eventInstanceInfo.totalWhiteBoardClicked++;
        if (peer.hasClickedAnnotationBoard) eventInstanceInfo.totalAnnotationBoardClicked++;
        if (peer.hasCreatedPoll) eventInstanceInfo.totalPollCreated++;
        if (peer.hasSwitchedOnAnnouncement) eventInstanceInfo.totalAnnouncementModeClicked++;
    });

    return eventInstanceInfo;
};


export { calculateEventInstanceInfo };