import React, { useState } from 'react';
import google from './assets/googleicon.png'  

const Register = ({setIslogin}) => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error,setError] = useState();

  const formRegister = (e) =>{
    e.preventDefault();
    console.log({username, password, confirmPassword})
    if(username==="" || password==="" || confirmPassword===""){
        setError('All fields are required !')
    }
    else if(confirmPassword !== password){
      setError('Passwords does not match !')
    }
    else{
      setError('')
      console.log('Form values accepted !')
    }
  }
  return (
    
      <div className="right-panel">
        <h1>WineHaus</h1>
        <h2>Create an Account</h2>
        <form onSubmit={formRegister}>
          <label htmlFor="username">User name or Email</label>
          <input type="text" id="username" name="username" placeholder="Username" value={username} onChange={(e)=>setUsername(e.target.value)} />
          
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} />

          <label htmlFor="password">Confirm Password</label>
          <input type="password" id="confirm_password" name="confirm_password" placeholder="Confirm password" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)}/>
          
          <div className="forgot-password">
            <a href="#">Forgot password?</a>
          </div>

          <p className='form-error'>{error}</p>

          
          <button type="submit">Sign Up</button>
          
           <div className="or-section">
            <span>or</span>
          </div>
          
          <button type="button" className="google-signin">
            <img src={google} alt="Google Icon" />
            Sign in with Google
          </button> 
          
          <div className="create-account">
            <a href="#" onClick={()=>setIslogin(true)}>Already registered? Sign In</a>
          </div>
        </form>
      </div>
  );
};

export default Register;
