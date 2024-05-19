import express from 'express';

import { createFolder } from '../controller/createFolder.js';
import { getAllFolder } from '../controller/getAllFolder.js';
import { validateFolder } from '../utils/validateFolder.js';
import { getFolder } from '../controller/getFolder.js';

const router = express.Router();

router.post('/create',createFolder);
router.get('/get-all-folders',getAllFolder);
router.get('/get-folder/:folderId',validateFolder,getFolder);

export {router as folder};
