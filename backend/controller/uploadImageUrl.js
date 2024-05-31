import { Image } from "../database/models/Image.js";
import axios from "axios";
import FormData from 'form-data';

export const uploadImageUrl = async(req,res,next)=>{
    const {imageId} = req.params;
    const {image_url} = req.body;

    try{
        console.log("here",image_url);
        const imageUrl = "http://localhost:8080/static/edited_image.png";        
        const response = await axios.get(imageUrl,{responseType:'arraybuffer'});
        console.log("response",response);
        const formData = new FormData();

        formData.append('key',process.env.IMGBB_API_KEY);
        formData.append('image',Buffer.from(response.data).toString('base64'));

        const imgbbResponse = await axios.post(`${process.env.IMGBB_UPLOAD_API_URL}`,formData,{
            headers:formData.getHeaders(),
        })

        if(imgbbResponse.data.status!==200)
            return res.status(500).json({error:imgbbResponse.data.error.message});
        const image = await Image.findOneAndUpdate({imageId:imageId},{publicUrl:imgbbResponse.data.data.url})
        res.status(200).json({url:imgbbResponse.data.data.url,image:image});
    }catch(error){
        console.error(error);
        next(error)
        // res.status(500).json({error:'An error occurred while uplaoding the image'});
    }
}