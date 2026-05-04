import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function check() {
  console.log("Attempting to connect with URI:", process.env.MONGODB_URI);
  try {
    await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    console.log("SUCCESS! Connected to MongoDB.");
    process.exit(0);
  } catch (err) {
    console.error("FAILED to connect to MongoDB:");
    console.error(err.message);
    process.exit(1);
  }
}

check();
