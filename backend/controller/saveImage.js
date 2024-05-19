import {Image} from '../database/models/Image.js';

export const saveImage = async(req,res,next)=>{

    const {imageId} = req.params;
    const {imageData} = req;

    try{
        const image = await Image.findOneAndUpdate({imageId:imageData.imageId},{publicUrl:imageData.publicUrl});
        res.status(200).json({message:"Saved successfully",image:image});
    }catch(error){
        next(error);
    }
}