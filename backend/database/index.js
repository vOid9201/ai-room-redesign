import  mongoose from 'mongoose';

const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
  } catch (err) {
    console.log("Error in connecting to database:");
    throw err;
  }
};

export { connectToDB };
