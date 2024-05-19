import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import morgan from 'morgan';
import express from 'express';
import passport from 'passport';
import mongoose from 'mongoose';
import { connectToDB } from './database/index.js';
import {auth,folder,image} from './routers/index.js';
import {validateUser} from './utils/validateUser.js';

const port = process.env.PORT || 3001;

const app = express();

app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS,
    optionsSuccessStatus: 200,
  })
);

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(function (req, res, next) {
  if (mongoose.connection.readyState === 1) {
    next();
  } else {
    res.status(500);
    res.json({ error: "Internal Server Error - Database Disconnected" });
  }
});

app.use('/api/user',auth);
app.use('/api/folder',passport.authenticate("jwt",{session:false}),validateUser,folder);
app.use('/api/image',passport.authenticate("jwt",{session:false}),validateUser,image);


app.use(function (err, req, res, next) {
  console.error("ERROR:", err.name, ": ", err.message);
  res.status(err.status || 500);
  res.json({ error: err });
});



const startServer = async () => {
  app.listen(port, () => {
    console.log(`Server listinening on http://localhost:${port}`);
  });

  try {
    await connectToDB();
    console.log("Database Connected.");
  } catch (err) {
    console.log(">ERROR :", err.name);
    console.log(">Error Message :", err.message);
    console.log(">Error Code :", err.code ? err.code : 0);
    console.log(">Error CodeName :", err.codeName ? err.codeName : "null");
  }
};

startServer();