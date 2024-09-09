// import React, { useState } from 'react'
import "../Styles/SignIn.css";
import { Link } from 'react-router-dom';
import { useAuthValue } from '../authContext';
import { useNavigate } from "react-router-dom";


function SignIn() {
  // const [email , setEmail] = useState([]);
  // const [password , setPassword] = useState([]);
  const { email, setEmail, password, setPassword, handleSignIn  } = useAuthValue();
  const navigate = useNavigate();

  const LogInOnSubmit = (e) => {
      e.preventDefault();
      handleSignIn(navigate);
  };

  return (
    <>
      <div className='LoginPage'>
        <form className='LogInForm' onSubmit={LogInOnSubmit}>
          <h2>Sign In</h2>
          <input type='email' name='email' placeholder='Enter Email' className='loginInput'
            value={email} onChange={((e) => setEmail(e.target.value))}
          />
          <input type='password' name='password' placeholder='Enter Password' className='loginInput'
            value={password} onChange={((e) => setPassword(e.target.value))}
          />
          <button className='loginBtn'>Sign In</button>
          <Link to="/signup">
            <p>Or Sign Up Instead</p>
          </Link>
        </form>
      </div>
    </>
  )
}

export default SignIn