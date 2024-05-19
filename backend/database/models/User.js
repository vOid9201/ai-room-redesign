import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    fullName:{
        type:String,
        required:true
    },
    gender: {
        type: String,
        required: true,
    },
    
    contactNo: {
        type: String,
        required: true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    folders:[{
        type:mongoose.SchemaTypes.ObjectId,
        ref:"folder"
    }]

})

UserSchema.methods.isValidPassword = async function (password) {
  const user = this;
  const compare = await bcrypt.compare(password, user.password);

  return compare;
};

const userModel = mongoose.model("user", UserSchema);
export {userModel as User};