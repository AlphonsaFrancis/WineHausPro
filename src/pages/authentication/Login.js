import React, { useState, useEffect } from "react";
import google from "../../assets/googleicon.png";
import config from "../../config/config";
import axios from "axios";
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

const Login = ({ setIslogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState();
  const [isforgetpassword, setisforgetpassword] = useState(false);
  const [user, setUser] = useState([]);
  const [profile, setProfile] = useState([]);
  const navigate = useNavigate();

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      setUser(codeResponse);

      axios
        .post(
          config.googleAuthLoginApi,
          {
            token: codeResponse.access_token,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          console.log('Google User signed in', response.data);
          // Store access token and user info in localStorage
          localStorage.setItem('authToken', codeResponse.access_token);
          localStorage.setItem('user', JSON.stringify(response.data.user));

          if (response.status === 200) {
            navigate('/');
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
    onError: (error) => console.log("Login Failed:", error),
  });

  useEffect(() => {
    if (user) {
      axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
              Accept: "application/json",
            },
          }
        )
        .then((res) => {
          setProfile(res.data);
          console.log(res.data);
        })
        .catch((err) => console.log(err));
    }
  }, [user]);

  // Function to validate if the email is a valid Gmail address
  const isValidGmail = (email) => {
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return gmailRegex.test(email);
  };
  

  const formSubmit = (e) => {
    e.preventDefault();
    console.log({ username, password });

    if (username === "" || password === "") {
      setError("All fields are required !");
    } else if (!isValidGmail(username)) {
      setError("Please enter a valid Gmail address.");
    } else {
      setError("");
      const formData = new FormData();
      formData.append("email", username);
      formData.append("password", password);
      axios
        .post(`${config.loginApi}`, formData)
        .then((response) => {
          console.log(response.data);
          // Store access token and user info in localStorage
          const { access, user_id } = response.data;

          localStorage.setItem('authToken', response.data.access); // Adjust this line if your response structure is different
          localStorage.setItem('user', JSON.stringify(response.data.user));
          localStorage.setItem('userId', user_id);

          console.log(user_id);

          if (response.status === 200) {
            console.log("Login Successful");
            if (response.data.user.is_superuser) {
              navigate('/admin');
            } else if (response.data.user.is_staff) {
              navigate('/staff');
            } else {
              navigate('/');
            }
          }
        })
        .catch((error) => {
          console.log(error);
          setError(error.response.data.error);
        });
    }
  };

  const resetPassword = () => {
    console.log("reset password");
    setisforgetpassword(true);
  };

  const requestresetpassword = () => {
    const formData = new FormData();
    formData.append("email", username);
    axios
      .post(`${config.passwordResetApi}`, formData)
      .then((response) => {
        console.log(response.data);
        if (response.status === 200)
          alert("Reset password link sent to your email");
      })
      .catch((error) => {
        console.log(error);
        setError(error.response.data.error);
      });
  };

  return (
    <div className="right-panel">
      <h1>WineHaus</h1>
      <h2>Let Us Start..</h2>
      {!isforgetpassword ? (
        <form onSubmit={formSubmit}>
          <label htmlFor="username">Email</label>
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

          <div className="forgot-password">
            <a href="#" onClick={resetPassword}>
              Forgot password?
            </a>
          </div>

          <p className="form-error">{error}</p>

          <button type="submit">Sign in</button>

          <div className="or-section">
            <span>or</span>
          </div>

          <button
          id='login'
            type="button"
            className="google-signin"
            onClick={() => login()}
          >
            <img src={google} alt="Google Icon" />
            Sign in with Google
          </button>

          <div className="create-account">
            <a href="#" onClick={() => setIslogin(false)}>
              New User? Create Account
            </a>
          </div>
        </form>
      ) : (
        <form>
          <h2>
            <center>Reset Your Password</center>
          </h2>
          <label htmlFor="username">Enter Your Registered Email</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <p className="form-error">{error}</p>

          <button onClick={requestresetpassword} className="submit-button">
            Reset Password
          </button>
        </form>
      )}
    </div>
  );
};

export default Login;
