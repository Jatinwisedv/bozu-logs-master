import { Types } from 'mongoose';
import ActualTime, { IActualTime } from '../Model/ActualTimeModal';  // Adjust the import path to match your file structure

class ActualTimeService {
  // Create a new ActualTime
  createActualTime(data: IActualTime): Promise<IActualTime> {
    const actualTime = new ActualTime(data);
    return actualTime.save();
  }

  // Get an ActualTime by its _id
  getActualTimeById(id: string): Promise<IActualTime | null> {
    return ActualTime.findById(id).exec();
  }

  // Get all ActualTimes for a specific eventLogId
   getActualTimesByEventLogId(eventLogId: Types.ObjectId): Promise<IActualTime[]> {
    return ActualTime.find({ eventLogId }).exec();
  }

  // Update an ActualTime by its _id
   updateActualTime(id: string, data: Partial<IActualTime>): Promise<IActualTime | null> {
    return ActualTime.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  // Delete an ActualTime by its _id
  deleteActualTime(id: string): Promise<IActualTime | null> {
    return ActualTime.findByIdAndDelete(id).exec();
  }

  // Get total number of ActualTimes
  getTotalActualTimes(): Promise<number> {
    return ActualTime.countDocuments().exec();
  }

  getTotalActualTimeByEventId(eventId: number): Promise<number> {
    return ActualTime.countDocuments({ eventId }).exec();
  }
  
  async updateAllEventEndTimeByEventId(eventId: number, ActualEndTime: Date): Promise<number> {
    const result = await ActualTime.updateMany(
      { eventId, actualEndTime: null },
      { $set: { actualEndTime: ActualEndTime } }
    ).exec();
    return result.modifiedCount; 
  }

  getActualTimeByEventId(eventId: number): Promise<IActualTime | null> {
    return ActualTime.findOne({ eventId }).exec();
  }


  getAllEventActualTimebyEventId(eventId: number): Promise<IActualTime[]> {
    //const eventIdObj:Types.ObjectId = new Types.ObjectId(eventId);
    return ActualTime.find({ eventId: eventId }).exec();
  }

  deleteAllEventActualTimeByEventId(eventId: number): Promise<any> {
    return ActualTime.deleteMany({ eventId }).exec();
  }




}

export default ActualTimeService;
