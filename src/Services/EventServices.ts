import EventLog, { IEventLog } from '../Model/EventLogsModel';
//import { IActualTime }   from '../Model/ActualTimeModal';
import ActualTime from '../Model/ActualTimeModal';
import { PeerLog } from '../Model/PeerModel';
import { IPeers } from '../Model/PeerModel';
import { calculateEventInstanceInfo } from '../Helper/filterPeersInfo';
import mongoose, { Types } from 'mongoose';
export class EventServices {



  // Create a new EventLog
  createEventLog(eventData: Partial<IEventLog>): Promise<IEventLog> {
    const eventLog = new EventLog(eventData);
    return eventLog.save();
  }

  // Get all EventLogs
  getAllEventLogs(): Promise<IEventLog[]> {
    return EventLog.find().exec();
  }

  // Get paginated EventLogs
  getPaginatedEventLogs(startIndex: number, limit: number): Promise<IEventLog[]> {
    return EventLog.find({}).skip(startIndex).limit(limit).exec();
  }

  // Get paginated and sorted EventLogs
  getPaginatedEventSortedLogs(startIndex: number, limit: number, sortOrder: 'asc' | 'desc' = 'asc'): Promise<IEventLog[]> {
    const sortDirection = sortOrder === 'asc' ? 1 : -1; // 1 for ascending, -1 for descending
    return EventLog.find({})
      .sort({ eventStartTime: sortDirection })
      .skip(startIndex)
      .limit(limit)
      .exec();
  }

  // Get a single EventLog by Event ID
  getEventLogByEvenetId(eventId: number): Promise<IEventLog | null> {
    return EventLog.findOne({ eventId }).exec();
  }

  // Update an EventLog by ID
  updateEventLogByEventId(eventId: number, updateData: Partial<IEventLog>): Promise<IEventLog | null> {
    return EventLog.findOneAndUpdate({ eventId }, updateData, { new: true }).exec();
  }

  // Delete an EventLog by ID
  deleteEventLog(eventId: number): Promise<IEventLog | null> {
    return EventLog.findOneAndDelete({ eventId }).exec();
  }

  // Get a single EventLog by _ID
  getEventLogById(_id: string): Promise<IEventLog | null> {
    return EventLog.findOne({ _id }).exec();
  }

  // Get total number of EventLogs
  getTotalEvents(): Promise<number> {
    return EventLog.countDocuments().exec();
  }


  // Update an EventLog by ID
  updateEventLogById(_id: string, updateData: Partial<IEventLog>): Promise<IEventLog | null> {
    return EventLog.findOneAndUpdate({ _id }, updateData, { new: true }).exec();
  }


  async getPaginatedEventSortedLogsWithActualTime(
    startIndex: number,
    limit: number,
    sortOrder: 'asc' | 'desc' = 'asc'
  ): Promise<any[]> { // Return type is `any[]`
    const sortDirection = sortOrder === 'asc' ? 1 : -1; // 1 for ascending, -1 for descending

    const eventLogs = await EventLog.find({})
      .sort({ eventStartTime: sortDirection })
      .skip(startIndex)
      .limit(limit)
      .lean(); // No need to specify type, use `lean()` as-is

    // Use `any` for the final merged result
    const enrichedEventLogs: any[] = await Promise.all(
      eventLogs.map(async (eventLog: any) => {
        const actualTime: any[] = await ActualTime.find({ eventId: eventLog.eventId }).lean().exec();
        return { ...eventLog, actualTime }; // Merge with actualTime
      })
    );

    return enrichedEventLogs;
  }


  async getPaginatedEventSortedLogsWithActualTimeAndPeers(
    startIndex: number,
    limit: number,
    sortOrder: 'asc' | 'desc' = 'asc',
    includePeer: boolean = false
  ): Promise<any[]> {
    const sortDirection = sortOrder === 'asc' ? 1 : -1;

    const eventLogs = await EventLog.find({})
      .sort({ eventStartTime: sortDirection })
      .skip(startIndex)
      .limit(limit)
      .lean();


    const enrichedEventLogs: any[] = await Promise.all(
      eventLogs.map(async (eventLog: any) => {

        const actualTimes = await ActualTime.find({ eventId: eventLog.eventId }).lean().exec();


        const peersWithinTimeRange = await Promise.all(
          actualTimes.map(async (actualTime: any) => {

            const peers = await PeerLog.find({
              eventId: String(eventLog.eventId),
              eventJoinDatetime: { $gte: actualTime.actualStartTime },
              eventLeftDatetime: { $lte: actualTime.actualEndTime },
            }).lean();

            const eventInstanceInfo = calculateEventInstanceInfo(peers)

            if (!includePeer) {
              return {
                actualTime,
                eventInstanceInfo,
              };
            }

            return {
              actualTime,
              eventInstanceInfo,
              peers
            };
          })
        );

        if (!includePeer) {
          return {
            ...eventLog,
            actualTimesWithEventInstance: peersWithinTimeRange,
          };
        }

        return {
          ...eventLog,
          actualTimesWithPeers: peersWithinTimeRange,

        };
      })
    );

    return enrichedEventLogs;
  }

