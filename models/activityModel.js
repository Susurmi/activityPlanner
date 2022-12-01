const mongoose = require('mongoose');
const { Schema } = mongoose;

const authorModel = new Schema({
  userName: { type: String, required: true },
  userId: { type: String, required: true },
  iconUrl: { type: String, required: true },
});

const participantModel = new Schema({
  userName: { type: String, required: true },
  userId: { type: String, required: true },
});

const activitySchema = new Schema({
  author: authorModel,
  title: { type: String, required: true },
  time: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, default: '' },
  post: { type: String, required: true },
  channel: { type: String, required: true },
  participants: [participantModel],
});

module.exports = mongoose.model('Activity', activitySchema);
