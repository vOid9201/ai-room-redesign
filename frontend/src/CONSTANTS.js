const BASE_URL_AUTH = "https://ai-room-redesign.onrender.com/api/user";
const BASE_URL_FOLDER = "https://ai-room-redesign.onrender.com/api/folder";
const BASE_URL_IMAGE = "https://ai-room-redesign.onrender.com/api/image";
const HEADER_CONFIG = {
    headers:{
        Authorization: "Bearer " + JSON.parse(localStorage.getItem("token")), 
    },
};

export {BASE_URL_AUTH,BASE_URL_FOLDER,BASE_URL_IMAGE,HEADER_CONFIG};