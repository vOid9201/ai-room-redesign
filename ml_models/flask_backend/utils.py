import requests
import io
import os 
from PIL import Image,ImageDraw
# from dotenv import load_env

def download_images(image_url):
    response = requests.get(image_url)
    image = Image.open(io.BytesIO(response.content))
    return image

def create_mask(image_size,coordinates):
    new_coordinates = [tuple(cord) for cord in coordinates]
    mask = Image.new('RGBA',image_size,(255,255,255,255))
    draw = ImageDraw.Draw(mask)
    draw.polygon(new_coordinates,outline=None,fill=(0,0,0,0))
    print("Inside create_mask",mask)
    return mask

def create_prompt(colorValue,style,name):
    return f"replace with {colorValue} {style} {name}"

