// import React, { useState } from 'react';
// import google from '../../assets/googleicon.png'  
// import config from '../../config/config';
// import axios from 'axios';

// const Register = ({setIslogin}) => {

//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [error,setError] = useState();

//   const formRegister = (e) =>{
//     e.preventDefault();
//     console.log({username, password, confirmPassword})
//     if(username==="" || password==="" || confirmPassword===""){
//         setError('All fields are required !')
//     }
//     else if(confirmPassword !== password){
//       setError('Passwords does not match !')
//     }
//     else{
//       setError('')
//       const formData=new FormData()
//       formData.append('email',username)
//       formData.append('password',confirmPassword)
//       axios.post(`${config.registrationApi}`,formData)
//       .then((response)=>{
//         console.log(response.data)
//         if (response.status===201){
//           console.log("Registration Succesfull")
//           setIslogin(true)
//         }
//         // setIslogin(true)
//       }
//       )
//       .catch((error)=>{
//         console.log(error)
//         setError(error.response.data.error)
//       }
//       )

//     }
//   }
//   return (
    
//       <div className="right-panel">
//         <h1>WineHaus</h1>
//         <h2>Create an Account</h2>
//         <form onSubmit={formRegister}>
//           <label htmlFor="username">User name or Email</label>
//           <input type="text" id="username" name="username" placeholder="Username" value={username} onChange={(e)=>setUsername(e.target.value)} />
          
//           <label htmlFor="password">Password</label>
//           <input type="password" id="password" name="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} />

//           <label htmlFor="password">Confirm Password</label>
//           <input type="password" id="confirm_password" name="confirm_password" placeholder="Confirm password" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)}/>
          
          

//           <p className='form-error'>{error}</p>

          
//           <button type="submit">Sign Up</button>
          
          
//           <div className="create-account">
//             <a href="#" onClick={()=>setIslogin(true)}>Already registered? Sign In</a>
//           </div>
//         </form>
//       </div>
//   );
// };

// export default Register;

import React, { useState } from 'react';
import google from '../../assets/googleicon.png'  
import config from '../../config/config';
import axios from 'axios';

const Register = ({ setIslogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState();

  // Function to validate if the email is a valid Gmail address
  const isValidGmail = (email) => {
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return gmailRegex.test(email);
  };

  const formRegister = (e) => {
    e.preventDefault();
    console.log({ username, password, confirmPassword });

    if (username === "" || password === "" || confirmPassword === "") {
      setError('All fields are required!');
    } else if (!isValidGmail(username)) {
      setError('Please enter a valid Gmail address.');
    } else if (confirmPassword !== password) {
      setError('Passwords do not match!');
    } else {
      setError('');
      const formData = new FormData();
      formData.append('email', username);
      formData.append('password', confirmPassword);

      axios.post(`${config.registrationApi}`, formData)
        .then((response) => {
          console.log(response.data);
          if (response.status === 201) {
            console.log("Registration Successful");
            setIslogin(true);
          }
        })
        .catch((error) => {
          console.log(error);
          setError(error.response.data.error);
        });
    }
  };

  return (
    <div className="right-panel">
      <h1>WineHaus</h1>
      <h2>Create an Account</h2>
      <form onSubmit={formRegister}>
        <label htmlFor="username">User name or Email</label>
        <input
          type="text"
          id="username"
          name="username"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label htmlFor="password">Confirm Password</label>
        <input
          type="password"
          id="confirm_password"
          name="confirm_password"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <p className='form-error'>{error}</p>

        <button type="submit">Sign Up</button>

        <div className="create-account">
          <a href="#" onClick={() => setIslogin(true)}>Already registered? Sign In</a>
        </div>
      </form>
    </div>
  );
};

export default Register;
