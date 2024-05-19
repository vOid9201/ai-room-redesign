import React from 'react'
import Folder from './Folder';
import { HEADER_CONFIG ,BASE_URL_FOLDER} from '../CONSTANTS';
import axios from 'axios';
import { useState } from 'react';
import { Box, Button, Grid, Modal, TextField } from '@mui/material';


const style = {
  position:'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

async function createFolder(body){
  try {
    const response = await axios.post(`${BASE_URL_FOLDER}/create`, body,HEADER_CONFIG);
    return response;
  } catch (error) {
    console.log(error);
  }
}

const FolderContainer = ({folders,setFolders,getAllFolders}) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setIsSubmitting(false);
  };

    console.log(folders);
    const handleSubmit = (event) => {
      event.preventDefault();
      if(isSubmitting) return;
  
      setIsSubmitting(true);
      const data = new FormData(event.currentTarget);
        const body = {
          folderName: data.get("folderName"),
          description: data.get("description")
        };
      console.log(body);
      createFolder(body).then((res)=>{
        if(res && res.status === 200){
          console.log("here");
          handleClose();
          getAllFolders(setFolders);
        }else{
          setIsSubmitting(false);
        }
      });
    };

    if(!folders)return null;

  return (
    <>
      <div className='flex flex-wrap w-screen min-h-96 px-20 gap-6 '>
        {folders.map((folder,key)=>(
          <Folder key={folder.folderId} folderId={folder.folderId} name={folder.folderName}/>
        ))}

        <img onClick={handleOpen} src='add.png' alt='logo' className='cursor-pointer h-48 hover:opacity-70 border border-solid border-gray-500 hover:shadow-lg hover:bg-gray-200 bg-opacity-90'/>
        <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        >
        <Box sx={style}>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="given-name"
                  name="folderName"
                  required
                  fullWidth
                  id="folderName"
                  label="Folder Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="description"
                  label="description"
                  type="text"
                  id="description"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Add Folder
            </Button>
          </Box>
        </Box>
      </Modal>

      </div>
    </>
    
  );
};

export default FolderContainer;


