import React, { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { BASE_URL_MODEL, OBJECT_STYLES } from "../CONSTANTS";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import {
  Box,
  Button,
  FormControl,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
  Grid,
  InputLabel,
} from "@mui/material";
import { MuiColorInput } from "mui-color-input";

// lets just provide the image to it on the load , helping done , will be when we save
// save kaise karenge yeh sawaaal hain

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

const saveImage = async () => {};

const getAnnotation = async (imageUrl) => {
  try {
    const response = await axios.post(`${BASE_URL_MODEL}/predict-instance`, {
      image_url: imageUrl,
    });
    return response;
  } catch (error) {
    throw new Error("Model not working");
  }
};

const editImage = async (body) => {
  try {
    console.log("inside the edit image function",body)
    const response = await axios.post(`${BASE_URL_MODEL}/edit-image`, body);
    return response;
  } catch (error) {
    throw new Error("Can not call the api");
  }
};

const ImageViewer = () => {
  const { folderId, imageId } = useParams();
  const [masks, setMasks] = useState(null);
  const canvasRef = useRef(null);
  const location = useLocation();
  const { state } = location;
  const [isLoading, setLoading] = useState(false);
  const [selectedObject, setSelectedObject] = useState(null);
  const [image, setImage] = useState(null);
  const [open, setOpen] = useState(false);
  const [colorValue, setColorValue] = useState("#000000");
  const [objectName, setObjectName] = useState("");
  const [imageURL,setImageURL] = useState(state)


  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = ()=>{
    setOpen(true);
  }
  const handleColorChange = (color) => {
    setColorValue(color);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const image = new Image();
    image.src = imageURL;
    image.crossOrigin = "Anonymous";
    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0);
      setImage(image);
    };
  }, [imageURL]);

  const isPointInPolygon = (x, y, coordinates) => {
    let isPointInside = false;
    for (
      let i = 0, j = coordinates.length - 1;
      i < coordinates.length;
      j = i++
    ) {
      const xi = coordinates[i][0],
        yi = coordinates[i][1];
      const xj = coordinates[j][0],
        yj = coordinates[j][1];

      const intersect =
        yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
      if (intersect) isPointInside = !isPointInside;
    }
    return isPointInside;
  };

  const handleCanvasClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    console.log("here", masks);
    Object.entries(masks).forEach(([key, mask]) => {
      if (isPointInPolygon(x, y, mask.coordinates)) {
        setSelectedObject(mask.coordinates);
        setObjectName(mask.object_names);
        console.log("inside canvas click");
      }
    });
  };

  const drawPolygons = (ctx, coordinates) => {
    ctx.beginPath();
    ctx.moveTo(coordinates[0][0], coordinates[0][1]);
    Object.entries(coordinates).forEach(([index, points]) => {
      if (index > 0) ctx.lineTo(points[0], points[1]);
    });
    ctx.closePath();
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const handleClick = (e) => {
    e.preventDefault();
    getAnnotation(state)
      .then((data) => {
        const masks = JSON.parse(data.data.results);
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.strokeStyle = "red";
        Object.entries(masks).forEach(([key, mask]) => {
          setMasks(mask);
          console.log("inside handleClick", mask);
          Object.entries(mask).forEach(([k, m]) => {
            const { coordinates } = m;
            drawPolygons(ctx, coordinates);
          });
        });
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        // setLoading(false);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const body = {
      image_url: state,
      coordinates: selectedObject,
      colorValue: colorValue,
      objectStyle: data.get("style"),
      objectName : objectName
    };
    console.log(body);
    setLoading(true);
    editImage(body)
      .then((data) => {
        setImageURL(data.data.proxied_image_url);
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        handleClose();
        setLoading(false);
        setSelectedObject(null);
        setMasks(null);
        setObjectName(null);
        setColorValue(null);
      });
  };

  return (
    <>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <>
          <div className="flex justify-center items-center flex-col gap-6">
            <canvas
              className=" px-10 rounded-xl border border-gray-500 border-solid shadow-md"
              ref={canvasRef}
              style={{ cursor: "pointer" }}
              onClick={handleCanvasClick}
            ></canvas>
            <button
              className="hover:bg-gray-100 rounded font-mono px-10 pt-2 border border-gray-500 border-solid shadow-xl"
              type="submit"
              onClick={handleClick}
            >
              Start Annotating
            </button>
            {selectedObject ? (
              <>
                <button onClick={handleOpen}>Edit the selected object</button>
                {open ? 
                <Modal
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box Box component="form" onSubmit={handleSubmit} sx={style}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <MuiColorInput
                          format="hex"
                          value={colorValue}
                          onChange={handleColorChange}
                        ></MuiColorInput>
                      </Grid>
                      <Grid item xs={12}>
                        <FormControl fullWidth>
                          <InputLabel id="styleInput">
                            Popular Styles of {objectName}
                          </InputLabel>
                          <Select
                            labelId="style"
                            id="style"
                            label="style"
                            name="style"
                          >
                            {OBJECT_STYLES[objectName].map((style,index)=>{
                              return <MenuItem key={index} value={style}>{style}</MenuItem>
                            })}
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx={{ mt: 3, mb: 2 }}
                    >
                      Generate Results
                    </Button>
                  </Box>
                </Modal>
                : <></>}
              </>
            ) : (
              <></>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default ImageViewer;
