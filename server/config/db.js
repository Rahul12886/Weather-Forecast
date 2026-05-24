import mongoose from 'mongoose';

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    globalThis.useMemoryStore = true;
    console.warn('MONGO_URI missing. Server is running with in-memory demo storage.');
    return;
  }

  await mongoose.connect(mongoUri);
  globalThis.useMemoryStore = false;
  console.log('MongoDB connected');
};

export default connectDB;
