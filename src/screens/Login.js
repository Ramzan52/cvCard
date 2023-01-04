import React,{useState} from 'react'
import { Link,useNavigate } from 'react-router-dom';
import BlobsImg from "../assets/images/blob1.svg";
import BlobsImg2 from "../assets/images/blob2.svg";
import authSvc from "../services/auth-service";
import notificationSvc from "../services/notification-service";

const Login = (props) => {
    let myemail="code@aquila360.com";
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
  
    const login = async () => {
        const isLoggedIn = await authSvc.login(email, password);
    
        if (isLoggedIn) {
          props.onLogin();
          navigate("/");
        }else{
          notificationSvc.error("Invalid credentials");
        }
      };
      const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            login();
        }
      }
    return (
        <div className="login-main">
        <div className="container">
            <div className="card-login mx-auto">
                <div className="card-inner-content">
                    <h3>Log In</h3>
                    <p>Welcome! Please Login to your account </p>
                    <div className="mb-3">
                        <label >Username</label>
                        <input type="text" className="form-control" value={email}
                          onChange={(e) => setEmail(e.target.value)} placeholder="Enter username" onKeyDown={handleKeyDown}/>
                    </div>
                    <div className="mb-3">
                        <label >Password</label>
                        <input type="password"  value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          id="floatingPassword" className="form-control"  placeholder="Enter password" onKeyDown={handleKeyDown}/>
                         
                    </div>
                    <div className="mb-3 cta-login">
                        <div className="custom-check">
                            <input type="checkbox"  id="check1" className="checkbox-style"/>
                            {/* <label htmlFor="check1"><span>Remember me</span> </label> */}
                        </div>
                        {/* <Link to="/forget-password">Forgot Password ?</Link> */}
                    </div>
                    <button className="btn btn-dark w-100" onClick={login}>Login</button>
                    <p className="note">Don't have Account ? <a href = {`mailto:${myemail}`}>Contact Admin</a></p>
                </div>
                <img src={BlobsImg} alt="animate images" className="blob1"/>
                <img src={BlobsImg2} alt="animate images" className="blob2"/>
            </div>
        </div>
    </div>
    )
}

export default Login
