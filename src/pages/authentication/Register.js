// import React, { useState } from 'react';
// import google from '../../assets/googleicon.png'  
// import config from '../../config/config';
// import axios from 'axios';

// const Register = ({ setIslogin }) => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [error, setError] = useState();

//   // Function to validate if the email is a valid Gmail address
//   const isValidGmail = (email) => {
//     const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
//     return gmailRegex.test(email);
//   };

//   const formRegister = (e) => {
//     e.preventDefault();
//     console.log({ username, password, confirmPassword });

//     if (username === "" || password === "" || confirmPassword === "") {
//       setError('All fields are required!');
//     } else if (!isValidGmail(username)) {
//       setError('Please enter a valid Gmail address.');
//     } else if (confirmPassword !== password) {
//       setError('Passwords do not match!');
//     } else {
//       setError('');
//       const formData = new FormData();
//       formData.append('email', username);
//       formData.append('password', confirmPassword);

//       axios.post(`${config.registrationApi}`, formData)
//         .then((response) => {
//           console.log(response.data);
//           if (response.status === 201) {
//             console.log("Registration Successful");
//             setIslogin(true);
//           }
//         })
//         .catch((error) => {
//           console.log(error);
//           setError(error.response.data.error);
//         });
//     }
//   };

//   return (
//     <div className="right-panel">
//       <h1>WineHaus</h1>
//       <h2>Create an Account</h2>
//       <form onSubmit={formRegister}>
//         <label htmlFor="username">User name or Email</label>
//         <input
//           type="text"
//           id="username"
//           name="username"
//           placeholder="Username"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//         />

//         <label htmlFor="password">Password</label>
//         <input
//           type="password"
//           id="password"
//           name="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />

//         <label htmlFor="password">Confirm Password</label>
//         <input
//           type="password"
//           id="confirm_password"
//           name="confirm_password"
//           placeholder="Confirm password"
//           value={confirmPassword}
//           onChange={(e) => setConfirmPassword(e.target.value)}
//         />

//         <p className='form-error'>{error}</p>

//         <button type="submit">Sign Up</button>

//         <div className="create-account">
//           <a href="#" onClick={() => setIslogin(true)}>Already registered? Sign In</a>
//         </div>
//       </form>
//     </div>
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
  const [otp, setOtp] = useState('');

  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState();
  const [showOtpPage, setShowOtpPage] = useState(false)

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
      setShowOtpPage(true)


      axios.post(`http://localhost:8000/api/v1/auth/register/`, formData)
        .then((response) => {
          console.log(response.data);
          if (response.status === 201) {
            console.log("OTP send to email");
            // setIslogin(true);
          }
        })
        .catch((error) => {
          console.log(error);
          setError(error.response.data.error);
        });
    }
  };

  const validateOtp = () => {

    const formData = new FormData();
    formData.append('otp', otp);
    formData.append('email', username);


    axios.post(`http://localhost:8000/api/v1/auth/validate-otp/`, formData)
      .then((response) => {
        console.log(response.data);
        if (response.status === 201) {
          console.log("OTP send to email");
          setIslogin(true);
          // setShowOtpPage(true)
        }
      })
      .catch((error) => {
        console.log(error);
        setError(error.response.data.error);
      });


  }

  return (
    <div className="right-panel">
      <h1>WineHaus</h1>
      <h2>Create an Account</h2>
      {!showOtpPage ?

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
        :
        <div>

          <form >
            <label htmlFor="otp">Enter the OTP received on your email</label>
            <input
              type="text"
              id="otp"
              name="otp"
              placeholder="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <p className='form-error'>{error}</p>

            <button type='submit' onClick={validateOtp}>Validate OTP</button>
          </form>

        </div>
      }

    </div>
  );
};

export default Register;