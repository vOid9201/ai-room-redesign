import React from 'react'

const NavBar = () => {
  return (
    <div className="bdr flex flex-row justify-between px-20 items-center ">
        <img src='./logo.jpg' alt='logo' className='h-16 '></img>
        <div className='text-3xl'>Logout</div>
    </div>
  )
}

export default NavBar