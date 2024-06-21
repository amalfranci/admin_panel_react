import React, { useState, useEffect } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "bootstrap/dist/css/bootstrap.min.css";

function Employees() {
  const navigate=useNavigate()
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

   useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {

        
        const response = await axios.get('http://localhost:4000/api/getemploye');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    sortData(key, direction);
  };

  const sortData = (key, direction) => {
    const sortedData = [...data].sort((a, b) => {
      if (key === 'id') {
        if (a._id < b._id) return direction === 'asc' ? -1 : 1;
        if (a._id > b._id) return direction === 'asc' ? 1 : -1;
      } else if (key === 'createDate') {
        if (new Date(a.createDate) < new Date(b.createDate)) return direction === 'asc' ? -1 : 1;
        if (new Date(a.createDate) > new Date(b.createDate)) return direction === 'asc' ? 1 : -1;
      } else {
        if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
        if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    setData(sortedData);
  };

  const handleStatusToggle = async (id, currentStatus) => {
    try {
      const updatedData = data.map(item => {
        if (item._id === id) {
          return { ...item, isActive: !currentStatus };
        }
        return item;
      });
      setData(updatedData);

      
      await axios.put(`http://localhost:4000/api/getemploye/${id}`, { isActive: !currentStatus });

    } catch (error) {
      console.error('Error updating employee status:', error);
      // Rollback state change if update fails
      const rollbackData = data.map(item => {
        if (item._id === id) {
          return { ...item, isActive: currentStatus };
        }
        return item;
      });
      setData(rollbackData);
    }
  };

  const filteredData = data.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.mobile.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.designation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleDelete = async (id, name) => {
    const confirmed = window.confirm(`Are you sure you want to delete ${name}?`);
    if (confirmed) {
      try {
        const response = await axios.delete(`http://localhost:4000/api/deleteemploye/${id}`);
        if (response.status === 200) {
          setData(data.filter(item => item._id !== id));
          toast.success(`${name} has been deleted successfully.`);
        }
      } catch (error) {
        console.error('Error deleting employee:', error);
        toast.error('Failed to delete employee.');
      }
    }
  };

  return (
    <div className='container my-4'>
      <ToastContainer />
      <h2 className='text-center mb-4'>Employees</h2>
      <div className='row mb-3'>
        <div className='col-6'>
          <Link className='btn btn-primary' to="/createEmploye" role='button'>Create Employee</Link>
        </div>
        <div className='col-6 text-end'>
          <input
            type="text"
            className="form-control"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>
      <div className='row'>
        <div className='col-12'>
          <div className="table-responsive">
            <table className='table table-striped table-bordered'>
              <thead className="thead-dark">
                <tr>
                  <th onClick={() => handleSort('id')} style={{ cursor: 'pointer' }}>ID</th>
                  <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>Name</th>
                  <th onClick={() => handleSort('email')} style={{ cursor: 'pointer' }}>Email</th>
                  <th onClick={() => handleSort('createDate')} style={{ cursor: 'pointer' }}>Create Date</th>
                  <th onClick={() => handleSort('mobile')} style={{ cursor: 'pointer' }}>Mobile No</th>
                  <th onClick={() => handleSort('designation')} style={{ cursor: 'pointer' }}>Designation</th>
                  <th onClick={() => handleSort('gender')} style={{ cursor: 'pointer' }}>Gender</th>
                  <th onClick={() => handleSort('course')} style={{ cursor: 'pointer' }}>Course</th>
                  <th onClick={() => handleSort('isActive')} style={{ cursor: 'pointer' }}>Status</th>
                  <th>Image</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((item) => (
                  <tr key={item._id}>
                    <td>{item._id.slice(-3)}</td> {/* Display last 3 digits of ID */}
                    <td>{item.name}</td>
                    <td>{item.email}</td>
                    <td>{new Date(item.createDate).toLocaleDateString()}</td> {/* Format date as needed */}
                    <td>{item.mobile}</td>
                    <td>{item.designation}</td>
                    <td>{item.gender}</td>
                    <td>{item.courses.join(', ')}</td>
                    <td>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={item.isActive}
                          onChange={() => handleStatusToggle(item._id, item.isActive)}
                        />
                        <span className="slider round"></span>
                      </label>
                    </td>
                    <td>
                      <img src={item.imageUrl} alt={item.name} style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                    </td>
                    <td>
                      <Link to={`/employeeEdit/${item._id}`} className="btn btn-warning btn-sm me-2">Edit</Link>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(item._id, item.name)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className='row'>
        <div className='col-12  d-flex justify-content-between '>
          <button
            className='btn btn-secondary'
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button
            className='btn btn-secondary'
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default Employees;
