import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL_FOLDER, HEADER_CONFIG } from '../CONSTANTS';
import NavBar from './NavBar';

const ImageContainer = () => {
  const { folderId } = useParams();
  const [images, setImages] = useState([]);

  useEffect(() => {
    async function fetchImages() {
      try {
        const result = await axios.get(`${BASE_URL_FOLDER}/get-folder/${folderId}`, HEADER_CONFIG);
        setImages(result.data.images);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    }

    fetchImages();
  }, [folderId]);

  return (
    <div>
      <NavBar></NavBar>
      <h2>Images in Folder: {folderId}</h2>
      {images.map((image) => (
        <div className='flex flex-col justify-center items-center p-4 hover:shadow-lg hover:bg-gray-200 bg-opacity-90 h-fit cursor-pointer'>
         <img alt='image' src={image.imageUrl} className='w-40 '/>
         <div className='flex items-center text-wrap max-w-40 font-mono '>{image.imageName}</div>
        </div>
      ))}
    </div>
  );
};

export default ImageContainer;
