There seems to be a distinct lack of templated DIY websites for setting up a fully featured photography portfolio. Of course there are the classics like squarespace, smugmug, and pixieset, but these are expensive and lock you into a company. On the fully DIY route, there are some GitHub projects that exist, but are usually incredible lacking in features and are often basically plain html and CSS with a bit of JavaScript.

With this project I want to create a deployable website that has all the *main* bells and whistles. 
- A beautiful mosaic layout  for a main portfolio landing page
- Ability to upload large amounts of photos for long term storage
- Albums for photos to be organized into
- Login/Authentication to allow for photo uploading

## Architecture
![[Architecture.canvas]]

## Tech Stack
**Frontend**
- React with https://react-photo-album.com/
**Backend**
- Java SPRING API
- Java S3 client 
**Server**
- AWS EC2 Instance to host frontend and backend
- S3 Bucket for file storage
- Resizing images needs to be done somehow, this might be an option: https://github.com/aws-solutions/dynamic-image-transformation-for-amazon-cloudfront