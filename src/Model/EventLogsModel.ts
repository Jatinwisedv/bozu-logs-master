import mongoose, { Schema, Document, ObjectId,Types } from 'mongoose';


export interface IEventLog extends Document {
  eventId: number;
  eventName: string;
  eventNumber: string;
  eventType: string;
  eventDate: Date;
  eventStartTime: Date;
  eventEndTime?: Date;
}

const EventLogSchema: Schema = new Schema<IEventLog>({
  eventId: {
    type: Number,
    required: [true, 'eventId is required'],
    unique: true,
  },
  eventName: {
    type: String,
    required: [true, 'eventName is required'],
    maxlength: 200,
    trim: true,
  },
  eventNumber: {
    type: String,
    required: [true, 'eventNumber is required'],
    maxlength: 200,
    trim: true,
  },
  eventType: {
    type: String,
    required: [true, 'eventType is required'],
    maxlength: 200,
    trim: true,
  },
  eventDate: {
    type: Date,
    required: [true, 'eventDate is required'],
  },
  eventStartTime: {
    type: Date,
    required: [true, 'eventStartTime is required'],
  },
  eventEndTime: {
    type: Date,
    default: null,
  } 

  }, 
  { timestamps: true}
);

const EventLog = mongoose.model<IEventLog>('EventLog', EventLogSchema);

export default EventLog;
