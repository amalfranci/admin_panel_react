import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    designation: '',
    gender: 'Male',
    courses: [],
    isActive: true,
    imageUrl: ''
  });
  const [file, setFile] = useState(null); 
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/employee/${id}`);
        setFormData(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching employee:', error);
        toast.error('Failed to fetch employee details');
        setIsLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

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
      setFile(files[0]); // Set the first file from the selected files
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

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

    if (!file && !formData.imageUrl) {
      validationErrors.file = 'Upload an image file';
    } else if (file) {
      const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;
      if (!allowedExtensions.exec(file.name)) {
        validationErrors.file = 'Only JPG/PNG files are allowed';
      }
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        let imageUrl = formData.imageUrl;

        if (file) {
          const imageFormData = new FormData();
          imageFormData.append("file", file);
          imageFormData.append("upload_preset", "socialmedia_image");

          const response = await axios.post(
            `https://api.cloudinary.com/v1_1/{$}/image/upload`,
            imageFormData
          );

          imageUrl = response.data.secure_url;
        }

        const employeeData = {
          ...formData,
          imageUrl
        };

        const serverResponse = await axios.put(`http://localhost:4000/api/employee/${id}`, employeeData);

        toast.success(serverResponse.data.message);

        navigate('/employe');
      } catch (error) {
        console.error('Error updating the employee', error);
        toast.error(error.response?.data?.message || 'Error occurred');
      }
    }
  };

  const handleCancel = () => {
    navigate('/employe');
  };

  return (
    <div className="container my-4">
      <h2 className="mb-4">Edit Employee</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <ToastContainer />
          <div className="row mb-3">
            <div className="col">
              <label className="form-label">Name:</label>
              <input
                type="text"
                className="form-control"
                name="name"
                placeholder={formData.name}
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
                placeholder={formData.email}
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
                placeholder={formData.mobile}
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
                placeholder={formData.designation}
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
            {formData.imageUrl && (
              <div className="mt-2">
                <img
                  src={formData.imageUrl}
                  alt="Employee"
                  style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                />
              </div>
            )}
          </div>
          <div className="d-flex">
            <button type="submit" className="btn btn-primary me-2">Submit</button>
            <button type="button" className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default EditEmployee;
