import requests
from io import BytesIO

def save_image_to_service(image_file, authorization_header,folder_id):
    
    service_url = f'http://localhost:5000/api/image/upload/{folder_id}'  # Replace with your service URL
    print(service_url)
    # print(image_file.filename,image_file,image_file.content_type)
    # image_data = BytesIO(image_file.read())
    headers = {
        'Authorization': authorization_header  # Pass the authorization header
    },
    file={
        'image':image_file
    }

    response = requests.post(service_url, headers=headers, files=file)
    return response.json()
