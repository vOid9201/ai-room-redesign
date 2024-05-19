import { Folder } from "../database/models/Folder.js";

export const getFolder = async(req,res,next)=>{
    const {folderId} = req.params;
    try{
        let {images} = await Folder.findOne({folderId:folderId}).populate("images");
        images = images.map((image)=>{
            return {
                imageName : image.imageName,
                imageId: image.imageId,
                imageUrl : image.publicUrl
            }
        });
        res.status(200).json({message:"Folder fetched successfully",images:images});

    }catch(error){
        next(error);
    }
}