  async searchEventLogsWithActualTimeAndPeers(
    searchField: string,
    searchText: string,
    includePeer: boolean = false,
  ): Promise<any[]> {

    console.log(searchField, searchText, includePeer)

    const queryFilter = {
      [searchField]: { $regex: searchText, $options: 'i' },  
    };

    const eventLogs = await EventLog.find(queryFilter).lean();


    const enrichedEventLogs: any[] = await Promise.all(
      eventLogs.map(async (eventLog: any) => {

        const actualTimes = await ActualTime.find({ eventId: eventLog.eventId }).lean().exec();


        const peersWithinTimeRange = await Promise.all(
          actualTimes.map(async (actualTime: any) => {

            const peers = await PeerLog.find({
              eventId: String(eventLog.eventId),
              eventJoinDatetime: { $gte: actualTime.actualStartTime },
              eventLeftDatetime: { $lte: actualTime.actualEndTime },
            }).lean();

            const eventInstanceInfo = calculateEventInstanceInfo(peers)

            if (!includePeer) {
              return {
                actualTime,
                eventInstanceInfo,
              };
            }

            return {
              actualTime,
              eventInstanceInfo,
              peers
            };
          })
        );

        if (!includePeer) {
          return {
            ...eventLog,
            actualTimesWithEventInstance: peersWithinTimeRange,
          };
        }

        return {
          ...eventLog,
          actualTimesWithPeers: peersWithinTimeRange,

        };
      })
    );

    return enrichedEventLogs;
  }

  async getEventByIdPeerEventInfo(
    eventId:number,
    includePeer: boolean = false,
  ): Promise<any[]> {


    const eventLogs = await EventLog.find({eventId}).lean();

    const enrichedEventLogs: any[] = await Promise.all(
      eventLogs.map(async (eventLog: any) => {

        const actualTimes = await ActualTime.find({ eventId: eventLog.eventId }).lean().exec();


        const peersWithinTimeRange = await Promise.all(
          actualTimes.map(async (actualTime: any) => {

            const peers = await PeerLog.find({
              eventId: String(eventLog.eventId),
              eventJoinDatetime: { $gte: actualTime.actualStartTime },
              eventLeftDatetime: { $lte: actualTime.actualEndTime },
            }).lean();

            const eventInstanceInfo = calculateEventInstanceInfo(peers)

            if (!includePeer) {
              return {
                actualTime,
                eventInstanceInfo,
              };
            }

            return {
              actualTime,
              eventInstanceInfo,
              peers
            };
          })
        );

        if (!includePeer) {
          return {
            ...eventLog,
            actualTimesWithEventInstance: peersWithinTimeRange,
          };
        }

        return {
          ...eventLog,
          actualTimesWithPeers: peersWithinTimeRange,

        };
      })
    );

    return enrichedEventLogs;
  }

}

