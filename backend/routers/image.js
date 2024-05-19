import express from 'express';
import multer from 'multer';
import { validateFolder } from '../utils/validateFolder.js';
import { uploadImage } from '../controller/uploadImage.js';
import {saveImage} from '../controller/saveImage.js';
import { uploader } from '../utils/uploader.js';
import { deleteImage } from '../controller/deleteImage.js';

const storage = multer.memoryStorage();
const upload = multer({storage:storage});
const router = express.Router();

router.post('/upload/:folderId',validateFolder,upload.single('image'),uploader,uploadImage);
router.put('/re-upload/:imageId',upload.single('image'),uploader,saveImage);
router.delete('/delete',validateFolder,deleteImage);

export {router as image};
