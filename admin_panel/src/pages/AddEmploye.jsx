import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const CreateEmployee = () => {

  const navigate=useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    designation: '',
    gender: 'Male', 
    courses: [],
    isActive: true
  });

  const [file, setFile] = useState(null); 
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'checkbox') {
      if (checked) {
        setFormData({
          ...formData,
          courses: [...formData.courses, name]
        });
      } else {
        setFormData({
          ...formData,
          courses: formData.courses.filter(course => course !== name)
        });
      }
    } else if (type === 'file') {
      setFile(files[0]); 
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  //  FORM SUBMIT AND VALIDATION

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = {};

    if (!formData.name.trim()) {
      validationErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      validationErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      validationErrors.email = 'Email is not valid';
    }

    if (!formData.mobile.trim()) {
      validationErrors.mobile = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      validationErrors.mobile = 'Mobile number should be 10 digits';
    }

    if (!formData.designation.trim()) {
      validationErrors.designation = 'Designation is required';
    }

    if (!formData.gender) {
      validationErrors.gender = 'Gender is required';
    }

    if (formData.courses.length === 0) {
      validationErrors.courses = 'Select at least one course';
    }

    if (!file) {
      validationErrors.file = 'Upload an image file';
    } else {
      const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;
      if (!allowedExtensions.exec(file.name)) {
        validationErrors.file = 'Only JPG/PNG files are allowed';
      }
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        // Upload to Cloudinary
        const imageFormData = new FormData();
        imageFormData.append("file", file);
        imageFormData.append("upload_preset", "socialmedia_image");

        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/dswd4mkqr/image/upload`,
          imageFormData
        );

        const imageUrl = response.data.secure_url;

        // Submit form data to backend
        const employeeData = {
          ...formData,
          imageUrl
        };

        const serverResponse = await axios.post("http://localhost:4000/api/create", employeeData);

  
        toast.success(serverResponse.data.message);
        if (serverResponse.data)
        {
          setTimeout(() => {

          navigate('/employe')
            
          },2000)
          }

        
        setFormData({
          name: '',
          email: '',
          mobile: '',
          designation: '',
          gender: 'Male',
          courses: [],
           isActive: true 
        });
        setFile(null);
      } catch (error) {
        console.error('Error uploading the image or submitting the form', error);
        
        toast.error(error.response?.data?.message || 'Error occurred');
      }
    }
  };

  return (
    <div className="container mb-4  ">
      <h2 className="mb-4">Create Employee</h2>
      <form onSubmit={handleSubmit}>
         
      <ToastContainer />
        <div className="row mb-3">
          <div className="col">
            <label className="form-label">Name:</label>
            <input
              type="text"
              className="form-control"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <span className="text-danger">{errors.name}</span>}
          </div>
          <div className="col">
            <label className="form-label">Email:</label>
            <input
              type="email"
              className="form-control"
              name="email"
              placeholder="example@gmail.com"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <span className="text-danger">{errors.email}</span>}
          </div>
        </div>
        <div className="row mb-3">
          <div className="col">
            <label className="form-label">Mobile No:</label>
            <input
              type="text"
              className="form-control"
              name="mobile"
              placeholder="Enter your mobile number"
              value={formData.mobile}
              onChange={handleChange}
            />
            {errors.mobile && <span className="text-danger">{errors.mobile}</span>}
          </div>
          <div className="col">
            <label className="form-label">Designation:</label>
            <input
              type="text"
              className="form-control"
              name="designation"
              placeholder="Enter your designation"
              value={formData.designation}
              onChange={handleChange}
            />
            {errors.designation && <span className="text-danger">{errors.designation}</span>}
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label d-block">Gender:</label>
          <div>
            <label className="form-check-label me-3">
              <input
                type="radio"
                className="form-check-input"
                name="gender"
                value="Male"
                checked={formData.gender === 'Male'}
                onChange={handleChange}
              />{' '}
              Male
            </label>
            <label className="form-check-label">
              <input
                type="radio"
                className="form-check-input"
                name="gender"
                value="Female"
                checked={formData.gender === 'Female'}
                onChange={handleChange}
              />{' '}
              Female
            </label>
          </div>
          {errors.gender && <span className="text-danger d-block">{errors.gender}</span>}
        </div>
        <div className="mb-3">
          <label className="form-label">Course:</label>
          <div>
            <label className="form-check-label me-3">
              <input
                type="checkbox"
                className="form-check-input"
                name="MCA"
                checked={formData.courses.includes('MCA')}
                onChange={handleChange}
              />{' '}
              MCA
            </label>
            <label className="form-check-label me-3">
              <input
                type="checkbox"
                className="form-check-input"
                name="BCA"
                checked={formData.courses.includes('BCA')}
                onChange={handleChange}
              />{' '}
              BCA
            </label>
            <label className="form-check-label">
              <input
                type="checkbox"
                className="form-check-input"
                name="BSC"
                checked={formData.courses.includes('BSC')}
                onChange={handleChange}
              />{' '}
              BSC
            </label>
          </div>
          {errors.courses && <span className="text-danger d-block">{errors.courses}</span>}
        </div>
        <div className="mb-3">
          <label className="form-label">Upload Image:</label>
          <input
            type="file"
            className="form-control"
            name="file"
            accept=".jpg,.jpeg,.png"
            onChange={handleChange}
          />
          {errors.file && <span className="text-danger">{errors.file}</span>}
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
     
    </div>
  );
};

export default CreateEmployee;
