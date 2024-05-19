import { User } from "../database/models/User.js";
import { hashPassword } from "../utils/hashPassword.js";

export const userSignUp = async (req, res, next) => {
    const {fullName,gender,contactNo,email} = req.body;
    let {password} = req.body;
	try {

        if(!fullName || !gender || !contactNo ||  !email || !password){
            const error = new Error("Unprocessable Entity");
            error.status = 422;
            throw error;
        }           
        
        password = await hashPassword(password);
        const user = new User({
            fullName,
            gender,
            contactNo,
            email,
            password,
            folders:[]
        })

        await user.save();
		res.status(200).send({message:"User registered successfully",userId:user._id});
	}
	catch (err) {
		next(err);
	}
}
