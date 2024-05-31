import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  BASE_URL_FOLDER,
  BASE_URL_IMAGE,
  BASE_URL_MODEL,
  PREDICTED_CLASS,
} from "../CONSTANTS";
import NavBar from "./NavBar";
import Image from "./Image";
import { Box, Button, Modal, Stack, Typography,Alert } from "@mui/material";
import BooleanContext from "../provider/checkProvider";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const getAllImages = async (folderId) => {
  try {
    const response = await axios.get(
      `${BASE_URL_FOLDER}/get-folder/${folderId}`,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      }
    );
    console.log(response);
    return response;
  } catch (error) {
    throw new Error("could not load try again later");
  }
};

const checkImage = async (formData) => {
  try {
    const response = await axios.post(`${BASE_URL_MODEL}/predict`, formData);
    return response;
  } catch (error) {
    throw new Error("could not run model");
  }
};

const addImage = async (folderId, formData) => {
  try {
    const response = await axios.post(
      `${BASE_URL_IMAGE}/upload/${folderId}`,
      formData,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    return response;
  } catch (error) {
    throw new Error("Could not save image properly try again later");
  }
};

const ImageContainer = () => {
  const { folderId } = useParams();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [open, setOpen] = useState(false);
  const [openAlert, setAlert] = useState(false);
  const [dialogBox, setDialogBox] = useState(false);
  const [isUplaoding ,setIsUplaoding] = useState(false);
  const {checkReload} = useContext(BooleanContext);

  // const [check ,setCheck] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setImageFile(null);
  };
  const handleDialogBox = () => {
    setDialogBox(false);
    setOpen(false);
    setImageFile(null);
  };

  const handleAlert = () => {
    setAlert(false);
    setOpen(false);
    setImageFile(null);
  };

  const handleUpload = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", imageFile);

    checkImage(formData)
      .then((res) => {
        if (PREDICTED_CLASS.indexOf(res.data.predicted_class) !== -1) {
          console.log("here");
          setAlert(false);
          setDialogBox(true);
        } else {setAlert(true);setOpen(false)};
      })
      .catch((error) => {
        setError(error);
      });
  };

  const onDialogSubmit = (e) => {
    e.preventDefault();
    if (e.nativeEvent.submitter.name === "callAPI") {
      const formData = new FormData();
      formData.append("image", imageFile);
      setIsUplaoding(true);
      addImage(folderId, formData)
        .then((res) => {
          setLoading(true);
          getAllImages(folderId)
            .then((data) => {
              setImages(data.data.images);
            })
            .catch((error) => {
              setError(error);
            })
            .finally(() => {
              setLoading(false);
            });
        })
        .catch((error) => {
          setError(error);
        })
        .finally(() => {
          handleDialogBox(false);
          handleClose(false);
          setImageFile(null);
          setIsUplaoding(false);
        });
    } else {
      handleDialogBox(false);
      handleClose(false);
      setImageFile(null);
    }
  };

  useEffect(() => {
    setLoading(true);
    getAllImages(folderId)
      .then((data) => {
        setImages(data.data.images);
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [folderId,checkReload]);

  return (
    <div>
      <NavBar></NavBar>
      {loading ? (
        <h1>loading ...</h1>
      ) : error ? (
        <h1>try again later</h1>
      ) : (
        <div className="flex flex-wrap w-screen min-h-96 px-20 gap-6 ">
          {images?.map((image) => (
            <Image
              key={image.imageId}
              imageId={image.imageId}
              imageName={image.imageName}
              imageUrl={image.imageUrl}
              folderId={folderId}
              // setCheck={setCheck}
            ></Image>
          ))}
          <img
            onClick={handleOpen}
            src="/add.png"
            alt="logo"
            className="cursor-pointer h-48 hover:opacity-70 border border-solid border-gray-500 hover:shadow-lg hover:bg-gray-200 bg-opacity-90"
          />
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Box sx={{ textAlign: "center", mt: 4 }}>
                <input
                  accept="image/jpeg,image/png"
                  style={{ display: "none" }}
                  id="raised-button-file"
                  type="file"
                  onChange={(e) => setImageFile(e.target.files[0])}
                />
                <label htmlFor="raised-button-file">
                  <Button variant="contained" component="span">
                    Select an image 
                  </Button>
                </label>
                {imageFile && (
                  <Typography variant="body1" sx={{ mt: 2 }}>
                    Selected File: {imageFile.name}
                  </Typography>
                )}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleUpload}
                  sx={{ mt: 2 }}
                >
                  Upload
                </Button>
              </Box>
            </Box>
          </Modal>
          <Modal
            open={dialogBox}
            onClose={handleDialogBox}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography>
                Are you sure you want to add this verified image of a room !!{" "}
              </Typography>
              <Box component="form" onSubmit={onDialogSubmit} sx={{ mt: 3 }}>
                <Button
                  name="callAPI"
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isUplaoding}
                  sx={{ mt: 3, mb: 2 }}
                >
                  YES
                </Button>
                <Button
                  name="callAllDialogBox"
                  type="submit"
                  fullWidth
                  variant="cotained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  NO
                </Button>
              </Box>
            </Box>
          </Modal>
          {openAlert && (
            <Stack sx={{ width: "100%" }} spacing={2}>
              {" "}
              <Alert
                severity="error"
                action={
                  <Button color="inherit" size="small" onClick={handleAlert}>
                    UNDO
                  </Button>
                }
              >
                Can not uplaod an image which is not a room !!
              </Alert>
            </Stack>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageContainer;
