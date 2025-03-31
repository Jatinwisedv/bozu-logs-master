
import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../Helper/config";
enum Role {
    ADMIN = "ADMIN",
    SUPERADMIN = "SUPERADMIN"
}

interface IAdmin extends Document {
    password: string;
    adminName: string;
    adminEmail: string;
    role: Role; 
    createJWT(ipAddress: string): string;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const AdminSchema = new Schema<IAdmin>({
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minlength: [8, "Password must be at least 8 characters long"],
        trim: true,
        validate: {
            validator: function (value: string) {
                const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
                return regex.test(value);
            },
            message: "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character."
        }
    },
    adminName: {
        type: String,
        required: [true, "Please provide an admin name"],
        trim: true,
        unique: [true, "Admin with provided name already exists"],
        maxlength: [50, "Admin name should be limited to length 50"]
    },
    adminEmail: {
        type: String,
        required: [true, "Please provide an admin email"],
        unique: [true, "Admin with provided email already exists"],
        trim: true,
    },
    role: {
        type: String,
        enum: Object.values(Role),
        default: Role.ADMIN, 
        required: true
    }
});

AdminSchema.pre("save", async function (next) {
    // Check if the password field is modified
    if (this.isModified("password")) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});


// JWT creation
AdminSchema.methods.createJWT = function (ipAddress: string): string {
    return jwt.sign(
      { adminId: this._id, adminName: this.adminName, role: this.role, ipAddress },
      process.env.JWT_SECRET as string || config.jwt.secret,
      { expiresIn: process.env.JWT_LIFETIME || config.jwt.lifetime }
    );
};

AdminSchema.methods.comparePassword = function (candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

const Admin = mongoose.model<IAdmin>("Admin", AdminSchema);

export { Admin, IAdmin, Role }; // Export Role enum too








// import mongoose, { Schema, Document } from "mongoose";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// interface IAdmin extends Document {
//     password: string;
//     adminName: string;
//     adminEmail: string;
//     createJWT(): string;
//     comparePassword(candidatePassword: string): Promise<boolean>;
// }

// const AdminSchema = new Schema<IAdmin>({
//     password: {
//         type: String,
//         required: [true, "Please provide a password"],
//         minlength: [8, "Password must be at least 8 characters long"],
//         trim: true,
//         validate: {
//             validator: function (value: string) {
//                 const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
//                 return regex.test(value);
//             },
//             message: "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character."
//         }
//     },
//     adminName: {
//         type: String,
//         required: [true, "Please provide an admin name"],
//         trim: true,
//         maxlength:[50,"admin name should be limited to length 50"]
//     },
//     adminEmail: {
//         type: String,
//         required: [true, "Please provide an admin email"],
//         unique: [true,"admin with provided email already exists"],
//         trim: true,
//     },
    
// });

// AdminSchema.pre("save", async function (next) {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
// });

// // AdminSchema.methods.createJWT = function (): string {
// //     return jwt.sign(
// //         { adminId: this._id, adminName: this.adminName },
// //         process.env.JWT_SECRET as string,
// //         { expiresIn: process.env.JWT_LIFETIME }
// //     );
// // };

// AdminSchema.methods.createJWT = function (ipAddress: string): string {
//     return jwt.sign(
//       { adminId: this._id, adminName: this.adminName, ipAddress },  
//       process.env.JWT_SECRET as string,
//       { expiresIn: process.env.JWT_LIFETIME }
//     );
// };

// AdminSchema.methods.comparePassword = function (candidatePassword: string): Promise<boolean> {
//     return bcrypt.compare(candidatePassword, this.password);
// };

// const Admin = mongoose.model<IAdmin>("Admin", AdminSchema);

// export { Admin, IAdmin };

// // enum array in id
// // wisedv@bozu.us
// // Bozu#12345