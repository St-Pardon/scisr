import { Schema, model } from 'mongoose';

const URLSchema = new Schema({
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  user_id: {
    type: String,
    required: true,
  },
  original_url: {
    type: String,
    required: true,
  },
  shortened_url: {
    type: String,
    required: true,
  },
  qrcode: {
    type: String,
    require: true,
  },
  clicks: {
    type: Number,
    default: 0,
  },
  location: {
    type: String,
  },
  client: {
    type: String,
  },
});

const urlModel = model('urlModel', URLSchema);
export default urlModel;
