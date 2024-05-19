import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const FolderSchema = new Schema({
    folderId:{
        type:String,
        required:true
    },
    folderName:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true
    },
    images : [{
        type:mongoose.SchemaTypes.ObjectId,
        ref:"image",
    }]
})

const folderModel = mongoose.model("folder",FolderSchema);
export {folderModel as Folder};