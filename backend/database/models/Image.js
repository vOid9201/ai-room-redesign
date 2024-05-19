import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    imageName:{
        type:String,
        required:true,
    },
    imageId:{
        type:String,
        required:true,
    },
    publicUrl:{
        type:String,
        required:true,
    }
})

const imageModel = mongoose.model("image",ImageSchema);
export {imageModel as Image};