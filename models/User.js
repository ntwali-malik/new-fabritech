const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    id: { 
      type: String, 
      required: true, 
      unique: true,
      default: () => new mongoose.Types.ObjectId().toString()
    },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    phone: { type: String },
    address: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);

