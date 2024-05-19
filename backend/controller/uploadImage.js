import {Image} from '../database/models/Image.js';
import {Folder} from '../database/models/Folder.js';

export const uploadImage = async(req,res,next)=>{
    const {folderId} = req.params;
    const {imageData} = req;
    
    try{

        const image = new Image({
            ...imageData
        });

        await image.save();
        await Folder.findOneAndUpdate({folderId:folderId},{$push:{images:image._id}});

        res.status(200).json({message:"Image Uploaded Successfully", imageData : {
            imageName : image.imageName,
            imageId : image.imageId,
            imageUrl : image.publicUrl
        }});

    }catch(error){
        next(error);
    }
}