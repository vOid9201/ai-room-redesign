import {v4 as uuidv4} from 'uuid';
import {Image} from '../database/models/Image.js';
import axios from 'axios';
import dotenv from 'dotenv';
import sharp from 'sharp';
dotenv.config();

export const uploader = async(req,res,next)=>{

    try{

        const folderId = req.params?.folderId;
        const imageId = req.params?.imageId;

        if(imageId){
            const image = await Image.findOne({imageId:imageId});
            if(!image){
                const error = new Error("No such Image exists");
                error.status = 404;
                throw error;
            }
        }
        let imageBuffer = req.file.buffer;
        const imageName = req.file.originalname;
        const imageID = (!imageId) ? uuidv4() : imageId;

        if(!imageId)
            imageBuffer = await sharp(imageBuffer).resize(1024,1024,{fit:'inside'}).toBuffer();

        imageBuffer = imageBuffer.toString('base64');

        const response = await axios({
            method:'post',
            url:process.env.IMGBB_UPLOAD_API_URL,
            headers:{
                'Content-Type':'application/x-www-form-urlencoded',
            },
            data:new URLSearchParams({
                key:process.env.IMGBB_API_KEY,
                image:imageBuffer,
                name:imageID,
            }),
        });

        if(response.status !== 200){
            const error = new Error("Error in uploading image try again");
            error.status = 500;
            throw error;
        }
        
        const {url} = response.data.data;
        const imageData = {
            imageName:imageName,
            imageId:imageID,
            publicUrl:url
        }

        req.imageData = imageData;

        next();


    }catch(error){
        next(error);
    }
}