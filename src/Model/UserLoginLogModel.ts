import mongoose, { Schema, Document } from 'mongoose';

export interface IUserLoginLog extends Document {
  userId: number;
  username: string;
  name: string;
  deviceSource: 'Web' | 'IOS' | 'Android' | 'Window_PCApp' | 'Mac_PCApp' | 'Linux_PCApp' ;
  ipAddress: string;
  loginStatus?: boolean;
  logoutStatus?: boolean;
  startTime?: Date;
  endTime?: Date;
  city?: string;
  state?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  postalCode?: string;
  userAgent?: string;
  isp?: string;
}

const UserLoginLogSchema: Schema = new Schema<IUserLoginLog>({
  userId: {
    type: Number,
    required: [true, 'userId is required'],    
    //unique: true,
    nullable: false,
  },
  username: {
    type: String,
    required: [true, 'username is required'],
    maxlength: 100,
    trim: true 
  },
  name: {
    type: String,
    required: [true, 'name required'],
    maxlength: 100,
    trim: true 
  },
  deviceSource: {
    type: String,
    enum: {
      values: ['Web', 'IOS', 'Android', 'Window_PCApp', 'Mac_PCApp', 'Linux_PCApp'],
      message: 'Invalid device source. Must be one of the following: Web, IOS, Android, Window_PCApp, Mac_PCApp, or Linux_PCApp.'
    },
    required: [true, 'deviceSource is required'],
  },
  ipAddress: {
    type: String,
    required: true,
    validate: {
      validator: (value: string) => {
        const ipv4Regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        const ipv6Regex = /([a-fA-F0-9]{1,4}:){7,7}[a-fA-F0-9]{1,4}|(([a-fA-F0-9]{1,4}:){1,7}:)|(([a-fA-F0-9]{1,4}:){1,6}:[a-fA-F0-9]{1,4})/;
        return ipv4Regex.test(value) || ipv6Regex.test(value);
      },
      message: 'Invalid IP address format',
    },
  },
  loginStatus: {
    type: Boolean,
    required: false,
    default: true,
  },
  logoutStatus: {
    type: Boolean,
    required: false,
    default: false,
  },
  startTime: {
    type: Date,
    required: false,
    default: Date.now,
  },
  endTime: {
    type: Date,
    required: false,
    default: null,
  },
  city: {
    type: String,
    required: false,
    default: null,
    trim: true 
  },
  state: {
    type: String,
    required: false,
    default: null,
    trim: true 
  },
  country: {
    type: String,
    required: false,
    default: null,
    trim: true 
  },
  latitude: {
    type: Number,
    required: false,
    default: null
  },
  longitude: {
    type: Number,
    required: false,
    default: null
  },
  postalCode: {
    type: String,
    required: false,
    default: null,
    validate: {
      validator: (value: string | null) => {
        if (value === null || value === undefined) return true; // Allow null or undefined
        return value.length >= 3 && value.length <= 11;
      },
      message: 'Postal code must be between 3 and 11 characters',
    },
    trim: true,
  },
  userAgent: {
    type: String,
    required: false,
    default: null,
    maxlength: 500,
    trim: true 
  },
  isp: {
    type: String,
    required: false,
    default: null,
    maxlength: 500,
    trim: true 
  },
});

const UserLoginLog = mongoose.model<IUserLoginLog>('UserLoginLog', UserLoginLogSchema);
export default UserLoginLog;















// import mongoose, { Schema, Document } from 'mongoose';

// export interface IUserLoginLog extends Document {
//   userId: number;
//   username: string;
//   name: string;
//   deviceSource: 'Web' | 'IOS' | 'Android' | 'Window_PCApp' | 'Mac_PCApp' | 'Linux_PCApp';
//   loginStatus: boolean;
//   logoutStatus: boolean;
//   startTime: Date;
//   endTime?: Date;
//   ipAddress: string;
//   city?: string;
//   state?: string;
//   country?: string;
//   latitude?: number;
//   longitude?: number;
//   postalCode?: string;
//   userAgent?: string;
// }

// // Define the schema
// const UserLoginLogSchema: Schema = new Schema<IUserLoginLog>({
//   userId: {
//     type: Number,
//     required: [true, 'userId is required']
//   },
//   username: {
//     type: String,
//     required: [true, 'username is required'],
//     maxlength: 100
//   },
//   name: {
//     type: String,
//     required: [true, 'name required'],
//     maxlength: 100
//   },
//   deviceSource: {
//     type: String,
//     enum: {
//       values: ['Web', 'IOS', 'Android', 'Window_PCApp', 'Mac_PCApp', 'Linux_PCApp'],
//       message: 'Invalid device source. Must be one of the following: Web, IOS, Android, Window_PCApp, Mac_PCApp, or Linux_PCApp.'
//     },
//     required: [true, 'deviceSource is required'],
//   },
//   loginStatus: {
//     type: Boolean,
//     required: false,
//     default: true
//   },
//   logoutStatus: {
//     type: Boolean,
//     required: false,
//     default: false
//   },
//   startTime: {
//     type: Date,
//     required: false,
//     default: Date.now
//   },
//   endTime: {
//     type: Date,
//     required: false,
//     default: null
//   },
//   ipAddress: {
//     type: String,
//     required: true,
//     validate: {
//       validator: (value: string) => {
//         const ipv4Regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
//         const ipv6Regex = /([a-fA-F0-9]{1,4}:){7,7}[a-fA-F0-9]{1,4}|(([a-fA-F0-9]{1,4}:){1,7}:)|(([a-fA-F0-9]{1,4}:){1,6}:[a-fA-F0-9]{1,4})/;
//         return ipv4Regex.test(value) || ipv6Regex.test(value);
//       },
//       message: 'Invalid IP address format',
//     },
//   },
//   city: {
//     type: String,
//     required: false,
//     default: null
//   },
//   state: {
//     type: String,
//     required: false,
//     default: null
//   },
//   country: {
//     type: String,
//     required: false,
//     default: null
//   },
//   latitude: {
//     type: Number,
//     required: false,
//     default: null
//   },
//   longitude: {
//     type: Number,
//     required: false,
//     default: null
//   },
//   postalCode: {
//     type: String,
//     required: false,
//     default: null,
//     validate: {
//       validator: (value: string) => value.length >= 3 && value.length <= 11,
//       message: 'Postal code must be between 3 and 11 characters',
//     },
//   },
//   userAgent: {
//     type: String,
//     required: false,
//     default: null,
//     maxlength: 500
//   },
// });

// // Export the model
// const UserLoginLog = mongoose.model<IUserLoginLog>('UserLoginLog', UserLoginLogSchema);
// export default UserLoginLog;
