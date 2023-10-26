const db = require('../config/database').getUserDB();

const mongoose = require('mongoose');

const authSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  jwtToken: {
    type: String
  }
}, {
  timestamps: true,
  versionKey: false
}
);

const Auth = db.model('auth', authSchema);

module.exports = Auth;
