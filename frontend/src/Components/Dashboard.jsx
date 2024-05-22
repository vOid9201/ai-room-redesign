// import * as React from "react";
// import { BASE_URL_FOLDER,HEADER_CONFIG } from "../CONSTANTS";
// import { useState,useEffect } from "react";
// import NavBar from "./NavBar";
// import FolderContainer from "./FolderContainer";
// import ImageContainer from "./ImageContainer";
// import {Route , Routes, useNavigate} from 'react-router-dom';
// import axios from "axios";



// async function getAllFolders(setFolders){
//   try{
//     const result = await axios.get(`${BASE_URL_FOLDER}/get-all-folders`,HEADER_CONFIG);
//     console.log("result",result);
//     // return result;
//     setFolders(result.data.folders);
//   }catch{

//   }
// }
// export default function Dashboard({fullName}){

//   const [folders,setFolders] = useState([]);
//   const navigate = useNavigate();
//   const handleLogOut=()=>{
//     setFolders([]);
//     sessionStorage.removeItem("token");
//     navigate('/signin');
//     // return <Navigate to="/signin" replace />;

//   }
//   useEffect(()=>{
//     getAllFolders(setFolders);
//   },[]);

//   return (
//     <>
//       <NavBar name={fullName} handleLogOut={handleLogOut}></NavBar>
//       <div className=" py-3 flex justify-start pl-10 item-center text-3xl font-mono font-medium">FOLDERS CREATED BY YOU</div>
//       <Routes>
//         <Route path="/" element={<FolderContainer folders={folders} setFolders getAllFolders/>} />
//         <Route path="/folders/:folderId" element={<ImageContainer />} />
//       </Routes>

      
      
//     </>
//   )
// }
