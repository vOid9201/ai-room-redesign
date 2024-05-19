import {User} from "../database/models/User.js";

export const getAllFolder = async(req,res,next)=>{
    const {_id} = req.user.user;
    try{

        let {folders} = await User.findOne({_id:_id}).populate('folders').exec();
        folders = folders.map((folder)=>{
            return{
                folderName : folder["folderName"],
                folderId : folder["folderId"]
            }
        });

        res.status(200).json({message:"Fetched folders data successfully", folders:folders});

    }catch(error){
        next(error);
    }
}