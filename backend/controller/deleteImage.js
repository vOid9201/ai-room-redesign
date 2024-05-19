import {Image} from '../database/models/Image.js';
import {Folder} from '../database/models/Folder.js';


export const deleteImage = async(req,res,next)=>{

    const {folderId,imageId} = req.query;

    try{
        const {_id} = await Image.findOne({imageId:imageId});
        await Folder.findOneAndUpdate({folderId:folderId},{$pull:{images:_id}});
        let {images} = await Folder.findOne({folderId:folderId}).populate("images");
        images.map((doc)=>{
            return{
                imageName:doc.imageName,
                imageId:doc.imageId,
                imageUrl:doc.publicUrl
            }
        })
        await Image.findOneAndDelete({imageId:imageId});

        res.status(200).json({message:"Image deleted successfully",images:images});

    }catch(error){
        next(error);
    }
}