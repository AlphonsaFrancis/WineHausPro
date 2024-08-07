import React, { useState } from 'react'
import Login from './Login'
import Register from './Register'
import wine from '../../assets/glassWine2.png'
 


function RegLogin() {

    const [isLogin,setIslogin]=useState(true) 
    return (
        <div className="login-container">
            <div className="left-panel">
                <div className="illustration">
                    <img src={wine} alt="Wine" />
                </div>
                <div className="text-section">
                    <h2>Wine is bottled poetry</h2>
                    <p>" A bottle of wine contains more philosophy than all the books in the world. "</p>
                </div>
            </div>
            {isLogin ? <Login setIslogin={setIslogin}  /> : <Register setIslogin={setIslogin} />}
        </div>
    )
}

export default RegLogin
