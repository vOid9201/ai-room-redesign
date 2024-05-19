const BASE_URL_AUTH = "http://localhost:5000/api/user";
const BASE_URL_FOLDER = "http://localhost:5000/api/folder";
const BASE_URL_IMAGE = "https://ai-room-redesign.onrender.com/api/image";
const HEADER_CONFIG = {
    headers:{
        Authorization: "Bearer " + JSON.parse(localStorage.getItem("token")), 
    },
};

export {BASE_URL_AUTH,BASE_URL_FOLDER,BASE_URL_IMAGE,HEADER_CONFIG};