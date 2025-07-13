const mongoose = require('mongoose');
const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('MONGODB_URI not set in environment variables.');
  process.exit(1);
}

mongoose.connect(uri, {
  bufferCommands: false,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
}).then(async () => {
  try {
    await mongoose.connection.db.collection('users').dropIndex('emailOrPhone_1');
    console.log('Dropped index emailOrPhone_1');
  } catch (err) {
    console.error('Error dropping index:', err);
  }
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
}); 