import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL_FOLDER } from "../CONSTANTS";
import Folder from "./Folder";
import { Box, Button, Grid, Modal, TextField, Typography } from "@mui/material";

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

const getAllFolders = async () => {
  try {
    const response = await axios.get(`${BASE_URL_FOLDER}/get-all-folders`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
    });
    return response;
  } catch {
    throw new Error("could npt fetch the folders");
  }
};

const createFolder = async (body) => {
  try {
    const response = await axios.post(`${BASE_URL_FOLDER}/create`, body, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
    return response;
  } catch (error) {
    throw new Error("could not fetch the folders");
  }
};

const FolderDisplayer = () => {
  const [loading, setLoading] = useState(false);
  const [folders, setFolders] = useState(null);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [description, setDescription] = useState("");
  const [dialogBox, setDialogBox] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setFolderName("");
    setDescription("");
  };

  const handleDialogBox = () => {
    setDialogBox(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setDialogBox(true);
    setOpen(false);
  };

  const onDialogSubmit = (e) => {
    e.preventDefault();
    if (e.nativeEvent.submitter.name === "callAPI") {
      const body = {
        folderName: folderName,
        description: description,
      };
      createFolder(body).then(() => {
        setLoading(true);
        getAllFolders()
          .then((data) => {
            setFolders(data.data.folders);
          })
          .catch((error) => {
            setError(error);
          })
          .finally(() => {
            setLoading(false);
            handleDialogBox();
            handleClose();
          });
      });
    } else {
      handleDialogBox();
      handleClose();
    }
  };

  useEffect(() => {
    setLoading(true);
    getAllFolders()
      .then((data) => {
        setFolders(data.data.folders);
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <>
      {loading ? (
        <h1>loading ...</h1>
      ) : error ? (
        <h1>Something went wrong please try again later</h1>
      ) : (
        <div className="flex flex-wrap w-screen min-h-96 px-20 gap-6 ">
          {folders?.map((folder) => (
            <Folder
              key={folder.folderId}
              folderId={folder.folderId}
              name={folder.folderName}
            ></Folder>
          ))}
          <img
            onClick={handleOpen}
            src="add.png"
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
                      value={folderName}
                      onChange={(e) => {
                        setFolderName(e.target.value);
                      }}
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
                      value={description}
                      onChange={(e) => {
                        setDescription(e.target.value);
                      }}
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
          <Modal
            open={dialogBox}
            onClose={handleDialogBox}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography>
                Are you sure you want to add the folder !!{" "}
              </Typography>
              <Box component="form" onSubmit={onDialogSubmit} sx={{ mt: 3 }}>
                <Button
                  name="callAPI"
                  type="submit"
                  fullWidth
                  variant="contained"
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
        </div>
      )}
    </>
  );
};

export default FolderDisplayer;
