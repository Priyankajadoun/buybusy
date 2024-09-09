import React from 'react';
import home from '../assets/home.png'
import SignIn from "../assets/logIn.png"
import LogOut from "../assets/logout.png"
import Orders from "../assets/orders.png"
import Cart from "../assets/cart.png"
import "../Styles/Navbar.css"
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuthValue } from '../authContext';
import { useProdValue } from '../productContext';
import { toast } from "react-toastify";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuthValue();
  const { cart} = useProdValue();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(navigate);
  };

  function handleCart(){
    if(cart.length === 0){
    { toast.error('No product in cart!')}
    }
  }
  return (
    <>
      <div className='nav'>
        <div className='navbar-container'>
          <Link to="/" className='nav-logo'>BuyBusy</Link>
        </div>
        <ul className='nav-menu'>
          <li className='nav-item'>
            <Link to="/" className='nav-link'>
              <span>
                <img src={home} alt='Home' className='icon' />
              </span>
              <h4>Home</h4>
            </Link>

          </li>
          <li className='nav-item'>
            <Link to="/orders" className='nav-link'>
              <span>
                <img src={Orders} alt='Home' className='icon' />
              </span>
              <h4>My Orders</h4>
            </Link>

          </li>
          <li className='nav-item'>
            <Link to="/cart" className='nav-link' onClick={handleCart}>
              <span>
                <img src={Cart} alt='Home' className='icon' />
              </span>
              <h4>Cart</h4>
            </Link>

          </li>
          <li className='nav-item'>
            {/* <Link to="/signin" className='nav-link'>
              <span>
                <img src={SignIn} alt='SignIn' className='icon' />
              </span>
              <h4>SignIn</h4>
            </Link> */}
            {console.log("isAuthenticated", isAuthenticated)}
            {isAuthenticated ? (
              <Link to="/signin" className='nav-link' onClick={handleLogout}>
                <span>
                  <img src={LogOut} alt='LogOut' className='icon' />
                </span>
                <h4>Log Out</h4>
              </Link>
            ) : (
              <Link to="/signin" className='nav-link'>
                <span>
                  <img src={SignIn} alt='SignIn' className='icon' />
                </span>
                <h4>Sign In</h4>
              </Link>
            )}
          </li>
        </ul>
      </div>
      <Outlet />
    </>
  )
}
