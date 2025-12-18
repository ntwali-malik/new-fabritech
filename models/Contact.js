const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema(
  {
    id: { 
      type: String, 
      required: true, 
      unique: true,
      default: () => new mongoose.Types.ObjectId().toString()
    },
    fullName: { 
      type: String, 
      required: true,
      trim: true
    },
    email: { 
      type: String, 
      required: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
    },
    phone: { 
      type: String,
      trim: true
    },
    subject: { 
      type: String, 
      required: true,
      trim: true
    },
    serviceInterest: {
      type: String,
      required: true,
      enum: [
        'Starlink & Networking',
        'Digital Security',
        'Web Development',
        'Software Development',
        'Canal+ & DStv Services',
        'Internships & Short Courses',
        'Other'
      ]
    },
    message: { 
      type: String, 
      required: true,
      trim: true
    },
    privacyAgreed: {
      type: Boolean,
      required: true,
      default: false,
      validate: {
        validator: function(value) {
          return value === true;
        },
        message: 'You must agree to the privacy policy'
      }
    },
    status: {
      type: String,
      enum: ['new', 'read', 'replied', 'archived'],
      default: 'new'
    }
  },
  { timestamps: true }
);

// Index for faster queries
ContactSchema.index({ email: 1 });
ContactSchema.index({ status: 1 });
ContactSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Contact', ContactSchema);

