import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

export function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  // FOR LOGOUT
  const handleLogout = () => {
    axios
      .post("http://localhost:4000/api/logout", {}, { withCredentials: true })
      .then((res) => {
        console.log(res);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate("/login");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <nav className="navbar navbar-expand-lg bg-light border-bottom box-shadow shadow-lg">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <img
            src="https://st4.depositphotos.com/11956860/28789/v/450/depositphotos_287891936-stock-illustration-illustration-icon-concept-sustainable-employee.jpg"
            width="60px"
            height="60px"
            alt="Logo"
            className="me-2"
          />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link text-dark link-opacity-50-hover " aria-current="page" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-dark" to="/employe">
                Employee List
              </Link>
            </li>
          </ul>
          <ul className="navbar-nav">
            {token ? (
              <>
                <li className="nav-item">
                  <span className="nav-link text-dark">
                    {user ? `Welcome, ${user}` : 'Welcome'}
                  </span>
                </li>
                <li className="nav-item">
                  <button className="btn btn-link nav-link text-dark" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            ) : (""
              // <li className="nav-item">
              //   <Link className="nav-link text-dark" to="/login">
              //     Login
              //   </Link>
              // </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
