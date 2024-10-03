import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bodyMeasurements: {
    height: Number,
    weight: Number,
    bust: Number,
    waist: Number,
    hips: Number,
  },
  preferences: {
    fashionStyle: [String], // Array of preferred styles
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model('User', userSchema);
export default User;
