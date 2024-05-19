import express from 'express';
import {userLogIn} from '../controller/userLogIn.js';
import {userSignUp} from '../controller/userSignUp.js';
const router = express.Router();

router.post("/register", userSignUp);
router.post("/login", userLogIn);

export {router as auth};