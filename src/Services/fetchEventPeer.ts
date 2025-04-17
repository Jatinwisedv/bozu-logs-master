// import EventLog from "../Model/EventLogsModel";
  
//   interface PeerLogStats {
//     totalAttendance: number;
//     totalHost: number;
//     totalKickout: number;
//     totalRaisedHand: number;
//     totalThumbsup: number;
//     totalThumbsdown: number;
//     totalClaps: number;
//     totalEchoInstances: number;
//     totalRecordingClicks: number;
//     totalCCClicks: number;
//     totalTranscriptRequests: number;
//     totalSummaryRequests: number;
//     totalActionItemsGenerated: number;
//     totalBirdsEyeViewClick: number;
//     totalMyGroupViewClicked: number;
//     totalScreenShares: number;
//     totalCameraTurnOn: number;
//     totalMicTurnOn: number;
//     totalGroupsCreated: number;
//     totalLocksGroup: number;
//     totalEventLinksCopied: number;
//     totalMuteAllClickedSwitched: number;
//     totalDisabledAllVideoSwitch: number;
//     totalLobbyStatusSwitch: number;
//     totalGroupAllowStatusSwitch: number;
//     totalGrouplockStatusSwitch: number;
//     totalPrivateVideoShareSwitch: number;
//     totalPrivateScreenShareSwitch: number;
//     totalWhiteBoardClicked: number;
//     totalAnnotationBoardClicked: number;
//     totalPollCreated: number;
//     totalAnnouncementModeClicked: number;
//   }
  
//   interface EnrichedEventLog extends typeof EventLog {
//     actualTimesWithPeers: {
//       actualTime: ActualTime;
//       eventInstanceInfo: PeerLogStats;
//     }[];
//   }
  
//   async function getPaginatedEventSortedLogsWithActualTimeAndPeers(
//     startIndex: number,
//     limit: number,
//     sortOrder: 'asc' | 'desc' = 'asc'
//   ): Promise<{ data: EnrichedEventLog[]; total: number }> {
//     const sortDirection = sortOrder === 'asc' ? 1 : -1;
  
//     try {
//       // Fetch total count for pagination metadata
//       const total = await EventLog.countDocuments({});
  
//       // Fetch paginated event logs
//       const eventLogs = await EventLog.find({})
//         .sort({ eventStartTime: sortDirection })
//         .skip(startIndex)
//         .limit(limit)
//         .lean();
  
//       // Enrich event logs with actual times and peer stats
//       const enrichedEventLogs = await Promise.all(
//         eventLogs.map(async (eventLog) => {
//           const actualTimes = await ActualTime.find({ eventId: eventLog.eventId }).lean();
  
//           const peersWithinTimeRange = await Promise.all(
//             actualTimes.map(async (actualTime) => {
//               const aggregationResult = await PeerLog.aggregate([
//                 {
//                   $match: {
//                     eventId: eventLog.eventId,
//                     eventJoinDatetime: { $gte: actualTime.actualStartTime },
//                     eventLeftDatetime: { $lte: actualTime.actualEndTime },
//                   },
//                 },
//                 {
//                   $group: {
//                     _id: null,
//                     totalAttendance: { $sum: 1 },
//                     totalHost: { $sum: { $cond: ['$isHost', 1, 0] } },
//                     totalKickout: { $sum: { $cond: ['$isKickedout', 1, 0] } },
//                     totalRaisedHand: { $sum: { $cond: ['$hasRaisedHand', 1, 0] } },
//                     totalThumbsup: { $sum: { $cond: ['$hasThumbsUp', 1, 0] } },
//                     totalThumbsdown: { $sum: { $cond: ['$hasThumbsDown', 1, 0] } },
//                     totalClaps: { $sum: { $cond: ['$hasClaped', 1, 0] } },
//                     totalEchoInstances: { $sum: { $cond: ['$hasClickedEchoDetection', 1, 0] } },
//                     totalRecordingClicks: { $sum: { $cond: ['$hasStartedRecording', 1, 0] } },
//                     totalCCClicks: { $sum: { $cond: ['$hasStartedCc', 1, 0] } },
//                     totalTranscriptRequests: { $sum: { $cond: ['$hasRequestedTranscript', 1, 0] } },
//                     totalSummaryRequests: { $sum: { $cond: ['$hasRequestedSummary', 1, 0] } },
//                     totalActionItemsGenerated: { $sum: { $cond: ['$hasGeneratedActionItems', 1, 0] } },
//                     totalBirdsEyeViewClick: { $sum: { $cond: ['$hasClickedBirdsEyeView', 1, 0] } },
//                     totalMyGroupViewClicked: { $sum: { $cond: ['$hasClickedlMyGroupView', 1, 0] } },
//                     totalScreenShares: { $sum: { $cond: ['$hasSwitchedOnScreenShare', 1, 0] } },
//                     totalCameraTurnOn: { $sum: { $cond: ['$hasSwitchedOnCamera', 1, 0] } },
//                     totalMicTurnOn: { $sum: { $cond: ['$hasSwitchedOnMike', 1, 0] } },
//                     totalGroupsCreated: { $sum: { $size: { $ifNull: ['$createdGroups', []] } } },
//                     totalLocksGroup: { $sum: { $size: { $ifNull: ['$groupLocked', []] } } },
//                     totalEventLinksCopied: { $sum: { $cond: ['$hasCopiedInvationLink', 1, 0] } },
//                     totalMuteAllClickedSwitched: { $sum: { $cond: ['$hasSwitchedOnMuteAll', 1, 0] } },
//                     totalDisabledAllVideoSwitch: { $sum: { $cond: ['$hasSwitchedOnDisabledAllVideos', 1, 0] } },
//                     totalLobbyStatusSwitch: { $sum: { $cond: ['$hasSwitchedOnLobbyStatus', 1, 0] } },
//                     totalGroupAllowStatusSwitch: { $sum: { $cond: ['$hasSwitchedOnGroupStatus', 1, 0] } },
//                     totalGrouplockStatusSwitch: { $sum: { $cond: ['$hasSwitchedOnGroupLockStatus', 1, 0] } },
//                     totalPrivateVideoShareSwitch: { $sum: { $cond: ['$hasSwitchedOnPrivateVideoShareStatus', 1, 0] } },
//                     totalPrivateScreenShareSwitch: { $sum: { $cond: ['$hasSwitchedOnPrivateScreenShareStatus', 1, 0] } },
//                     totalWhiteBoardClicked: { $sum: { $cond: ['$hasClickedWhiteBoard', 1, 0] } },
//                     totalAnnotationBoardClicked: { $sum: { $cond: ['$hasClickedAnnotationBoard', 1, 0] } },
//                     totalPollCreated: { $sum: { $cond: ['$hasCreatedPoll', 1, 0] } },
//                     totalAnnouncementModeClicked: { $sum: { $cond: ['$hasSwitchedOnAnnouncement', 1, 0] } },
//                   },
//                 },
//               ]);
  
//               const eventInstanceInfo = aggregationResult[0] || {};
//               return {
//                 actualTime,
//                 eventInstanceInfo,
//               };
//             })
//           );
  
//           return {
//             ...eventLog,
//             actualTimesWithPeers: peersWithinTimeRange,
//           };
//         })
//       );
  
//       return { data: enrichedEventLogs, total };
//     } catch (error) {
//       console.error('Error fetching paginated event logs:', error);
//       throw error;
//     }
//   }