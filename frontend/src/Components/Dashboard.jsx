import * as React from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL_FOLDER,HEADER_CONFIG } from "../CONSTANTS";
import { useState,useEffect } from "react";
import NavBar from "./NavBar";


export default function Dashboard(){
  
  // const [folderName,setFolderName] = useState("");
  // const [folderDescription,setFolderDescription] = useState("");
  // const [folders,setFolders] = useState([]);

  const navigate = useNavigate();
  
  

  // const getAllFolders = ()=>{

  // }

  // const handleCreateFolder = ()=>{

  // }

  const handleLogOut = ()=>{
    localStorage.removeItem("token");
    navigate("/signin");
  }

  return (
    <>
      <NavBar></NavBar>
      {/* <button onClick={handleLogOut} className="text-3xl">logout</button> */}
    </>
  );
}
