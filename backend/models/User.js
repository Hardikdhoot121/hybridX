import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },

    phone: {
      type: String,
      default: "",
    },

    classLevel: {
      type: String,
      enum: ["9th", "10th", "11th", "12th", "Dropper"],
      default: "12th",
    },

    batch: {
      type: String,
      enum: ["Batch 1", "Batch 2"],
      default: "Batch 1",
    },

    targetYear: {
      type: Number,
      default: new Date().getFullYear() + 1,
    },

    // Additional fields for migrated spreadsheet students
    // These fields store the original spreadsheet data for backward compatibility
    spreadsheetData: {
      originalId: {
        type: Number,
        description: "Original ID from spreadsheet data"
      },
      stream: {
        type: String,
        enum: ["JEE", "NEET", "None of the above", "Not assigned"],
        default: "Not assigned",
        description: "Stream from spreadsheet (JEE/NEET)"
      },
      fatherName: {
        type: String,
        default: "Not provided"
      },
      motherName: {
        type: String,
        default: "Not provided"
      },
      parentPhone1: {
        type: String,
        default: ""
      },
      parentPhone2: {
        type: String,
        default: ""
      },
      migratedAt: {
        type: Date,
        description: "When this student was migrated from spreadsheet"
      }
    },

    // Metadata for tracking user status
    isMigratedStudent: {
      type: Boolean,
      default: false,
      description: "True if user was migrated from spreadsheet data"
    },

    hasChangedDefaultPassword: {
      type: Boolean,
      default: false,
      description: "True if user has changed the default migration password"
    }
  },
  { timestamps: true }
);

// Virtual field to get stream for frontend compatibility
userSchema.virtual('stream').get(function() {
  return this.spreadsheetData?.stream || this.batch || 'Not assigned';
});

// Virtual field to get fatherName for frontend compatibility
userSchema.virtual('fatherName').get(function() {
  return this.spreadsheetData?.fatherName || 'Not provided';
});

// Virtual field to get motherName for frontend compatibility
userSchema.virtual('motherName').get(function() {
  return this.spreadsheetData?.motherName || 'Not provided';
});

// Virtual field to get parentPhone1 for frontend compatibility
userSchema.virtual('parentPhone1').get(function() {
  return this.spreadsheetData?.parentPhone1 || '';
});

// Virtual field to get parentPhone2 for frontend compatibility
userSchema.virtual('parentPhone2').get(function() {
  return this.spreadsheetData?.parentPhone2 || '';
});

// Ensure virtual fields are included in JSON output
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

const User = mongoose.model("User", userSchema);
export default User;
