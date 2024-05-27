import React from 'react';
import {useAuth} from '../provider/authProvider';
import {decodeToken} from 'react-jwt';
import {useNavigate} from 'react-router-dom';

const NavBar = () => {
  
  const navigate = useNavigate();
  const {token,setToken} = useAuth();
  const name = decodeToken(token).user.fullName;
  const handleLogOut=()=>{
    setToken();
    navigate("/",{replace:true})
  }
  
  return (
    <div className="border-b border-solid border-gray-400 shadow-lg flex flex-row justify-between px-20 items-center ">
        <img src='/logo.jpg' alt='logo' className='h-16'></img>
        <div className='flex flex-row gap-8'>
           <div className='font-mono text-2xl font-medium'>{name}</div>
           <div  onClick={handleLogOut} className='text-xl bg-purple-100 border border-gray-600 rounded border-solid px-4 pb-1 shadow-lg'>Logout</div>
        </div>
    </div>
  )
}

export default NavBar