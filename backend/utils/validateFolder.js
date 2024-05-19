import {User} from '../database/models/User.js';
import { Folder } from '../database/models/Folder.js';

export const validateFolder = async(req,res,next)=>{
    
    
    const {_id} = req.user.user;

    try{

        const folderId = req?.params?.folderId ? req.params.folderId : req.query.folderId;
        
        const folder = await Folder.findOne({folderId: folderId});
        if(!folder){
            const error = new Error("No such folder exist");
            error.status = 404;
            throw error;
        }

        const {folders} = await User.findById(_id).populate("folders");
        
        if(!folders.find((doc)=> doc.folderId === folderId)){
            const error = new Error("You are not authorized to see this folder");
            error.status = 401;
            throw error;
        }
        
        next();
    }catch(error){
        next(error);
    }
}