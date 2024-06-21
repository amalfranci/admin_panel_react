#  Admin Panel React

This repository contains the source code for an admin panel built using the MERN stack.

# Installation

Follow these steps to set up the project on your local machine:

Prerequisites
	
   Node.js (v14.x or higher recommended)	
   MongoDB (ensure MongoDB is running on your system)

### Backend Setup
       
       Clone the repository
```sh

git clone https://github.com/amalfranci/admin_panel_react.git
cd admin_panel_react

```
2.	Navigate to the backend directory
    ```sh

cd backend
```

3.	Install backend dependencies
```sh
npm install

```

4.Set up environment variables

  Create a .env file in the backend directory and add the following variables:

plaintext
Copy code
MONGODB_URI=mongodb://localhost:27017/your_db_name
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
