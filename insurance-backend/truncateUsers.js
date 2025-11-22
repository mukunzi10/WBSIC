const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');

const connectDB = require('./src/config/database');

dotenv.config({
    path: './.env'
});

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  console.log('Connected to DB');

  await User.deleteMany({});  // deletes all users
  console.log('Users collection truncated');

  mongoose.disconnect();
}).catch(err => {
  console.error(err);
});
