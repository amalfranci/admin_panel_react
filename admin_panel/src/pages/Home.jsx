import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className='d-flex justify-content-center align-items-center p-5 mt-5 m-5'>
      <div className='text-center p-4 border rounded shadow bg-light m-5'>
        <h1 className='text-primary mb-4'>Welcome to the Dashboard</h1>
        <div className='text-danger'>Admin</div>
      </div>
    </div>
  );
}

export default Home;
