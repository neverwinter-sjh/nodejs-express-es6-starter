import mongoose from 'mongoose';

const Schema = mongoose.Schema;

// define User Schema
const UserSchema = new Schema({
  userid: { type: String, required: true },
  password: { type: String, required: true },
  user_email: { type: String, required: false, default: '' }
});

export default mongoose.model('User', UserSchema);
