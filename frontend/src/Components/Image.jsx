import React from "react";
import { Link } from "react-router-dom";

const Image = ({ imageId, imageName, imageUrl, folderId ,setCheck}) => {
  return (
    <div className="flex flex-col justify-center items-center p-4 hover:shadow-lg hover:bg-gray-200 bg-opacity-90 h-fit cursor-pointer">
      <Link
        to={`/images/${imageId}/${folderId}`}
        state={imageUrl}
      >
        <img alt="folder" src={imageUrl} className="w-40 " />
        <div className="flex items-center text-wrap max-w-40 font-mono ">
          {imageName}
        </div>
      </Link>
    </div>
  );
};

export default Image;
