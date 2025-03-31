import mongoose, { Schema, Document, Types } from 'mongoose';


export interface IActualTime extends Document {
  eventLogId?: Types.ObjectId;
  actualStartTime: Date;      
  actualEndTime?: Date;   
  eventId: number;    
}


const ActualTimeSchema: Schema<IActualTime> = new Schema<IActualTime>({
  eventLogId: {
    type: Schema.Types.ObjectId,
    ref: 'EventLogs', 
    //required: [true, 'eventLogId is required'],
  },
  eventId:{
    type: Number,
    required: [true, 'eventId is required'],
  },
  actualStartTime: {
    type: Date,
    required: [true, 'Actual start time is required'],
  },
  actualEndTime: {
    type: Date,
    default: null, 
  },
  
}, { timestamps: true });


const ActualTime = mongoose.model<IActualTime>('ActualTimes', ActualTimeSchema);

export default ActualTime;
