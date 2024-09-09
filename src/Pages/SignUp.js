import React from 'react';
import "../Styles/SignUp.css";
import { useAuthValue } from '../authContext';
import { useNavigate } from 'react-router-dom';


function SignUp() {
  // const [email , setEmail] = useState([]);
  // const [password , setPassword] = useState([]);
  // const [name , setName] = useState([]);
  const {email,setEmail,password,setPassword ,name,setName,handleSignUp, } = useAuthValue();
   const navigate = useNavigate();

  const SignUpOnSubmit = (e) => {
      e.preventDefault();
      handleSignUp(navigate);
  };
  return (
    <div className='singUpPage'>
        <form className='singUpForm' onSubmit={SignUpOnSubmit}>
            <h2>Sign Up</h2>
            <input type='username' name='username' placeholder='Enter User Name' className='singUpInput'
            value={name} onChange={((e)=>setName(e.target.value))}/>
            <input type='email' name='email' placeholder='Enter Email' className='singUpInput'
            value={email} onChange={((e)=>setEmail(e.target.value))}/>
            <input type='password' name='password' placeholder='Enter Password' className='singUpInput'
             value={password} onChange={((e)=>setPassword(e.target.value))}/>
            <button className='singUpBtn'>Sign Up</button>
            
        </form>
    </div>
  )
}

export default SignUp