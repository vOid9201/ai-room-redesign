import {Folder} from '../database/models/Folder.js';
import {User} from '../database/models/User.js';
import {v4 as uuidv4} from 'uuid';

export const createFolder = async(req,res,next)=>{
    const {folderName,description} = req.body;
    const {_id} = req.user.user;
    try{

        if(!folderName || !description){
            const error = new Error("Unprocessable Entity");
            error.status = 422;
            throw error;
        }
        const folderId = uuidv4();
        const folder = new Folder({
            folderId:folderId,
            ...req.body,
            images:[]
        });
        
        await folder.save();

        await User.findOneAndUpdate({_id:_id},{$push:{folders:folder._id}});
        res.status(200).json({message:"Successfull creation of the folder",folderId:folder.folderId});
        
    }catch(error){
        next(error);
    }
}