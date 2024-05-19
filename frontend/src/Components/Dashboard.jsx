import * as React from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard(){
  const navigate = useNavigate();

  const handleLogOut = ()=>{
    localStorage.removeItem("token");
    navigate("/signin");
    
  }

  return (
    <button onClick={handleLogOut}>logout</button>
  );
}