export async function getPaginatedEventSortedLogsWithActualTimeAndPeersV2(
  startIndex: number,
  limit: number,
  sortOrder: 'asc' | 'desc' = 'asc'
): Promise<any[]> {
  const sortDirection = sortOrder === 'asc' ? 1 : -1;

  const eventLogs = await EventLog.find({})
    .sort({ eventStartTime: sortDirection })
    .skip(startIndex)
    .limit(limit)
    .lean();

  const enrichedEventLogs: any[] = await Promise.all(
    eventLogs.map(async (eventLog) => {
      const actualTimes = await ActualTime.find({ eventId: eventLog.eventId }).lean();

      const peersWithinTimeRange = await Promise.all(
        actualTimes.map(async (actualTime) => {
          const aggregationResult = await PeerLog.aggregate([
            {
              $match: {
                eventId: eventLog.eventId,
                eventJoinDatetime: { $gte: actualTime.actualStartTime },
                eventLeftDatetime: { $lte: actualTime.actualEndTime },
              },
            },
            {
              $group: {
                _id: null,
                totalAttendance: { $sum: 1 },
                totalHost: { $sum: { $cond: ['$isHost', 1, 0] } },
                totalKickout: { $sum: { $cond: ['$isKickedout', 1, 0] } },
                totalRaisedHand: { $sum: { $cond: ['$hasRaisedHand', 1, 0] } },
                totalThumbsup: { $sum: { $cond: ['$hasThumbsUp', 1, 0] } },
                totalThumbsdown: { $sum: { $cond: ['$hasThumbsDown', 1, 0] } },
                totalClaps: { $sum: { $cond: ['$hasClaped', 1, 0] } },
                totalEchoInstances: { $sum: { $cond: ['$hasClickedEchoDetection', 1, 0] } },
                totalRecordingClicks: { $sum: { $cond: ['$hasStartedRecording', 1, 0] } },
                totalCCClicks: { $sum: { $cond: ['$hasStartedCc', 1, 0] } },
                totalTranscriptRequests: { $sum: { $cond: ['$hasRequestedTranscript', 1, 0] } },
                totalSummaryRequests: { $sum: { $cond: ['$hasRequestedSummary', 1, 0] } },
                totalActionItemsGenerated: { $sum: { $cond: ['$hasGeneratedActionItems', 1, 0] } },
                totalBirdsEyeViewClick: { $sum: { $cond: ['$hasClickedBirdsEyeView', 1, 0] } },
                totalMyGroupViewClicked: { $sum: { $cond: ['$hasClickedlMyGroupView', 1, 0] } },
                totalScreenShares: { $sum: { $cond: ['$hasSwitchedOnScreenShare', 1, 0] } },
                totalCameraTurnOn: { $sum: { $cond: ['$hasSwitchedOnCamera', 1, 0] } },
                totalMicTurnOn: { $sum: { $cond: ['$hasSwitchedOnMike', 1, 0] } },
                totalGroupsCreated: { $sum: { $size: { $ifNull: ['$createdGroups', []] } } },
                totalLocksGroup: { $sum: { $size: { $ifNull: ['$groupLocked', []] } } },
                totalEventLinksCopied: { $sum: { $cond: ['$hasCopiedInvationLink', 1, 0] } },
                totalMuteAllClickedSwitched: { $sum: { $cond: ['$hasSwitchedOnMuteAll', 1, 0] } },
                totalDisabledAllVideoSwitch: { $sum: { $cond: ['$hasSwitchedOnDisabledAllVideos', 1, 0] } },
                totalLobbyStatusSwitch: { $sum: { $cond: ['$hasSwitchedOnLobbyStatus', 1, 0] } },
                totalGroupAllowStatusSwitch: { $sum: { $cond: ['$hasSwitchedOnGroupStatus', 1, 0] } },
                totalGrouplockStatusSwitch: { $sum: { $cond: ['$hasSwitchedOnGroupLockStatus', 1, 0] } },
                totalPrivateVideoShareSwitch: { $sum: { $cond: ['$hasSwitchedOnPrivateVideoShareStatus', 1, 0] } },
                totalPrivateScreenShareSwitch: { $sum: { $cond: ['$hasSwitchedOnPrivateScreenShareStatus', 1, 0] } },
                totalWhiteBoardClicked: { $sum: { $cond: ['$hasClickedWhiteBoard', 1, 0] } },
                totalAnnotationBoardClicked: { $sum: { $cond: ['$hasClickedAnnotationBoard', 1, 0] } },
                totalPollCreated: { $sum: { $cond: ['$hasCreatedPoll', 1, 0] } },
                totalAnnouncementModeClicked: { $sum: { $cond: ['$hasSwitchedOnAnnouncement', 1, 0] } },
              },
            },
          ]);

          const eventInstanceInfo = aggregationResult[0] || {};
          return {
            actualTime,
            peers: aggregationResult, // Optional: Keep if needed for other details.
            eventInstanceInfo,
          };
        })
      );

      return {
        ...eventLog,
        actualTimesWithPeers: peersWithinTimeRange,
      };
    })
  );

  return enrichedEventLogs;
}



