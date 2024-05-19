import React from 'react';
import { Link } from 'react-router-dom';

const Folder = ({folderId,name}) => {
  return (
    <div className='flex flex-col justify-center items-center p-4 hover:shadow-lg hover:bg-gray-200 bg-opacity-90 h-fit cursor-pointer'>
          <Link to={`/folders/${folderId}`}>
           <img alt='folder' src='folder.png' className='w-40 '/>
           <div className='flex items-center text-wrap max-w-40 font-mono '>{name}</div>
          </Link>
    </div>
  )
}

export default Folder