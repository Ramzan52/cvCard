import React from 'react'
import BlobsImg from "../assets/images/blob1.svg";
import BlobsImg2 from "../assets/images/blob2.svg";
function ForgetPassword() {
  return (
    <div className="login-main">
    <div className="container">
        <div className="card-login mx-auto">
            <div className="card-inner-content">
                <h3>Forget Password</h3>
                <div className="alert alert-bg">
                    Please Enter your Email to change your password.
                </div>
                <div className="mb-3">
                    <label >Enter Email</label>
                    <input type="email" className="form-control"  />
                </div>
                {/* <div className="mb-3">
                    <label >Create new password</label>
                    <input type="password" className="form-control"  />
                </div>
                <div className="mb-3">
                    <label >Confirm new password</label>
                    <input type="password" className="form-control"  />
                </div> */}
                <button className="btn btn-dark w-100">Continue</button>
            </div>
            <img src={BlobsImg} alt="animate images" className="blob1"/>
            <img src={BlobsImg2} alt="animate images" className="blob2"/>
        </div>
    </div>
</div>
  )
}

export default ForgetPassword