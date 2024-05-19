import {User} from '../database/models/User.js';

export const validateUser = async(req,res,next)=>{
    const {_id} = req.user.user;
    try{
        const user = await User.findById(_id).exec();
        if(!user){
            const error = new Error("User not found");
            error.status = 404;
            throw error;
        }
        next();
    }catch(error){
        next(error);
    }
}